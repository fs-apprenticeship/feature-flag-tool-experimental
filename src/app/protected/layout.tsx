import { getOrgStatus } from "@/lib/org";
import { redirect } from "next/navigation";

export default async function protectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const  { hasOrg} = await getOrgStatus();
    if (!hasOrg) {
        redirect("/org/new");
    }
  return <>{children}</>;
}