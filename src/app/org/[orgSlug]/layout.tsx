import { getOrgmembership } from "@/lib/org";

export default async function OrgLayout({
  children,
  params,
}: {
  children: React.ReactNode;
    params: Promise<{ orgSlug: string }>;
}) {
  const { orgSlug } = await params;
  await getOrgmembership(orgSlug);
  return <>{children}</>;
}