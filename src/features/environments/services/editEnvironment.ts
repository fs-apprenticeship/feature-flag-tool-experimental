import { EnvironmentInput } from "../models/Environment";

export async function editEnvironment(orgSlug: string, projectSlug: string, envId: string, data: EnvironmentInput ) {

    try { 
    const response = await fetch(`/api/org/${orgSlug}/projects/${projectSlug}/environments/${envId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
    })

   if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(errorBody.error || "Failed to update environment");
        }

        return await response.json();
        
    } catch (error) {
        console.error("Unable to update environment:", error);
        throw error;
        
    }
}