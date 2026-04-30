import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 
import z from "zod";


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
