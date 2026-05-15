import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { authenticateSDKRequest, SDKAuthError } from "@/lib/sdkAuth";

const noStoreHeaders = {
  "Cache-Control": "no-store",
};

export async function GET(request: Request) {
  try {
    const { projectId, environmentId } = await authenticateSDKRequest(request);

    const flagStates = await prisma.featureFlagEnvironment.findMany({
      where: {
        environmentId,
        featureFlag: {
          projectId,
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

    const flags = Object.fromEntries(
      flagStates.map((flagState) => [
        flagState.featureFlag.key,
        flagState.enabled,
      ]),
    );

    return NextResponse.json({ flags }, { headers: noStoreHeaders });
  } catch (error) {
    if (error instanceof SDKAuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status, headers: noStoreHeaders },
      );
    }

    console.error("SDK flags error:", error);
    return NextResponse.json(
      { error: "Failed to fetch feature flags." },
      { status: 500, headers: noStoreHeaders },
    );
  }
}
