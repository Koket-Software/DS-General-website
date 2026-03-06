/** @jsxImportSource react */
import type { BrandSeoConfig } from "@suba-company-template/types";
import type React from "react";

import { DetailTemplate } from "./base";
import type { OgImageData } from "../types";

interface CareerTemplateProps {
  data: OgImageData;
  brand: BrandSeoConfig;
}

export const CareerTemplate = ({
  data,
  brand,
}: CareerTemplateProps): React.ReactElement => {
  return (
    <DetailTemplate
      data={{ ...data, pageTheme: "career" }}
      brand={brand}
      defaultCategory="Careers"
      railTitle="Hiring Signal"
    />
  );
};
