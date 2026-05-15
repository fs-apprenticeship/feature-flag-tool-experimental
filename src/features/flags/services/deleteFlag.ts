
export async function deleteFlag(
    orgSlug: string, 
    projectSlug: string, 
    flagId: string,
) {
    try {
        const response = await fetch(`/api/org/${orgSlug}/projects/${projectSlug}/flags/${flagId}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(errorBody.error || "Failed to delete flag");
        }

        return await response.json();
        
    } catch (error) {
        console.error("Unable to delete flag:", error);
        throw error;
        
    }
}