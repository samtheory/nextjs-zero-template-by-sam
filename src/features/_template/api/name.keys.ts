// example

// export const courseKeys = {
//   all: ["courses"] as const,
//   lists: () => [...courseKeys.all, "list"] as const,
//   list: (filters: string) => [...courseKeys.lists(), { filters }] as const,
//   details: () => [...courseKeys.all, "detail"] as const,
//   detail: (id: string) => [...courseKeys.details(), id] as const,
// }