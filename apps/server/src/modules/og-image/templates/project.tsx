/** @jsxImportSource react */
import type { BrandSeoConfig } from "@suba-company-template/types";
import type React from "react";

import { DetailTemplate } from "./base";
import type { OgImageData } from "../types";

interface ProjectTemplateProps {
  data: OgImageData;
  brand: BrandSeoConfig;
}

export const ProjectTemplate = ({
  data,
  brand,
}: ProjectTemplateProps): React.ReactElement => {
  return (
    <DetailTemplate
      data={{ ...data, pageTheme: "generic" }}
      brand={brand}
      defaultCategory="Project"
      railTitle="Project"
    />
  );
};
