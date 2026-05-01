export interface EnvironmentRow {
    id: string;
    name: string; 
    projectId: string;
    key: string; 
    description: string
    type: string;
}

export type CreateEnvironmentInput = {
    name: string;
    description?: string;
    type?: string;
};

export interface CreateEnvironmentOptions {
    orgSlug: string;
    projectSlug: string;
    data: CreateEnvironmentInput;
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
    }
}