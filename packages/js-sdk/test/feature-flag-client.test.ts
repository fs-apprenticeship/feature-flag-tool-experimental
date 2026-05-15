import { afterEach, describe, expect, it, vi } from "vitest";

import { FeatureFlagClient, FeatureFlagClientError } from "../src";

describe("FeatureFlagClient", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches flags on init and caches them in memory", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          flags: {
            "lesson-demo": true,
            "lesson-plan-demo": false,
          },
        }),
        { status: 200 },
      ),
    );

    const client = new FeatureFlagClient({
      apiUrl: "https://featureflags.example.com",
      sdkKey: "sdk_test_123",
      fetch: fetchMock,
    });

    await client.init();

    expect(client.isEnabled("lesson-demo")).toBe(true);
    expect(client.isEnabled("lesson-plan-demo")).toBe(false);
    expect(client.getAllFlags()).toEqual({
      "lesson-demo": true,
      "lesson-plan-demo": false,
    });
  });

  it("returns false and warns once for an unknown flag", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ flags: { "lesson-demo": true } }), {
        status: 200,
      }),
    );

    const client = new FeatureFlagClient({
      apiUrl: "https://featureflags.example.com",
      sdkKey: "sdk_test_123",
      fetch: fetchMock,
    });

    await client.init();

    expect(client.isEnabled("missing-flag")).toBe(false);
    expect(client.isEnabled("missing-flag")).toBe(false);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalledWith(
      "Unknown feature flag requested: missing-flag",
    );
  });

  it("surfaces init fetch failures as FeatureFlagClientError", async () => {
    const client = new FeatureFlagClient({
      apiUrl: "https://featureflags.example.com",
      sdkKey: "sdk_test_123",
      fetch: vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ error: "unauthorized" }), {
          status: 401,
          statusText: "Unauthorized",
        }),
      ),
    });

    await expect(client.init()).rejects.toMatchObject({
      name: "FeatureFlagClientError",
      code: "FETCH_FAILED",
      status: 401,
    } satisfies Partial<FeatureFlagClientError>);
  });

  it("sends the sdkKey as a bearer token in the Authorization header", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ flags: {} }), { status: 200 }),
    );

    const client = new FeatureFlagClient({
      apiUrl: "https://featureflags.example.com/",
      sdkKey: "sdk_test_123",
      fetch: fetchMock,
    });

    await client.init();

    expect(fetchMock).toHaveBeenCalledWith(
      "https://featureflags.example.com/api/sdk/flags",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer sdk_test_123",
        }),
      }),
    );
  });
});
