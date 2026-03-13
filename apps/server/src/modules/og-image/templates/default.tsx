/** @jsxImportSource react */
import type { BrandSeoConfig } from "@suba-company-template/types";
import type React from "react";

import { SimpleTemplate } from "./base";

interface DefaultTemplateProps {
  brand: BrandSeoConfig;
}

export const DefaultTemplate = ({
  brand,
}: DefaultTemplateProps): React.ReactElement => {
  return (
    <SimpleTemplate
      brand={brand}
      title={brand.siteName}
      description={brand.defaultDescription}
      category="Official Website"
      routeLabel="Share Card"
      meta={["Trusted delivery", "General contracting", "Material supply"]}
    />
  );
};
