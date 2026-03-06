/** @jsxImportSource react */
import type { BrandSeoConfig } from "@suba-company-template/types";
import type React from "react";

import { DetailTemplate } from "./base";
import type { OgImageData } from "../types";

interface ServiceTemplateProps {
  data: OgImageData;
  brand: BrandSeoConfig;
}

export const ServiceTemplate = ({
  data,
  brand,
}: ServiceTemplateProps): React.ReactElement => {
  return (
    <DetailTemplate
      data={{ ...data, pageTheme: "generic" }}
      brand={brand}
      defaultCategory="Service"
      railTitle="Capability Overview"
    />
  );
};
