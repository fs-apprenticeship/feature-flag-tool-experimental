
import { CreateOrganization} from "../models/Organization";

export async function createOrg(
 data: CreateOrganization
) {
    try {
        const response = await fetch(`/api/org`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(errorBody.error || "Failed to create organization");
        }

        return await response.json();
        
    } catch (error) {
        console.error("Unable to create organization:", error);
        throw error;
        
    }
}