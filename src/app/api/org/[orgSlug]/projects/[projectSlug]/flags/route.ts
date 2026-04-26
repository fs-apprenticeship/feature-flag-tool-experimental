import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 
import z from "zod";


const FeatureFlagInsertSchema = z.object({
    name: z.string()
           .min(2),
    description: z.string().optional(),
    developmentEnabled: z.boolean(),
    stagingExists: z.boolean(),
    stagingEnabled: z.boolean(),
    productionExists: z.boolean(),
    productionEnabled: z.boolean(),
}).strict()


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
        
        const flags = await prisma.featureFlag.findMany({
        where: {
            project: {
            slug: projectSlug,
            organization: { slug: orgSlug }
            }
        },
        include: {
            environments: {
                include: {
                    environment: true
                }
            }
        }
    });
  return NextResponse.json(flags);
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
        const parsed = FeatureFlagInsertSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({error: parsed.error}, {status: 400})
        }
        // Ensure project and organization exists
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

        // Check for duplicate names
        const flag = await prisma.featureFlag.findFirst({
            where : {
                name: parsed.data.name,
                projectId: project.id
            }
        })

        if (flag) {
            return NextResponse.json({error: "A flag with this name already exists"}, {status: 400})
        }

        const envs = await prisma.environment.findMany({
            where: {
                projectId: project.id
            }
        });

        let dev = envs.find(e => e.key === 'development')
        let staging = envs.find(e => e.key === 'staging')
        let prod = envs.find(e => e.key === 'production')

        if (!dev) {
            dev = await prisma.environment.create({
                data: { 
                    name: "Development", 
                    key: "development", 
                    projectId: project.id,
                    type: "development"}
            });
        }

        if (!staging && body.stagingExists) {
            staging = await prisma.environment.create({
                data: { 
                    name: "Staging", 
                    key: "staging", 
                    projectId: project.id, 
                    type: "staging"
                }
            });
        }
        if (!prod && body.prodExists) {
            prod = await prisma.environment.create({
                data: { 
                    name: "Production", 
                    key: "production", 
                    projectId: project.id,
                    type: "production" }
            });
        }

        const result = await prisma.featureFlag.create({
            data: {
                name: parsed.data.name,
                description: parsed.data.description,
                projectId: project.id,
                slug: parsed.data.name.toLowerCase().replace(/ /g, '-'),
                key:  parsed.data.name.toLowerCase().replace(/ /g, '-'),
                environments: {
            create: [
                {
                    enabled: parsed.data.developmentEnabled,
                    environmentId: dev.id
                },
                ...((staging && parsed.data.stagingExists) ? [{ enabled: parsed.data.stagingEnabled, environmentId: staging.id }] : []),
                ...((prod && parsed.data.productionExists) ? [{ enabled: parsed.data.productionEnabled, environmentId: prod.id }] : []),
            ] 
        }
    }, include: { environments: true}
    })
    return NextResponse.json(result, { status: 201 });

   } catch (error) {
    console.error("Prisma Error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
};