# Database Schema Proposal

## Goal

Design an initial Prisma data model for a feature flagging platform that can store:

- feature flags
- flag descriptions
- multiple environments
- the enabled/disabled state of flags per environment

---

## Design Overview

This schema is built around seven core models:
### 1. **User**
- Represents an authenticated user in the system
- Stores identity information needed for login and ownership

### 2. **Organization**
- Represents a company, team, or workspace
- Acts as the top-level container for projects

### 3. **OrganizationMember**
- Represents membership of a user in an organization
- Supports access control and organization-level roles

### 4. **Project**
- Represents a single application or SDK consumer
- Belongs to an organization
- Stores a unique project key and name
- Allows each organization to manage multiple projects

### 5. **FeatureFlag**
- Represents a logical feature toggle within a project
- Stores the flag key, name, and description
- Scoped to a project to prevent naming collisions across different applications

### 6. **Environment**
- Represents a deployment context such as `development`, `staging`, or `production`
- Scoped to a project so each project can maintain its own environments
- Uses an enum to restrict environment types to known values

### 7. **FeatureFlagEnvironment**
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

enum OrganizationRole {
  owner
  admin
  member
}

model User {
  id             String               @id @default(cuid())
  email          String               @unique
  name           String?
  createdAt      DateTime             @default(now())
  updatedAt      DateTime             @updatedAt

  memberships    OrganizationMember[]
}

model Organization {
  id             String               @id @default(cuid())
  key            String               @unique
  name           String
  createdAt      DateTime             @default(now())
  updatedAt      DateTime             @updatedAt

  members        OrganizationMember[]
  projects       Project[]
}

model OrganizationMember {
  id             String               @id @default(cuid())
  userId         String
  organizationId String
  role           OrganizationRole     @default(member)
  createdAt      DateTime             @default(now())
  updatedAt      DateTime             @updatedAt

  user           User                 @relation(fields: [userId], references: [id], onDelete: Cascade)
  organization   Organization         @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  @@unique([userId, organizationId])
  @@index([organizationId])
  @@index([userId])
}

model Project {
  id             String               @id @default(cuid())
  organizationId String
  key            String
  name           String
  createdAt      DateTime             @default(now())
  updatedAt      DateTime             @updatedAt

  organization   Organization         @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  flags          FeatureFlag[]
  environments   Environment[]

  @@unique([organizationId, key])
  @@index([organizationId])
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