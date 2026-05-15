import EditFlagForm from "@/features/flags/components/EditFlagForm";
import { prisma } from "@/lib/prisma";

export default async function EditFlagPage({
  params,
}: {
  params: Promise<{
    projectSlug: string;
    orgSlug: string;
    flagId: string;
  }>;
}) {
  const { projectSlug, orgSlug, flagId } = await params;

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
    include: {
      environments: {
        include: {
          environment: true,
        },
      },
    },
  });

  if (!flag) {
    return <div>Flag not found</div>;
  }

  const formattedFlag = {
    id: flag.id,
    name: flag.name,
    key: flag.key,
    description: flag.description ?? "",
    environments: flag.environments.map((e) => ({
      id: e.environment.id,
      name: e.environment.name,
      type: e.environment.type,
      enabled: e.enabled,
    })),
  };

  return (
    <EditFlagForm
      projectSlug={projectSlug}
      orgSlug={orgSlug}
      flag={formattedFlag}
    />
  );
}