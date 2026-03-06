/** @jsxImportSource react */
import type { BrandSeoConfig } from "@suba-company-template/types";
import type React from "react";

import {
  BackgroundDecor,
  BrandLine,
  BrandStamp,
  DisplayTitle,
  Frame,
  HighlightChips,
  Lead,
  SectionChip,
  createCanvasStyle,
} from "./base";

interface DefaultTemplateProps {
  brand: BrandSeoConfig;
}

export const DefaultTemplate = ({
  brand,
}: DefaultTemplateProps): React.ReactElement => {
  return (
    <div style={createCanvasStyle(brand)}>
      <BackgroundDecor brand={brand} />
      <Frame>
        <BrandLine brand={brand} rightLabel="Official Share Card" />

        <div
          style={{
            display: "flex",
            gap: "30px",
            flex: 1,
            marginTop: "34px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: "22px",
              flex: 1.2,
              padding: "38px",
              borderRadius: "38px",
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(6, 10, 20, 0.44)",
            }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "22px" }}
            >
              <SectionChip label="Official Site" brand={brand} />
              <DisplayTitle title={brand.siteName} maxLength={72} />
              <Lead description={brand.defaultDescription} maxLength={190} />
            </div>
            <HighlightChips items={brand.keywords.slice(0, 4)} brand={brand} />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
              width: "356px",
            }}
          >
            <BrandStamp brand={brand} label="Brand System" />
          </div>
        </div>
      </Frame>
    </div>
  );
};
