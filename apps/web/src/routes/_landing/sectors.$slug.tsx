import { createFileRoute } from "@tanstack/react-router";

import { BusinessSectorPage } from "@/features/landing/pages/SourcingLogisticsPage";
import type {
  PublicBusinessSectorDetailResponse,
  PublicBusinessSectorsListResponse,
} from "@/lib/business-sectors/business-sectors-api";
import {
  publicBusinessSectorDetailQueryOptions,
  publicBusinessSectorsQueryOptions,
} from "@/lib/business-sectors/business-sectors-query";
import { buildSectorDetailHead } from "@/lib/seo";

interface SectorRouteLoaderData {
  sector: PublicBusinessSectorDetailResponse;
  sectors: PublicBusinessSectorsListResponse;
}

export const Route = createFileRoute("/_landing/sectors/$slug")({
  head: ({ loaderData, params }) => {
    const sector = (loaderData as SectorRouteLoaderData | undefined)?.sector
      ?.data;

    if (!sector) {
      return buildSectorDetailHead({
        slug: params.slug,
        title: params.slug,
      });
    }

    return buildSectorDetailHead({
      slug: params.slug,
      title: sector.title,
      description: sector.excerpt,
      featuredImageUrl: sector.featuredImageUrl,
    });
  },
  loader: async ({ context, params }) => {
    const { slug } = params;

    const [sector, sectors] = await Promise.all([
      context.queryClient.ensureQueryData(
        publicBusinessSectorDetailQueryOptions(slug),
      ),
      context.queryClient.ensureQueryData(
        publicBusinessSectorsQueryOptions({
          page: 1,
          limit: 50,
          sortBy: "publishDate",
          sortOrder: "desc",
        }),
      ),
    ]);

    return { sector, sectors } satisfies SectorRouteLoaderData;
  },
  component: SectorRoutePage,
});

function SectorRoutePage() {
  const { slug } = Route.useParams();
  return <BusinessSectorPage slug={slug} />;
}
