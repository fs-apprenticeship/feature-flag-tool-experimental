import { FeatureFlag, FlagRow } from "../models/FeatureFlag"


export async function getFlagList(projectSlug: string, orgSlug: string, ) {
    const response = await fetch(`/api/org/${orgSlug}/projects/${projectSlug}/flags`)

    if (!response.ok) 
        if (response.status === 404) {
            throw new Error("PROJECT_NOT_FOUND");
        }
        if (response.status === 500) {
            throw new Error("SERVER_ERROR");
        }
        const rows: FlagRow[] = await response.json()
        return rows.map((row) => new FeatureFlag(row))
}