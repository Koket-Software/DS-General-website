/** @jsxImportSource react */
import type { BrandSeoConfig } from "@suba-company-template/types";
import type React from "react";

import { SimpleTemplate } from "./base";
import type { OgImageData } from "../types";

interface HomeTemplateProps {
  data: OgImageData;
  brand: BrandSeoConfig;
}

export const HomeTemplate = ({
  data,
  brand,
}: HomeTemplateProps): React.ReactElement => {
  return (
    <SimpleTemplate
      brand={brand}
      title={data.title}
      description={data.description}
      category="We're Building the Future"
      routeLabel="Homepage"
      meta={["Addis Ababa, Ethiopia", "Integrated execution"]}
      imageUrl={data.imageUrl}
    />
  );
};
