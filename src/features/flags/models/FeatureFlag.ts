export interface FlagEnvironment {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
}

export interface FlagRow {
    id: string;
    projectId: string;
    name: string;
    key: string;
    description: string; 
    slug: string;
    environments: Array<{
    enabled: boolean;
    environment: {
    id: string;
    name: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    }}>
}

export type CreateFeatureFlag = Omit<FeatureFlag, 'id' | 'environments'| 'key'>;

export interface CreateFlagOptions {
  orgSlug: string;
  projectSlug: string;
  data: CreateFeatureFlag;
}

export class FeatureFlag {
    id: string;
    name: string;
    key: string
    description?: string;
    environments: FlagEnvironment[];
    constructor(row: FlagRow) {
        this.id = row.id;
        this.name = row.name;
        this.key = row.key;
        this.description = row.description;
        this.environments = row.environments.map((item) => ({
            id: item.environment.id,
            name: item.environment.name,
            type: item.environment.type,
            enabled: item.enabled,
    }));
  }
}

export interface UpdateFeatureFlag {
  name: string;
  description?: string;
  environments: {
    environmentId: string;
    enabled: boolean;
  }[];
}



export interface EditFlagOptions {
  orgSlug: string;
  projectSlug: string;
  flagId: string;
  data: UpdateFeatureFlag;
}

export interface DeleteFlagOptions {
  orgSlug: string;
  projectSlug: string;
  flagId: string;
}