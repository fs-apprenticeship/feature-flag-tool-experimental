export interface FeatureFlagClientOptions {
  apiUrl: string;
  sdkKey: string;
  fetch?: typeof fetch;
}

type FeatureFlagsResponse = {
  flags: Record<string, boolean>;
};

type FeatureFlagClientErrorCode =
  | "INVALID_OPTIONS"
  | "FETCH_UNAVAILABLE"
  | "FETCH_FAILED"
  | "INVALID_RESPONSE";

export class FeatureFlagClientError extends Error {
  readonly code: FeatureFlagClientErrorCode;
  readonly status?: number;
  readonly cause?: unknown;

  constructor(
    message: string,
    options: {
      code: FeatureFlagClientErrorCode;
      status?: number;
      cause?: unknown;
    },
  ) {
    super(message);
    this.name = "FeatureFlagClientError";
    this.code = options.code;
    this.status = options.status;
    this.cause = options.cause;
  }
}

export class FeatureFlagClient {
  private readonly apiUrl: string;
  private readonly sdkKey: string;
  private readonly fetch?: typeof fetch;
  private flags: Record<string, boolean> = {};
  private readonly warnedUnknownKeys = new Set<string>();

  constructor(options: FeatureFlagClientOptions) {
    if (!options.apiUrl.trim()) {
      throw new FeatureFlagClientError("apiUrl is required.", {
        code: "INVALID_OPTIONS",
      });
    }

    if (!options.sdkKey.trim()) {
      throw new FeatureFlagClientError("sdkKey is required.", {
        code: "INVALID_OPTIONS",
      });
    }

    this.apiUrl = options.apiUrl.replace(/\/+$/, "");
    this.sdkKey = options.sdkKey;
    this.fetch = options.fetch ?? globalThis.fetch?.bind(globalThis);
  }

  async init(): Promise<void> {
    if (!this.fetch) {
      throw new FeatureFlagClientError(
        "No fetch implementation is available. Provide FeatureFlagClientOptions.fetch.",
        { code: "FETCH_UNAVAILABLE" },
      );
    }

    let response: Response;

    try {
      response = await this.fetch(`${this.apiUrl}/api/sdk/flags`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.sdkKey}`,
        },
      });
    } catch (error) {
      throw new FeatureFlagClientError("Failed to fetch feature flags.", {
        code: "FETCH_FAILED",
        cause: error,
      });
    }

    if (!response.ok) {
      throw new FeatureFlagClientError(
        `Failed to fetch feature flags: ${response.status} ${response.statusText}`.trim(),
        {
          code: "FETCH_FAILED",
          status: response.status,
        },
      );
    }

    let payload: unknown;

    try {
      payload = await response.json();
    } catch (error) {
      throw new FeatureFlagClientError("Failed to parse feature flags response.", {
        code: "INVALID_RESPONSE",
        cause: error,
      });
    }

    const parsed = parseFlagsResponse(payload);
    this.flags = { ...parsed.flags };
  }

  isEnabled(flagKey: string): boolean {
    if (Object.prototype.hasOwnProperty.call(this.flags, flagKey)) {
      return this.flags[flagKey];
    }

    if (!this.warnedUnknownKeys.has(flagKey)) {
      this.warnedUnknownKeys.add(flagKey);
      console.warn(`Unknown feature flag requested: ${flagKey}`);
    }

    return false;
  }

  getAllFlags(): Record<string, boolean> {
    return { ...this.flags };
  }
}

function parseFlagsResponse(payload: unknown): FeatureFlagsResponse {
  if (!isRecord(payload) || !isRecord(payload.flags)) {
    throw new FeatureFlagClientError(
      "Invalid feature flags response: expected an object with a flags map.",
      { code: "INVALID_RESPONSE" },
    );
  }

  const flags: Record<string, boolean> = {};

  for (const [key, value] of Object.entries(payload.flags)) {
    if (typeof value !== "boolean") {
      throw new FeatureFlagClientError(
        `Invalid feature flags response: flag "${key}" must be a boolean.`,
        { code: "INVALID_RESPONSE" },
      );
    }

    flags[key] = value;
  }

  return { flags };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
