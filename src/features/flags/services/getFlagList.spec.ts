import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { getFlagList } from "../services/getFlagList";
import { FeatureFlag } from "../models/FeatureFlag";

global.fetch = vi.fn();

describe("getFlagList", () => {
    const orgSlug = "test-org";
    const projectSlug = "test-project";

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should fetch all flags", async () => {
        const mockRawData = [
            { id: "1", name: "lesson-demo", key: "lesson-demo", environments: [] },
            { id: "2", name: "course-demo", key: "course-demo", environments: [] }
        ];

        (fetch as unknown as Mock).mockResolvedValue({
            ok: true,
            json: async () => mockRawData,
        });

        const result = await getFlagList(projectSlug, orgSlug);

        expect(fetch).toHaveBeenCalledWith(
            `/api/org/${orgSlug}/projects/${projectSlug}/flags`
        );

        expect(result).toHaveLength(2);
        expect(result[0]).toBeInstanceOf(FeatureFlag);
        expect(result[0].name).toBe("lesson-demo");
    });

    it("should throw an error", async () => {
        (fetch as unknown as Mock).mockResolvedValue({
            ok: false,
            status: 404,
        });

        await expect(getFlagList(projectSlug, orgSlug))
            .rejects.toThrow("PROJECT_NOT_FOUND");
    });

    it("should throw SERVER_ERROR on 500", async () => {
        (fetch as unknown as Mock).mockResolvedValue({
            ok: false,
            status: 500,
        });

        await expect(getFlagList(projectSlug, orgSlug))
            .rejects.toThrow("SERVER_ERROR");
    });
});