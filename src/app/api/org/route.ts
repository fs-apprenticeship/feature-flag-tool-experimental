import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import z from "zod";

const OrgInsertSchema = z
  .object({
    name: z.string().min(2),
    key: z.string().optional(),
  })
  .strict();

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const prismaUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });

    if (!prismaUser) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 },
      );
    }

    const body = await req.json();

    const parsed = OrgInsertSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const baseSlug = slugify(parsed.data.name);

    const existingOrgs = await prisma.organization.count({
      where: {
        slug: {
          startsWith: baseSlug,
        },
      },
    });

    const slug = existingOrgs > 0 ? `${baseSlug}-${existingOrgs + 1}` : baseSlug;

    const result = await prisma.organization.create({
      data: {
        name: parsed.data.name,
        slug,
        key: parsed.data.key ?? slug,
        members: {
          create: {
            userId: prismaUser.id,
            role: "owner",
          },
        },
      },
      include: {
        members: true,
      },
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Prisma Error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}