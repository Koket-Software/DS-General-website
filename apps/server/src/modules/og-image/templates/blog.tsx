/** @jsxImportSource react */
import type { BrandSeoConfig } from "@suba-company-template/types";
import type React from "react";

import { DetailTemplate } from "./base";
import type { OgImageData } from "../types";

interface BlogTemplateProps {
  data: OgImageData;
  brand: BrandSeoConfig;
}

export const BlogTemplate = ({
  data,
  brand,
}: BlogTemplateProps): React.ReactElement => {
  return (
    <DetailTemplate
      data={{ ...data, pageTheme: "articles" }}
      brand={brand}
      defaultCategory="Article"
      railTitle="Article"
    />
  );
};
