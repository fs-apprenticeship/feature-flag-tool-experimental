import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 
import z from "zod";

const EnvironmentInsertSchema = z.object({
    name: z.string().min(2), 
    description: z.string().optional(),
})


export async function GET(req: Request, { params }: { params: Promise<{ orgSlug: string; projectSlug: string }> }) {

    const { orgSlug, projectSlug } = await params;
    try { 
        const project = await prisma.project.findFirst({
        where: { 
            slug: projectSlug,
            organization: { slug: orgSlug }
        }
        });

        if (!project) {
        return Response.json({ error: "Project not found" }, { status: 404 });
        }
        const environments = await prisma.environment.findMany({
        where: {
            project: {
            slug: projectSlug,
            organization: { slug: orgSlug }
            }
        },
    })
    return NextResponse.json(environments);
} catch (error) {
    console.error("Prisma Error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function POST(req: NextRequest,
    { params }: { params: Promise<{ orgSlug: string; projectSlug: string }> }
) {
    try { 
        const { orgSlug, projectSlug } = await params;
        const body = await req.json();
        if (!body) {
            return NextResponse.json(null, {status: 400, statusText: "Empty body"})
        }
        const parsed = EnvironmentInsertSchema.safeParse(body);
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

        //Check for duplicate envs
        const environment = await prisma.environment.findFirst({
            where : {
                name: parsed.data.name,
                projectId: project.id
            }
        })
    

        if (environment) {
            return NextResponse.json({error: "A environment with this name already exists"}, {status: 400})
        }

        const result = await prisma.$transaction(async (tx) => {
      
        const newEnv = await tx.environment.create({
            data: {
            name: parsed.data.name.trim(),
            description: parsed.data.description,
            projectId: project.id,
            key: parsed.data.name.toLowerCase().trim().replace(/ /g, '-'),
            }
        });

        const existingFlags = await tx.featureFlag.findMany({
            where: { projectId: project.id },
            select: { id: true }
        });

        if (existingFlags.length > 0) {
            await tx.featureFlagEnvironment.createMany({
            data: existingFlags.map((flag) => ({
                featureFlagId: flag.id,
                environmentId: newEnv.id,
                enabled: false, 
            })),
            });
        }

        return newEnv;
        });

        return NextResponse.json(result, { status: 201 });

     } catch (error) {
    console.error("Prisma Error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

