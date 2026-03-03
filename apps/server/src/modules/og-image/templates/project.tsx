/** @jsxImportSource react */
import type { BrandSeoConfig } from "@suba-company-template/types";
import type React from "react";

import {
  BaseTemplate,
  OgHeader,
  OgTitle,
  OgDescription,
  OgFooter,
  OgTags,
} from "./base";
import type { OgImageData } from "../types";

interface ProjectTemplateProps {
  data: OgImageData;
  brand: BrandSeoConfig;
}

/**
 * Project/Case Study OG Image Template
 */
export const ProjectTemplate = ({
  data,
  brand,
}: ProjectTemplateProps): React.ReactElement => {
  return (
    <BaseTemplate data={data} brand={brand}>
      {/* Header */}
      <OgHeader
        category={data.category || "Case Study"}
        type={data.type}
        brand={brand}
      />

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
        {data.tags && data.tags.length > 0 && (
          <OgTags tags={data.tags} brand={brand} />
        )}
      </div>

      {/* Footer */}
      <OgFooter brand={brand} />
    </BaseTemplate>
  );
};
