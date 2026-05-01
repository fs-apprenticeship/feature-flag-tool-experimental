import { CreateEnvironment } from "../models/Environment";

export async function createEnvironment(
    orgSlug: string,
    projectSlug: string,
    data: CreateEnvironment
) {
    try {
        const response = await fetch(`/api/org/${orgSlug}/projects/${projectSlug}/environments`, {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify(data), 
        });
    
        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(errorBody.error || "Failed to create env");
        }
         return await response.json();
        
    } catch (error) {
        console.error("Unable to create flag:", error);
        throw error;
    }
}