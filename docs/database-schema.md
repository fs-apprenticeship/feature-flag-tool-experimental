# Database Schema Proposal

## Goal

Design an initial Prisma data model for a feature flagging platform that can store:

- feature flags
- flag descriptions
- multiple environments
- the enabled/disabled state of flags per environment

---

## Design Overview

This schema is built around four core models:

### 1. **Project**
- Represents a single application or SDK consumer
- Stores a unique project key and name
- Allows multiple projects to have their own flags

### 2. **FeatureFlag**
- Represents a logical feature toggle within a project
- Stores the flag key, name, and description
- Scoped to a project to prevent naming collisions across different applications

### 3. **Environment**
- Represents a deployment context such as `development`, `staging`, or `production`
- Scoped to a project so each project can maintain its own environments
- Uses an enum to restrict environment types to known values

### 4. **FeatureFlagEnvironment**
- Join table connecting a feature flag to an environment
- Stores whether a flag is enabled or disabled in that environment

---

## Proposed Prisma Schema

```prisma
enum EnvironmentType {
  development
  staging
  production
}

model Project {
  id           String        @id @default(cuid())
  key          String        @unique
  name         String
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt

  flags        FeatureFlag[]
  environments Environment[]
}

model FeatureFlag {
  id           String                   @id @default(cuid())
  projectId    String
  key          String
  name         String
  description  String?
  createdAt    DateTime                 @default(now())
  updatedAt    DateTime                 @updatedAt

  project      Project                  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  environments FeatureFlagEnvironment[]

  @@unique([projectId, key])
  @@index([projectId])
}

model Environment {
  id           String                   @id @default(cuid())
  projectId    String
  key          String
  type         EnvironmentType
  name         String
  description  String?
  createdAt    DateTime                 @default(now())
  updatedAt    DateTime                 @updatedAt

  project      Project                  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  flags        FeatureFlagEnvironment[]

  @@unique([projectId, key])
  @@unique([projectId, type])
  @@index([projectId])
}

model FeatureFlagEnvironment {
  id            String      @id @default(cuid())
  featureFlagId String
  environmentId String
  enabled       Boolean     @default(false)
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  featureFlag   FeatureFlag @relation(fields: [featureFlagId], references: [id], onDelete: Cascade)
  environment   Environment @relation(fields: [environmentId], references: [id], onDelete: Cascade)

  @@unique([featureFlagId, environmentId])
  @@index([environmentId])
  @@index([featureFlagId])
}