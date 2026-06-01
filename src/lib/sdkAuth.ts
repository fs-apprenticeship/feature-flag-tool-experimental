import { prisma } from "@/lib/prisma";
import { hashSDKKey, isSDKKeyHashMatch } from "@/lib/sdkKey";

type SDKAuthErrorCode =
  | "MISSING_AUTHORIZATION"
  | "MALFORMED_AUTHORIZATION"
  | "INVALID_SDK_KEY"
  | "REVOKED_SDK_KEY";

export class SDKAuthError extends Error {
  readonly code: SDKAuthErrorCode;
  readonly status = 401;

  constructor(message: string, code: SDKAuthErrorCode) {
    super(message);
    this.name = "SDKAuthError";
    this.code = code;
  }
}

export type SDKAuthContext = {
  projectId: string;
  environmentId: string;
};

export async function authenticateSDKRequest(
  request: Request,
): Promise<SDKAuthContext> {
  const plaintextKey = readBearerToken(request);
  const keyHash = hashSDKKey(plaintextKey);

  const sdkKey = await prisma.sDKKey.findUnique({
    where: { keyHash },
    select: {
      id: true,
      projectId: true,
      environmentId: true,
      keyHash: true,
      revokedAt: true,
    },
  });

  if (!sdkKey || !isSDKKeyHashMatch(plaintextKey, sdkKey.keyHash)) {
    throw new SDKAuthError("Invalid SDK key.", "INVALID_SDK_KEY");
  }

  if (sdkKey.revokedAt) {
    throw new SDKAuthError("SDK key has been revoked.", "REVOKED_SDK_KEY");
  }

  void prisma.sDKKey
    .update({
      where: { id: sdkKey.id },
      data: { lastUsedAt: new Date() },
    })
    .catch(() => undefined);

  return {
    projectId: sdkKey.projectId,
    environmentId: sdkKey.environmentId,
  };
}

function readBearerToken(request: Request): string {
  const authorization = request.headers.get("authorization");

  if (!authorization) {
    throw new SDKAuthError(
      "Missing Authorization header.",
      "MISSING_AUTHORIZATION",
    );
  }

  const [scheme, token, ...extra] = authorization.trim().split(/\s+/);

  if (scheme?.toLowerCase() !== "bearer" || !token || extra.length > 0) {
    throw new SDKAuthError(
      "Authorization header must use Bearer token.",
      "MALFORMED_AUTHORIZATION",
    );
  }

  return token;
}
