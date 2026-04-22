import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 

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