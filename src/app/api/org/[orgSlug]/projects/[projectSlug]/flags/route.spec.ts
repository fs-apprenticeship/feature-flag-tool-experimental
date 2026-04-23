import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "../flags/route";
import { prisma } from "@/lib/prisma"; 
import { NextRequest } from "next/server";
import { FeatureFlag } from "@/features/flags";
import { Mock } from 'vitest';

vi.mock("@/lib/prisma", () => ({
  prisma: {
    project: {
      findFirst: vi.fn(), 
      findUnique: vi.fn(),
    },
    featureFlag: {
      findMany: vi.fn(),
      create: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn()
    },
  },
}));

describe("API Route handler: GET /org/orgSlug/projects/projectSlug/flags", () => { 
    beforeEach(() => {
        vi.clearAllMocks();
    })

    it("should return flags with 200 status on success", async () => {
        const orgSlug = "test-org";
        const projectSlug = "test-project";

        const mockFlags: FeatureFlag[] = [
            { id: "1", name: "Test Flag", key: "test-flag", 
                environments: [
                {
                    "id": "1",
                    "name": "Development",
                    "type": "development",
                    "enabled": true
                },
                {
                    "id": "2",
                    "name": "Staging",
                    "type": "staging",
                    "enabled": true
                }
            ] }
        ];
        (prisma.project.findFirst as Mock).mockResolvedValue({ id: "proj_123" });
        (prisma.featureFlag.findMany as Mock).mockResolvedValue(mockFlags);
        const req = new NextRequest(`http://localhost:3000/api/org/${orgSlug}/projects/${projectSlug}/flags`);
    
        const response = await GET(req, { 
            params: Promise.resolve({ orgSlug, projectSlug }) 
        });

        const data = await response.json();
        expect(response.status).toBe(200);
        expect(data).toEqual(mockFlags);
        
    })
    it("should return flags with 404 status on project not found", async () => {
        const orgSlug = "test-org";
        const projectSlug = "test-project";
        (prisma.project.findFirst as Mock).mockResolvedValue(null);
        const req = new NextRequest(`http://localhost:3000/api/org/${orgSlug}/projects/${projectSlug}/flags`);

        const response = await GET(req, { 
            params: Promise.resolve({ orgSlug, projectSlug }) 
        });

        const data = await response.json();
        expect(response.status).toBe(404);
        expect(data.error).toBe("Project not found");
        
    })

    it("should return a 500 error if the database query fails", async () => {
    (prisma.project.findFirst as Mock).mockRejectedValue(new Error("Database connection lost"));
    const orgSlug = "test-org";
    const projectSlug = "test-project";
    const req = new NextRequest(`http://localhost:3000/api/org/${orgSlug}/projects/${projectSlug}/flags`);
    
    const response = await GET(req, { 
        params: Promise.resolve({ orgSlug: "Mock", projectSlug: "Mock" }) 
    });

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toBe("Failed to fetch feature flags. Please try again later.");
});
})

