import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import z from "zod";

const UpdateEnvironmentSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  type: z.enum(["development", "staging", "production"]).optional(),
})

export async function PATCH(
  req: NextRequest, 
  {
    params, 
  }: {
    params: 
    Promise<{
      orgSlug: string;
      projectSlug: string;
      envId: string; 
    }>;
  }
) {
  try {
    const { orgSlug, projectSlug, envId } = await params;
    const body = await req.json();

    const parsed = UpdateEnvironmentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({error: parsed.error}, {status: 400})
    }

     const project = await prisma.project.findFirst({
            where: {
                slug: projectSlug,
                organization: { slug: orgSlug }
            },
            select: { id: true } 
            });
   
      if (!project) {
          return NextResponse.json({error: "Project or Org not found"}, {status:404})
      }

      const environment = await prisma.environment.findFirst({
        where: {
          name: parsed.data.name.trim(),
          projectId: project.id,
          NOT: {
            id: envId 
          }
        }
      })

      if (environment) {
        return NextResponse.json({error: "A environment with this name already exists"}, {status: 400})
        }

      const updatedEnvironment = await prisma.environment.update({
          where: {
            id: envId
          },
          data: {
            name: parsed.data.name.trim(),
            description: parsed.data.description,
            key:  parsed.data.name.toLowerCase().trim().replace(/ /g, '-'),
            type: parsed.data.type

          }
        })

      return NextResponse.json(updatedEnvironment);
  } catch (error) {
    console.error("Patch flag error", error);
    return NextResponse.json(
      { error: "Internal Server Error"}, 
      { status: 500 }
    );
  }
}

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
        { error: "Environment not found" },
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


