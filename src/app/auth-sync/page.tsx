import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { findOrCreatePrismaUser, } from "@/lib/user";
import { getOrgStatus } from "@/lib/org";
import { RedirectToSignIn } from "@clerk/nextjs";

export default async function AuthSyncPage() {
  const { userId } = await auth();

  if (!userId) {
    return <RedirectToSignIn />;
  }

  await findOrCreatePrismaUser();

  const { hasOrg, orgSlug } = await getOrgStatus();
  
    if (!hasOrg) {
      redirect("/org/new");
    }
  
    redirect(`/org/${orgSlug}`);
}