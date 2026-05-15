import { prisma } from "@/lib/prisma";
import { hashSDKKey } from "@/lib/sdkKey";
import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";

import { GET } from "./route";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    sDKKey: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    featureFlagEnvironment: {
      findMany: vi.fn(),
    },
  },
}));

describe("GET /api/sdk/flags", () => {
  const plaintextSDKKey = `ff_prod_${"a".repeat(32)}`;
  const keyHash = hashSDKKey(plaintextSDKKey);

  beforeEach(() => {
    vi.clearAllMocks();
    (prisma.sDKKey.update as Mock).mockResolvedValue({});
  });

  function requestWithAuthorization(authorization?: string) {
    return new Request("http://localhost:3000/api/sdk/flags", {
      headers: authorization ? { Authorization: authorization } : undefined,
    });
  }

  it("returns expected flags for a valid SDK key", async () => {
    (prisma.sDKKey.findUnique as Mock).mockResolvedValue({
      id: "sdk_1",
      projectId: "project_a",
      environmentId: "env_a",
      keyHash,
      revokedAt: null,
    });
    (prisma.featureFlagEnvironment.findMany as Mock).mockResolvedValue([
      { enabled: true, featureFlag: { key: "lesson-demo" } },
      { enabled: false, featureFlag: { key: "lesson-plan-demo" } },
    ]);

    const response = await GET(
      requestWithAuthorization(`Bearer ${plaintextSDKKey}`),
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(data).toEqual({
      flags: {
        "lesson-demo": true,
        "lesson-plan-demo": false,
      },
    });
    expect(prisma.featureFlagEnvironment.findMany).toHaveBeenCalledWith({
      where: {
        environmentId: "env_a",
        featureFlag: {
          projectId: "project_a",
        },
      },
      select: {
        enabled: true,
        featureFlag: {
          select: {
            key: true,
          },
        },
      },
    });
    expect(prisma.sDKKey.update).toHaveBeenCalledWith({
      where: { id: "sdk_1" },
      data: { lastUsedAt: expect.any(Date) },
    });
  });

  it("returns 401 when the Authorization header is missing", async () => {
    const response = await GET(requestWithAuthorization());
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toEqual({ error: "Missing Authorization header." });
    expect(prisma.sDKKey.findUnique).not.toHaveBeenCalled();
  });

  it("returns 401 when the Authorization header is malformed", async () => {
    const response = await GET(requestWithAuthorization("Basic abc123"));
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toEqual({
      error: "Authorization header must use Bearer token.",
    });
    expect(prisma.sDKKey.findUnique).not.toHaveBeenCalled();
  });

  it("returns 401 when the SDK key is unknown", async () => {
    (prisma.sDKKey.findUnique as Mock).mockResolvedValue(null);

    const response = await GET(
      requestWithAuthorization(`Bearer ${plaintextSDKKey}`),
    );
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toEqual({ error: "Invalid SDK key." });
    expect(prisma.featureFlagEnvironment.findMany).not.toHaveBeenCalled();
  });

  it("returns 401 when the SDK key is revoked", async () => {
    (prisma.sDKKey.findUnique as Mock).mockResolvedValue({
      id: "sdk_1",
      projectId: "project_a",
      environmentId: "env_a",
      keyHash,
      revokedAt: new Date("2026-05-15T12:00:00Z"),
    });

    const response = await GET(
      requestWithAuthorization(`Bearer ${plaintextSDKKey}`),
    );
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toEqual({ error: "SDK key has been revoked." });
    expect(prisma.featureFlagEnvironment.findMany).not.toHaveBeenCalled();
  });

  it("scopes flag reads to the key's project and environment", async () => {
    (prisma.sDKKey.findUnique as Mock).mockResolvedValue({
      id: "sdk_project_a",
      projectId: "project_a",
      environmentId: "env_project_a",
      keyHash,
      revokedAt: null,
    });
    (prisma.featureFlagEnvironment.findMany as Mock).mockResolvedValue([
      { enabled: true, featureFlag: { key: "project-a-flag" } },
    ]);

    const response = await GET(
      requestWithAuthorization(`Bearer ${plaintextSDKKey}`),
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ flags: { "project-a-flag": true } });
    expect(prisma.featureFlagEnvironment.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          environmentId: "env_project_a",
          featureFlag: {
            projectId: "project_a",
          },
        },
      }),
    );
  });
});
