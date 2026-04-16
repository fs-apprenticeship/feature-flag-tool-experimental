import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function findOrCreatePrismaUser() {
  const { userId, isAuthenticated } = await auth();

  if (!isAuthenticated || !userId) {
    return null;
  }

  const existing = await prisma.user.findUnique({
    where: { clerkId: userId },
  });
  console.log("Finding user with clerkId:", userId);

  if(existing) {
    console.log("User already exists in database:", existing);
    return existing;

  }

 
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return null;
  }

  const primaryEmail =
    clerkUser.emailAddresses.find(
      (email) => email.id === clerkUser.primaryEmailAddressId
    )?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress;
  console.log("Primary email found:", primaryEmail);

  if (!primaryEmail) {
    throw new Error("Authenticated Clerk user has no email address.");
  }

  const fullName =
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || null;
  console.log("Full name found:", fullName);

  console.log("Creating new user in database with clerkId:", userId);
  return prisma.user.upsert({
    where: { clerkId: userId },
    update: {
      email: primaryEmail,
      name: fullName,
    },
    create: {
      clerkId: userId,
      email: primaryEmail,
      name: fullName,
    },
  });
}