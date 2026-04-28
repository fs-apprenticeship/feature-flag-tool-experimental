import DeleteFlagForm from "@/features/flags/components/DeleteFlagForm";
import { prisma } from "@/lib/prisma";

export default async function DeleteFlagPage({
  params,
}: {
  params: Promise<{
    orgSlug: string;
    projectSlug: string;
    flagId: string;
  }>;
}) {
  const { orgSlug, projectSlug, flagId } = await params;

  const flag = await prisma.featureFlag.findFirst({
    where: {
      id: flagId,
      project: {
        slug: projectSlug,
        organization: {
          slug: orgSlug,
        },
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

  if (!flag) {
    return <div>Flag not found</div>;
  }

  return (
    <DeleteFlagForm
      orgSlug={orgSlug}
      projectSlug={projectSlug}
      flagId={flag.id}
      flagName={flag.name}
    />
  );
}