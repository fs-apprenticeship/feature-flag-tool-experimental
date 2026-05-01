import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import z from "zod";

export async function DELETE(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      orgSlug: string;
      projectSlug: string;
      envId: string;
    }>;
  }
) {
  try {
    const { orgSlug, projectSlug, envId } = await params;

    const existingEnvironment = await prisma.environment.findFirst({
      where: {
        id: envId,
        project: {
          slug: projectSlug,
          organization: {
            slug: orgSlug,
          },
        },
      },
      select: {
        id: true,
      },
    });

    if (!existingEnvironment) {
      return NextResponse.json(
        { error: "Environment flag not found" },
        { status: 404 }
      );
    }

    await prisma.environment.delete({
      where: {
        id: envId,
      },
    });

    return NextResponse.json({
      success: true,
      deletedId: envId,
    });
  } catch (error) {
    console.error("Delete env error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}