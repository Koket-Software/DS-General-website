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
  InfoCard,
  Lead,
  SectionChip,
  createCanvasStyle,
  getPageHighlights,
} from "./base";
import type { OgImageData } from "../types";

interface HomeTemplateProps {
  data: OgImageData;
  brand: BrandSeoConfig;
}

export const HomeTemplate = ({
  data,
  brand,
}: HomeTemplateProps): React.ReactElement => {
  const highlights = getPageHighlights({ ...data, pageTheme: "home" });

  return (
    <div style={createCanvasStyle(brand)}>
      <BackgroundDecor brand={brand} />
      <Frame>
        <BrandLine brand={brand} rightLabel="Official Website" />

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
              flex: 1.3,
              padding: "38px",
              borderRadius: "38px",
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(6, 10, 20, 0.44)",
            }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "22px" }}
            >
              <SectionChip label="We're Building the Future" brand={brand} />
              <DisplayTitle title={data.title} maxLength={84} />
              {data.description ? (
                <Lead description={data.description} maxLength={190} />
              ) : null}
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "18px" }}
            >
              <HighlightChips items={highlights} brand={brand} />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  color: "rgba(248,250,252,0.74)",
                  fontSize: "17px",
                  letterSpacing: "1.2px",
                  textTransform: "uppercase",
                }}
              >
                <div
                  style={{
                    width: "68px",
                    height: "1px",
                    background: "rgba(248,250,252,0.3)",
                  }}
                />
                Ethiopia-focused execution across sourcing, supply, and
                construction.
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
              width: "356px",
            }}
          >
            <BrandStamp brand={brand} label="Brand Signal" />
            <InfoCard
              brand={brand}
              title="Operational Edge"
              body="Direct procurement, construction execution, and reliable delivery under one roof."
            />
            <InfoCard
              brand={brand}
              title="Coverage"
              body="Built for partners who need coordinated projects, materials, and momentum."
            />
          </div>
        </div>
      </Frame>
    </div>
  );
};
