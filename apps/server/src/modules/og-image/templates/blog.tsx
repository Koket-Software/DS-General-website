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

interface BlogTemplateProps {
  data: OgImageData;
  brand: BrandSeoConfig;
}

/**
 * Blog Post OG Image Template
 */
export const BlogTemplate = ({
  data,
  brand,
}: BlogTemplateProps): React.ReactElement => {
  return (
    <BaseTemplate data={data} brand={brand}>
      {/* Header with category */}
      <OgHeader
        category={data.category || "Blog"}
        type={data.type}
        brand={brand}
      />

      {/* Main content area */}
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

      {/* Footer with meta */}
      <OgFooter
        author={data.author}
        date={data.date}
        readTime={data.readTime}
        brand={brand}
      />
    </BaseTemplate>
  );
};
