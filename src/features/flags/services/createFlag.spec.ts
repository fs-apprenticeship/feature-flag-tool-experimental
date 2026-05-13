import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { createFlag } from "./createFlag";

global.fetch = vi.fn();

describe("createFlag", () => {
    const orgSlug = "test-org";
    const projectSlug = "test-project";
    const flagData = { name: "New Flag", description: "A test flag" };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should return the created flag on success", async () => {
        const mockCreatedFlag = { id: "1", name: "New Flag", key: "new-flag", environments: [] };

        (fetch as unknown as Mock).mockResolvedValue({
            ok: true,
            json: async () => mockCreatedFlag,
        });

        const result = await createFlag(orgSlug, projectSlug, flagData);

        expect(fetch).toHaveBeenCalledWith(
            `/api/org/${orgSlug}/projects/${projectSlug}/flags`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(flagData),
            }
        );
        expect(result).toEqual(mockCreatedFlag);
    });

    it("should throw the server error message on non-ok response", async () => {
        (fetch as unknown as Mock).mockResolvedValue({
            ok: false,
            json: async () => ({ error: "A flag with this name already exists" }),
        });

        await expect(createFlag(orgSlug, projectSlug, flagData))
            .rejects.toThrow("A flag with this name already exists");
    });

    it("should rethrow on network failure", async () => {
        (fetch as unknown as Mock).mockRejectedValue(new Error("Network error"));

        await expect(createFlag(orgSlug, projectSlug, flagData))
            .rejects.toThrow("Network error");
    });
});
