import { redirect } from "next/navigation";
import { auth} from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";


export async function getOrgStatus() {
  const { userId } = await auth();

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      memberships: {
        include: {
          organization: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  const org = user.memberships[0]?.organization;

  return {
    user,
    hasOrg: Boolean(org),
    orgSlug: org?.slug ?? null,
  };
}

export async function getOrgmembership(orgSlug: string) {
    const { userId } = await auth();

  if (!userId) {
    redirect("/auth-sync");
  }

  const membership = await prisma.organizationMember.findFirst({
    where: {
      user: {
        clerkId: userId,
      },
      organization: {
        slug: orgSlug,
      },
    },
  });

  if (!membership) {
    redirect("/org/new");
  }

}