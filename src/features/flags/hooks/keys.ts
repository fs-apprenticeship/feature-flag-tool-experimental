export const flagKeys = {
    all: ["flags"] as const,
    list: () => [...flagKeys.all, "list"] as const,
    create: () => [...flagKeys.all, "create"] as const,
    edit: () => [...flagKeys.all, "edit"] as const,
    delete: () => [...flagKeys.all, "delete"] as const,
}