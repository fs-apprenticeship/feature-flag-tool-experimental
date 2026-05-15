import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import z from "zod";

const UpdateFeatureFlagSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  environments: z.array(
    z.object({
      environmentId: z.string(),
      enabled: z.boolean(),
    })
  ),
}).strict();

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}

export async function PATCH(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      orgSlug: string;
      projectSlug: string;
      flagId: string;
    }>;
  }
) {
  try {
    const { orgSlug, projectSlug, flagId } = await params;
    const body = await req.json();

    const parsed = UpdateFeatureFlagSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const project = await prisma.project.findFirst({
      where: {
        slug: projectSlug,
        organization: {
          slug: orgSlug,
        },
      },
      select: {
        id: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project or organization not found" },
        { status: 404 }
      );
    }

    const existingFlag = await prisma.featureFlag.findFirst({
      where: {
        id: flagId,
        projectId: project.id,
      },
    });

    if (!existingFlag) {
      return NextResponse.json(
        { error: "Feature flag not found" },
        { status: 404 }
      );
    }

    const duplicateFlag = await prisma.featureFlag.findFirst({
      where: {
        projectId: project.id,
        name: parsed.data.name,
        NOT: {
          id: flagId,
        },
      },
    });

    if (duplicateFlag) {
      return NextResponse.json(
        { error: "A flag with this name already exists" },
        { status: 400 }
      );
    }

    const updatedFlag = await prisma.$transaction(async (tx) => {
      await tx.featureFlag.update({
        where: {
          id: flagId,
        },
        data: {
          name: parsed.data.name,
          description: parsed.data.description,
          slug: toSlug(parsed.data.name),
          key: toSlug(parsed.data.name),
        },
      });

      for (const env of parsed.data.environments) {
        await tx.featureFlagEnvironment.updateMany({
          where: {
            featureFlagId: flagId,
            environmentId: env.environmentId,
            featureFlag: {
              projectId: project.id,
            },
          },
          data: {
            enabled: env.enabled,
          },
        });
      }

      return tx.featureFlag.findUnique({
        where: {
          id: flagId,
        },
        include: {
          environments: {
            include: {
              environment: true,
            },
          },
        },
      });
    });

    return NextResponse.json(updatedFlag);
  } catch (error) {
    console.error("Patch flag error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      orgSlug: string;
      projectSlug: string;
      flagId: string;
    }>;
  }
) {
  try {
    const { orgSlug, projectSlug, flagId } = await params;

    const existingFlag = await prisma.featureFlag.findFirst({
      where: {
        id: flagId,
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

    if (!existingFlag) {
      return NextResponse.json(
        { error: "Feature flag not found" },
        { status: 404 }
      );
    }

    await prisma.featureFlag.delete({
      where: {
        id: flagId,
      },
    });

    return NextResponse.json({
      success: true,
      deletedId: flagId,
    });
  } catch (error) {
    console.error("Delete flag error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}