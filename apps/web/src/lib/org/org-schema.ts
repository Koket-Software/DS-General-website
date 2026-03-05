import { z } from "zod";

export const publicOrgMemberSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  title: z.string(),
  headshotUrl: z.string().nullable(),
  managerId: z.number().nullable(),
});

export const publicOrgParamsSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().min(1).max(200).default(50),
  search: z.string().trim().optional(),
  sortBy: z.enum(["createdAt", "lastName", "title"]).default("lastName"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export type PublicOrgMember = z.infer<typeof publicOrgMemberSchema>;
export type PublicOrgParams = z.infer<typeof publicOrgParamsSchema>;

export type PublicOrgNode = PublicOrgMember & {
  children: PublicOrgNode[];
};

export const normalizePublicOrgParams = (
  params?: Partial<PublicOrgParams>,
): PublicOrgParams => {
  const parsed = publicOrgParamsSchema.parse(params ?? {});

  return {
    ...parsed,
    search: parsed.search?.trim() || undefined,
  };
};

export const buildOrgHierarchy = (
  members: PublicOrgMember[],
): PublicOrgNode[] => {
  const nodes = members.map((member) => ({
    ...member,
    children: [] as PublicOrgNode[],
  }));
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const roots: PublicOrgNode[] = [];

  for (const node of nodes) {
    if (node.managerId && byId.has(node.managerId)) {
      byId.get(node.managerId)?.children.push(node);
      continue;
    }

    roots.push(node);
  }

  return roots;
};
