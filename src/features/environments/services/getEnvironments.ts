import { Environment, EnvironmentRow } from "../models/Environment";

export async function getEnvironment(projectSlug: string, orgSlug: string) {
    const response = await fetch(`/api/org/${orgSlug}/projects/${projectSlug}/environments`)

    if (!response.ok) 
            if (response.status === 404) {
                throw new Error("ENV_NOT_FOUND");
            }
            if (response.status === 500) {
                throw new Error("SERVER_ERROR");
            }
            const rows: EnvironmentRow[] = await response.json()
            return rows.map((row) => new Environment(row))
}