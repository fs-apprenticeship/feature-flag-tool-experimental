export const flagKeys = {
    all: ["flags"] as const,
    list: () => [...flagKeys.all, "list"] as const
}