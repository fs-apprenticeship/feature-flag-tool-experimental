export interface EnvironmentRow {
    id: string;
    name: string; 
    projectId: string;
    key: string; 
    description: string
    type: string;
}

export type EnvironmentInput = {
    name: string;
    description?: string;
    type?: "development" | "staging" | "production";
};

export interface EditEnvironmentOptions {
    envId: string;
    data: EnvironmentInput;
    projectSlug: string; 
    orgSlug: string;
}

export interface CreateEnvironmentOptions {
    data: EnvironmentInput;
    projectSlug: string; 
    orgSlug: string;
}

export class Environment {
    id: string;
    name: string; 
    projectId: string;
    key: string;
    description?: string;
    type?: string; 
    constructor(row: Environment) {
        this.id = row.id
        this.projectId = row.projectId
        this.name = row.name
        this.key = row.key;
        this.description = row.description;
        this.type = row.type; 
    }
}

export interface DeleteEnvOptions {
  orgSlug: string;
  projectSlug: string;
  envId: string;
}