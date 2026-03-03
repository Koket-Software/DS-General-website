/** @jsxImportSource react */
import type { BrandSeoConfig } from "@suba-company-template/types";
import type React from "react";

import {
  BaseTemplate,
  OgHeader,
  OgTitle,
  OgDescription,
  OgFooter,
} from "./base";
import type { OgImageData } from "../types";

interface PageTemplateProps {
  data: OgImageData;
  brand: BrandSeoConfig;
}

/**
 * Generic Page OG Image Template
 */
export const PageTemplate = ({
  data,
  brand,
}: PageTemplateProps): React.ReactElement => {
  return (
    <BaseTemplate data={data} brand={brand}>
      {/* Header */}
      <OgHeader category={data.category} type={data.type} brand={brand} />

      {/* Main content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          flex: 1,
          justifyContent: "center",
        }}
      >
        <OgTitle title={data.title} />
        {data.description && <OgDescription description={data.description} />}
      </div>

      {/* Footer */}
      <OgFooter brand={brand} />
    </BaseTemplate>
  );
};
