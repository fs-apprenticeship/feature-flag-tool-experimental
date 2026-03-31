-- CreateTable
CREATE TABLE "FeatureFlagEnvironment" (
    "id" UUID NOT NULL,
    "featureFlagId" UUID NOT NULL,
    "environmentId" UUID NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeatureFlagEnvironment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FeatureFlagEnvironment_environmentId_idx" ON "FeatureFlagEnvironment"("environmentId");

-- CreateIndex
CREATE INDEX "FeatureFlagEnvironment_featureFlagId_idx" ON "FeatureFlagEnvironment"("featureFlagId");

-- CreateIndex
CREATE UNIQUE INDEX "FeatureFlagEnvironment_featureFlagId_environmentId_key" ON "FeatureFlagEnvironment"("featureFlagId", "environmentId");

-- AddForeignKey
ALTER TABLE "FeatureFlagEnvironment" ADD CONSTRAINT "FeatureFlagEnvironment_featureFlagId_fkey" FOREIGN KEY ("featureFlagId") REFERENCES "FeatureFlag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeatureFlagEnvironment" ADD CONSTRAINT "FeatureFlagEnvironment_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES "Environment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
