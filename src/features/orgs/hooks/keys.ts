
export const orgKeys = {
    all: ["orgs"] as const,
    create: () => [...orgKeys.all, "create"] as const,   
}