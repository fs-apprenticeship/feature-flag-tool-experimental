export async function deleteEnvironment(
    orgSlug: string, 
    projectSlug: string, 
    envId: string,
) {
    try {
        const response = await fetch(`/api/org/${orgSlug}/projects/${projectSlug}/environments/${envId}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(errorBody.error || "Failed to delete environment");
        }

        return await response.json();
        
    } catch (error) {
        console.error("Unable to delete environment:", error);
        throw error;
        
    }
}