import { describe, expect, it } from "vitest";

import {
  generateSDKKey,
  getSDKKeyPrefix,
  hashSDKKey,
  isSDKKeyHashMatch,
  SDK_KEY_PREFIX_LENGTH,
} from "./sdkKey";

describe("sdkKey", () => {
  it("generates keys with the expected public format", () => {
    const sdkKey = generateSDKKey();

    expect(sdkKey).toMatch(/^ff_prod_[A-Za-z0-9_-]{32,}$/);
    expect(getSDKKeyPrefix(sdkKey)).toBe(
      sdkKey.slice(0, SDK_KEY_PREFIX_LENGTH),
    );
  });

  it("generates unique keys", () => {
    const sdkKeys = new Set(
      Array.from({ length: 100 }, () => generateSDKKey()),
    );

    expect(sdkKeys.size).toBe(100);
  });

  it("hashes keys deterministically without returning plaintext", () => {
    const sdkKey = generateSDKKey();
    const hash = hashSDKKey(sdkKey);

    expect(hash).toBe(hashSDKKey(sdkKey));
    expect(hash).not.toBe(sdkKey);
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
    expect(isSDKKeyHashMatch(sdkKey, hash)).toBe(true);
    expect(isSDKKeyHashMatch(`${sdkKey}x`, hash)).toBe(false);
  });
});
