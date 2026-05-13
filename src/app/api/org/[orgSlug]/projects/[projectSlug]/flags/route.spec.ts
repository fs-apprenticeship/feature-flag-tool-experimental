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
    environment: {
      findMany: vi.fn(),
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

    })

    describe("POST /org/[orgSlug]/projects/[projectSlug]/flags", () => {
        const performPost = (body: unknown) => {
            const orgSlug = "test-org";
            const projectSlug = "test-project";
            const req = new NextRequest(
                `http://localhost:3000/api/org/${orgSlug}/projects/${projectSlug}/flags`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                }
            );
            return POST(req, {
                params: Promise.resolve({ orgSlug, projectSlug }),
            });
        };

        const mockProject = { id: "proj_123" };
        const mockEnvs = [
            { id: "env_1", name: "Development", key: "development", type: "development", projectId: "proj_123" },
            { id: "env_2", name: "Production", key: "production", type: "production", projectId: "proj_123" },
        ];
        const validBody = { name: "New Flag", description: "A test flag", environments: {} };
        const mockCreatedFlag = {
            id: "flag_123",
            name: "New Flag",
            key: "new-flag",
            slug: "new-flag",
            projectId: "proj_123",
            description: "A test flag",
            environments: [],
        };

        it("should create a flag and return 201 on success", async () => {
            (prisma.project.findFirst as Mock).mockResolvedValue(mockProject);
            (prisma.featureFlag.findFirst as Mock).mockResolvedValue(null);
            (prisma.environment.findMany as Mock).mockResolvedValue(mockEnvs);
            (prisma.featureFlag.create as Mock).mockResolvedValue(mockCreatedFlag);

            const response = await performPost(validBody);
            const data = await response.json();

            expect(response.status).toBe(201);
            expect(data).toEqual(mockCreatedFlag);
        });

        it("should return 400 when name is too short", async () => {
            const response = await performPost({ name: "x", environments: {} });

            expect(response.status).toBe(400);
        });

        it("should return 400 when unknown fields are provided", async () => {
            const response = await performPost({ name: "Valid Name", environments: {}, unknownField: true });

            expect(response.status).toBe(400);
        });

        it("should return 400 when a flag with the same name already exists", async () => {
            (prisma.project.findFirst as Mock).mockResolvedValue(mockProject);
            (prisma.featureFlag.findFirst as Mock).mockResolvedValue({ id: "existing_flag" });

            const response = await performPost(validBody);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.error).toBe("A flag with this name already exists");
        });

        it("should return 404 when the project is not found", async () => {
            (prisma.project.findFirst as Mock).mockResolvedValue(null);

            const response = await performPost(validBody);
            const data = await response.json();

            expect(response.status).toBe(404);
            expect(data.error).toBe("Project or Org not found");
        });

        it("should return 500 when the database throws", async () => {
            (prisma.project.findFirst as Mock).mockResolvedValue(mockProject);
            (prisma.featureFlag.findFirst as Mock).mockResolvedValue(null);
            (prisma.environment.findMany as Mock).mockResolvedValue(mockEnvs);
            (prisma.featureFlag.create as Mock).mockRejectedValue(new Error("Connection lost"));

            const response = await performPost(validBody);
            const data = await response.json();

            expect(response.status).toBe(500);
            expect(data.error).toBe("Internal Server Error");
        });
    })
})
