import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "../flags/route";
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

describe("API Routes", () => { 

    beforeEach(() => {
        vi.clearAllMocks();
    })
    describe("GET /org/[orgSlug]/projects/[projectSlug]/flags", () => { 
        const performGet = () => {
        const orgSlug = "test-org";
        const projectSlug = "test-project";
        const req = new NextRequest(`http://localhost:3000/api/org/${orgSlug}/projects/${projectSlug}/flags`);

        return GET(req, { 
        params: Promise.resolve({ orgSlug, projectSlug }) 
            });
        };

        it("should return flags with 200 status on success", async () => {
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

            const response = await performGet();
            const data = await response.json();
            expect(response.status).toBe(200);
            expect(data).toEqual(mockFlags);    
        })
    

        it("should return an empty array if no flags exist", async () => {
            (prisma.project.findFirst as Mock).mockResolvedValue({ id: "proj_123" });
            (prisma.featureFlag.findMany as Mock).mockResolvedValue([]); 
            const response = await performGet();
            const data = await response.json();
            expect(data).toEqual([]);
        });

        it("should return flags with 404 status on project not found", async () => {
            (prisma.project.findFirst as Mock).mockResolvedValue(null);
            const response = await performGet();
            const data = await response.json();
            expect(response.status).toBe(404);
            expect(data.error).toBe("Project not found");  
        })
        
        it("should return a 500 error if the database query fails", async () => {
        (prisma.project.findFirst as Mock).mockRejectedValue(new Error("Database connection lost"));
        const response = await performGet();
        const data = await response.json();
        expect(response.status).toBe(500);
        expect(data.error).toBe("Failed to fetch feature flags. Please try again later.");
        });

    describe("POST /org/[orgSlug]/projects/[projectSlug]/flags", () => {
        const performPost = (body: FeatureFlag) => {
            const orgSlug = "test-org";
            const projectSlug = "test-project";
            const req = new NextRequest(`http://localhost:3000/api/org/${orgSlug}/projects/${projectSlug}/flags`, {
                method: "POST",
                body: JSON.stringify(body)
            })

            return POST(req, { 
            params: Promise.resolve({ orgSlug, projectSlug }) 
                });
        };
    

        it("should create a new flag with 201 success", async () => {
            const flagData = {id: "1", key: "lesson-plan-demo", name: "lesson-plan-demo", description: "lesson demo card", environments: []};
            (prisma.project.findUnique as Mock).mockResolvedValue({ id: "proj_123" });
            (prisma.featureFlag.findFirst as Mock).mockResolvedValue(null);
            (prisma.featureFlag.create as Mock).mockResolvedValue(flagData);
            const response = await performPost(flagData);
            const data = await response.json();
            expect(response.status).toBe(201);
            expect(data).toEqual(flagData);  
            })
        })
    })
})