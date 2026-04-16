import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { findOrCreatePrismaUser } from "@/lib/user";
import { RedirectToSignIn } from "@clerk/nextjs";

export default async function AuthSyncPage() {
  const { userId } = await auth();

  if (!userId) {
    return <RedirectToSignIn />;
  }

  await findOrCreatePrismaUser();

  redirect("/");
}