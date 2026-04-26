import { CreateFeatureFlag } from "../models/FeatureFlag"

export async function createFlag(
    orgSlug: string, 
    projectSlug: string, 
    data: CreateFeatureFlag
) {
    try {
        const response = await fetch(`/api/org/${orgSlug}/projects/${projectSlug}/flags`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(errorBody.error || "Failed to create flag");
        }

        return await response.json();
        
    } catch (error) {
        console.error("Unable to create flag:", error);
        throw error;
        
    }
}