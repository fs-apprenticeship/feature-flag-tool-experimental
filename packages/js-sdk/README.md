# @feature-flag-tool/js-sdk

JavaScript SDK for reading boolean feature flags from Feature Flag Tool.

## Install

```sh
npm install @feature-flag-tool/js-sdk
```

Publishing is not enabled yet, so local development should consume this package through the repo workspace.

## Quickstart

```ts
import { FeatureFlagClient } from "@feature-flag-tool/js-sdk";

const flags = new FeatureFlagClient({ apiUrl: "https://featureflags.example.com", sdkKey: "sdk_live_..." });
await flags.init();
const showLessonDemo = flags.isEnabled("lesson-demo");
```

## API

```ts
export interface FeatureFlagClientOptions {
  apiUrl: string;
  sdkKey: string;
  fetch?: typeof fetch;
}

export class FeatureFlagClient {
  constructor(options: FeatureFlagClientOptions);
  init(): Promise<void>;
  isEnabled(flagKey: string): boolean;
  getAllFlags(): Record<string, boolean>;
}
```

`init()` calls `GET {apiUrl}/api/sdk/flags` with `Authorization: Bearer {sdkKey}` and caches the returned boolean flags in memory. Unknown flags return `false` and warn once per key.

The matching backend endpoint and SDK key management are still in development. This package is built against the documented contract in `docs/api-contract.md`.
