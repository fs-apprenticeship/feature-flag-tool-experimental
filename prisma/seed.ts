/*
    There are a few assumptions made in this seed script:
    1. You have properly generated the Prisma client using `npx prisma generate` after setting up your schema.
    2. Your database is running and the connection URL is correctly set in your .env file.
    3. The Prisma client is correctly configured to connect to your database.
    To run this seed script, you can use the following command:
    
    npm run seed

    OR 

    npx prisma db seed (if npm doesn't work)


******CLIENT GENERATION ISSUE WORKAROUND******
    If you encounter an error related to module not found, then run npx prisma generate to regenerate the Prisma client, which should resolve the issue.
    If it persists, change the provider in schema.prisma to "prisma-client-js" and run npx prisma generate again, which will generate a JavaScript client instead of TypeScript, allowing the seed script to run without issues.

    

*/

import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // 1) Sample organization
  const organization = await prisma.organization.upsert({
    where: { slug: "example-organization" },
    update: {
      key: "example-organization",
      name: "Example Organization",
    },
    create: {
      key: "example-organization",
      name: "Example Organization",
      slug: "example-organization",
    },
  });

  // 2) Sample user
  const user = await prisma.user.upsert({
    where: { email: "johndoe@example.com" },
    update: {
      name: "John Doe",
    },
    create: {
      email: "johndoe@example.com",
      name: "John Doe",
    },
  });

  // 3) Membership connecting user and organization
  await prisma.organizationMember.upsert({
    where: {
      userId_organizationId: {
        userId: user.id,
        organizationId: organization.id,
      },
    },
    update: {
      role: "owner",
    },
    create: {
      userId: user.id,
      organizationId: organization.id,
      role: "owner",
    },
  });

  // 4) Sample project belonging to the organization
  const project = await prisma.project.upsert({
    where: {
      organizationId_key: {
        organizationId: organization.id,
        key: "sample-project",
      },
    },
    update: {
      name: "Sample Project",
      slug: "sample-project",
    },
    create: {
      organizationId: organization.id,
      key: "sample-project",
      name: "Sample Project",
      slug: "sample-project",
    },
  });

  // 5) At least 2 environments for the project
  const developmentEnv = await prisma.environment.upsert({
    where: {
      projectId_key: {
        projectId: project.id,
        key: "development",
      },
    },
    update: {
      name: "Development",
      description: "Development environment",
      type: "development",
    },
    create: {
      projectId: project.id,
      key: "development",
      name: "Development",
      description: "Development environment",
      type: "development",
    },
  });

  const productionEnv = await prisma.environment.upsert({
    where: {
      projectId_key: {
        projectId: project.id,
        key: "production",
      },
    },
    update: {
      name: "Production",
      description: "Production environment",
      type: "production",
    },
    create: {
      projectId: project.id,
      key: "production",
      name: "Production",
      description: "Production environment",
      type: "production",
    },
  });

  // 6) At least 2 feature flags for the project
  const betaDashboardFlag = await prisma.featureFlag.upsert({
    where: {
      projectId_key: {
        projectId: project.id,
        key: "beta-dashboard",
      },
    },
    update: {
      name: "Beta Dashboard",
      description: "Controls access to the beta dashboard experience",
      slug: "beta-dashboard",
    },
    create: {
      projectId: project.id,
      key: "beta-dashboard",
      name: "Beta Dashboard",
      description: "Controls access to the beta dashboard experience",
      slug: "beta-dashboard",
    },
  });

  const newCheckoutFlag = await prisma.featureFlag.upsert({
    where: {
      projectId_key: {
        projectId: project.id,
        key: "new-checkout",
      },
    },
    update: {
      name: "New Checkout",
      description: "Controls rollout of the new checkout flow",
      slug: "new-checkout",
    },
    create: {
      projectId: project.id,
      key: "new-checkout",
      name: "New Checkout",
      description: "Controls rollout of the new checkout flow",
      slug: "new-checkout",
    },
  });

  // 7) Feature flag environment records
  // Beta Dashboard
  await prisma.featureFlagEnvironment.upsert({
    where: {
      featureFlagId_environmentId: {
        featureFlagId: betaDashboardFlag.id,
        environmentId: developmentEnv.id,
      },
    },
    update: {
      enabled: true,
    },
    create: {
      featureFlagId: betaDashboardFlag.id,
      environmentId: developmentEnv.id,
      enabled: true,
    },
  });

  await prisma.featureFlagEnvironment.upsert({
    where: {
      featureFlagId_environmentId: {
        featureFlagId: betaDashboardFlag.id,
        environmentId: productionEnv.id,
      },
    },
    update: {
      enabled: false,
    },
    create: {
      featureFlagId: betaDashboardFlag.id,
      environmentId: productionEnv.id,
      enabled: false,
    },
  });

  // New Checkout
  await prisma.featureFlagEnvironment.upsert({
    where: {
      featureFlagId_environmentId: {
        featureFlagId: newCheckoutFlag.id,
        environmentId: developmentEnv.id,
      },
    },
    update: {
      enabled: true,
    },
    create: {
      featureFlagId: newCheckoutFlag.id,
      environmentId: developmentEnv.id,
      enabled: true,
    },
  });

  await prisma.featureFlagEnvironment.upsert({
    where: {
      featureFlagId_environmentId: {
        featureFlagId: newCheckoutFlag.id,
        environmentId: productionEnv.id,
      },
    },
    update: {
      enabled: true,
    },
    create: {
      featureFlagId: newCheckoutFlag.id,
      environmentId: productionEnv.id,
      enabled: true,
    },
  });

  const seededData = await prisma.organization.findUnique({
    where: { id: organization.id },
    include: {
      members: {
        include: {
          user: true,
        },
      },
      projects: {
        include: {
          environments: true,
          flags: {
            include: {
              environments: {
                include: {
                  environment: true,
                },
              },
            },
          },
        },
      },
    },
  });

  console.dir(seededData, { depth: null });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });