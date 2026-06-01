-- CreateTable
CREATE TABLE "SDKKey" (
    "id" TEXT NOT NULL,
    "projectId" UUID NOT NULL,
    "environmentId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "keyHash" TEXT NOT NULL,
    "keyPrefix" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUsedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "SDKKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SDKKey_projectId_idx" ON "SDKKey"("projectId");

-- CreateIndex
CREATE INDEX "SDKKey_keyHash_idx" ON "SDKKey"("keyHash");

-- CreateIndex
CREATE UNIQUE INDEX "SDKKey_keyHash_key" ON "SDKKey"("keyHash");

-- AddForeignKey
ALTER TABLE "SDKKey" ADD CONSTRAINT "SDKKey_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SDKKey" ADD CONSTRAINT "SDKKey_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES "Environment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
