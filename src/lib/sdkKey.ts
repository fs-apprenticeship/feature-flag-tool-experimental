import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

const SDK_KEY_PREFIX = "ff_prod_";
export const SDK_KEY_PREFIX_LENGTH = 16;

export function generateSDKKey(): string {
  return `${SDK_KEY_PREFIX}${randomBytes(32).toString("base64url")}`;
}

export function hashSDKKey(plaintext: string): string {
  return createHash("sha256").update(plaintext).digest("hex");
}

export function getSDKKeyPrefix(plaintext: string): string {
  return plaintext.slice(0, SDK_KEY_PREFIX_LENGTH);
}

export function isSDKKeyHashMatch(
  plaintext: string,
  expectedHash: string,
): boolean {
  const actualHash = Buffer.from(hashSDKKey(plaintext), "hex");
  const expectedHashBuffer = Buffer.from(expectedHash, "hex");

  if (actualHash.length !== expectedHashBuffer.length) {
    return false;
  }

  return timingSafeEqual(actualHash, expectedHashBuffer);
}
