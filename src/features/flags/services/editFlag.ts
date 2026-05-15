import { UpdateFeatureFlag } from "../models/FeatureFlag"

export async function editFlag(
    orgSlug: string, 
    projectSlug: string, 
    flagId: string,
    data: UpdateFeatureFlag
) {
    try {
        const response = await fetch(`/api/org/${orgSlug}/projects/${projectSlug}/flags/${flagId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(errorBody.error || "Failed to update flag");
        }

        return await response.json();
        
    } catch (error) {
        console.error("Unable to update flag:", error);
        throw error;
        
    }
}