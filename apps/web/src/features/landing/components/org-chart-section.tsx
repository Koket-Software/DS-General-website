import { useMemo } from "react";

import { usePublicOrgQuery } from "@/lib/org/org-query";
import { buildOrgHierarchy, type PublicOrgNode } from "@/lib/org/org-schema";

function OrgNodeCard({ node }: { node: PublicOrgNode }) {
  return (
    <div className="border border-border/60 p-4 bg-background">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-muted/50 shrink-0">
          {node.headshotUrl ? (
            <img
              src={node.headshotUrl}
              alt={`${node.firstName} ${node.lastName}`}
              className="w-full h-full object-cover"
            />
          ) : null}
        </div>
        <div>
          <p className="font-sans font-semibold text-foreground text-[15px] leading-tight">
            {node.firstName} {node.lastName}
          </p>
          <p className="font-sans text-muted-foreground text-[13px] leading-tight">
            {node.title}
          </p>
        </div>
      </div>

      {node.children.length > 0 ? (
        <div className="mt-4 pl-4 border-l border-primary/20 space-y-3">
          {node.children.map((child) => (
            <OrgNodeCard key={child.id} node={child} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function OrgChartSection() {
  const orgQuery = usePublicOrgQuery({
    page: 1,
    limit: 100,
    sortBy: "lastName",
    sortOrder: "asc",
  });

  const hierarchy = useMemo(
    () => buildOrgHierarchy(orgQuery.data?.data ?? []),
    [orgQuery.data?.data],
  );

  return (
    <section className="landing-container landing-section-compact">
      <div className="flex flex-col gap-2 mb-8">
        <p className="font-sans text-muted-foreground text-[16px] uppercase">
          /Organization
        </p>
        <h2 className="font-sans font-semibold text-foreground text-[28px] md:text-[36px] leading-[1.2]">
          Our Team Structure
        </h2>
      </div>

      {orgQuery.isError ? (
        <p className="font-sans text-sm text-muted-foreground">
          Unable to load the organization chart.
        </p>
      ) : orgQuery.isPending ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-28 border border-border/60 bg-muted/50 animate-pulse"
            />
          ))}
        </div>
      ) : hierarchy.length === 0 ? (
        <p className="font-sans text-sm text-muted-foreground">
          No organization members published yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {hierarchy.map((node) => (
            <OrgNodeCard key={node.id} node={node} />
          ))}
        </div>
      )}
    </section>
  );
}
