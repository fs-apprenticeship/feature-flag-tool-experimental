import { auth } from "@clerk/nextjs/server";
import { RedirectToSignIn } from "@clerk/nextjs";


export default async function OrgLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    return <RedirectToSignIn />;
  }

  return <>{children}</>;
}