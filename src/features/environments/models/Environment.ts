export interface EnvironmentRow {
    id: string;
    name: string; 
    projectId: string;
    key: string; 
    description: string
    type: string;
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