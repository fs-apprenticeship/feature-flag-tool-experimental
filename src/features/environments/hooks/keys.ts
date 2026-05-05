export const EnvironmentKeys = {
    all: ["environment"] as const,
    list: () => [...EnvironmentKeys.all, "list"] as const,
    create: () => [...EnvironmentKeys.all, "create"] as const,
    edit: () => [...EnvironmentKeys.all, "edit"] as const, 
    delete: () => [...EnvironmentKeys.all, "delete"] as const,
}