/** @jsxImportSource react */
import type { BrandSeoConfig } from "@suba-company-template/types";
import type React from "react";

import { SimpleTemplate, getThemeLabel } from "./base";
import type { OgImageData } from "../types";

interface PageTemplateProps {
  data: OgImageData;
  brand: BrandSeoConfig;
}

export const PageTemplate = ({
  data,
  brand,
}: PageTemplateProps): React.ReactElement => {
  const theme = data.pageTheme || "generic";
  const themeLabel = getThemeLabel(theme);

  return (
    <SimpleTemplate
      brand={brand}
      title={data.title}
      description={data.description}
      category={data.category || themeLabel}
      routeLabel={themeLabel}
      meta={[themeLabel, "Dynamic OG"]}
      imageUrl={data.imageUrl}
    />
  );
};
