/** @jsxImportSource react */
import type { BrandSeoConfig } from "@suba-company-template/types";
import type React from "react";

import type { OgImageData, OgPageTheme } from "../types";

const THEME_LABELS: Record<OgPageTheme, string> = {
  home: "Homepage",
  about: "About",
  articles: "Articles",
  gallery: "Gallery",
  contact: "Contact",
  career: "Careers",
  legal: "Legal",
  sector: "Sector",
  generic: "Page",
};

const THEME_META: Record<OgPageTheme, string> = {
  home: "Official website",
  about: "Company profile",
  articles: "Insights and updates",
  gallery: "Project highlights",
  contact: "Get in touch",
  career: "Hiring opportunities",
  legal: "Policy information",
  sector: "Business focus",
  generic: "Public page",
};

const MAX_META_ITEMS = 3;

function hexToRgba(value: string, alpha: number): string {
  const normalized = value.replace("#", "").trim();

  if (normalized.length !== 3 && normalized.length !== 6) {
    return `rgba(15, 23, 42, ${alpha})`;
  }

  const expanded =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => `${char}${char}`)
          .join("")
      : normalized;

  const red = Number.parseInt(expanded.slice(0, 2), 16);
  const green = Number.parseInt(expanded.slice(2, 4), 16);
  const blue = Number.parseInt(expanded.slice(4, 6), 16);

  if ([red, green, blue].some(Number.isNaN)) {
    return `rgba(15, 23, 42, ${alpha})`;
  }

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function truncate(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 3).trim()}...`;
}

function titleSize(title: string): string {
  if (title.length > 92) return "56px";
  if (title.length > 68) return "64px";
  return "72px";
}

function descriptionSize(description: string): string {
  if (description.length > 188) return "23px";
  return "25px";
}

function toUrlLabel(siteUrl: string): string {
  return siteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function normalizeMeta(items?: string[]): string[] {
  if (!items || items.length === 0) {
    return [];
  }

  return items
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, MAX_META_ITEMS)
    .map((item) => truncate(item, 42));
}

function AccentDecor({ brand }: { brand: BrandSeoConfig }): React.ReactElement {
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: "-80px",
          right: "-120px",
          width: "420px",
          height: "420px",
          borderRadius: "999px",
          background: `radial-gradient(circle at center, ${hexToRgba(brand.brandAccent, 0.24)} 0%, rgba(255,255,255,0) 70%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "-180px",
          bottom: "-180px",
          width: "520px",
          height: "520px",
          borderRadius: "999px",
          background: `radial-gradient(circle at center, ${hexToRgba(brand.brandPrimary, 0.14)} 0%, rgba(255,255,255,0) 72%)`,
        }}
      />
    </>
  );
}

function Header({
  brand,
  routeLabel,
}: {
  brand: BrandSeoConfig;
  routeLabel: string;
}): React.ReactElement {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "18px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            fontSize: "18px",
            fontWeight: 800,
            background: `linear-gradient(140deg, ${hexToRgba(brand.brandPrimary, 1)} 0%, ${hexToRgba(brand.brandAccent, 0.9)} 100%)`,
          }}
        >
          DS
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span
            style={{
              fontSize: "24px",
              lineHeight: 1,
              fontWeight: 700,
              color: hexToRgba(brand.brandSecondary, 0.96),
              fontFamily: '"Playfair Display", serif',
            }}
          >
            {truncate(brand.siteName, 34)}
          </span>
          <span
            style={{
              fontSize: "14px",
              color: "#475569",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            {truncate(toUrlLabel(brand.siteUrl), 38)}
          </span>
        </div>
      </div>

      <span
        style={{
          fontSize: "14px",
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: hexToRgba(brand.brandPrimary, 0.92),
          border: `1px solid ${hexToRgba(brand.brandPrimary, 0.25)}`,
          borderRadius: "999px",
          padding: "10px 14px",
          background: hexToRgba(brand.brandPrimary, 0.08),
        }}
      >
        {truncate(routeLabel, 22)}
      </span>
    </div>
  );
}

function MetaRow({
  items,
  brand,
}: {
  items: string[];
  brand: BrandSeoConfig;
}): React.ReactElement | null {
  if (items.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        color: "#475569",
        fontSize: "17px",
        flexWrap: "wrap",
      }}
    >
      {items.map((item, index) => (
        <div
          key={`${item}-${index}`}
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          {index > 0 ? (
            <div
              style={{
                width: "4px",
                height: "4px",
                borderRadius: "999px",
                background: hexToRgba(brand.brandAccent, 0.7),
              }}
            />
          ) : null}
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
}

function OptionalImage({
  imageUrl,
  brand,
}: {
  imageUrl?: string | null;
  brand: BrandSeoConfig;
}): React.ReactElement | null {
  if (!imageUrl) {
    return null;
  }

  return (
    <div
      style={{
        marginTop: "22px",
        width: "100%",
        height: "150px",
        borderRadius: "18px",
        overflow: "hidden",
        border: `1px solid ${hexToRgba(brand.brandAccent, 0.2)}`,
        background: hexToRgba(brand.brandSecondary, 0.06),
      }}
    >
      <img
        src={imageUrl}
        alt=""
        width={1020}
        height={150}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
}

interface SimpleTemplateProps {
  brand: BrandSeoConfig;
  title: string;
  description?: string;
  category: string;
  routeLabel: string;
  meta?: string[];
  imageUrl?: string | null;
}

export function createCanvasStyle(brand: BrandSeoConfig): React.CSSProperties {
  return {
    width: "100%",
    height: "100%",
    display: "flex",
    position: "relative",
    overflow: "hidden",
    color: "#0f172a",
    background: [
      `radial-gradient(circle at 10% 12%, ${hexToRgba(brand.brandPrimary, 0.12)} 0%, rgba(255,255,255,0) 32%)`,
      `radial-gradient(circle at 86% 10%, ${hexToRgba(brand.brandAccent, 0.14)} 0%, rgba(255,255,255,0) 30%)`,
      `linear-gradient(145deg, ${hexToRgba(brand.brandSecondary, 0.08)} 0%, rgba(255,255,255,1) 45%, ${hexToRgba(brand.brandPrimary, 0.05)} 100%)`,
      "#f8fafc",
    ].join(", "),
    fontFamily: '"Manrope", sans-serif',
  };
}

export function SimpleTemplate({
  brand,
  title,
  description,
  category,
  routeLabel,
  meta,
  imageUrl,
}: SimpleTemplateProps): React.ReactElement {
  const safeTitle = truncate(title, 104);
  const safeDescription = description ? truncate(description, 224) : "";
  const safeMeta = normalizeMeta(meta);

  return (
    <div style={createCanvasStyle(brand)}>
      <AccentDecor brand={brand} />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          height: "100%",
          display: "flex",
          padding: "34px",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            borderRadius: "30px",
            background: "rgba(255,255,255,0.94)",
            border: `1px solid ${hexToRgba(brand.brandSecondary, 0.12)}`,
            boxShadow: `0 24px 56px ${hexToRgba(brand.brandSecondary, 0.14)}`,
            padding: "30px 34px",
          }}
        >
          <Header brand={brand} routeLabel={routeLabel} />

          <div
            style={{
              width: "100%",
              height: "1px",
              marginTop: "22px",
              background: `linear-gradient(90deg, ${hexToRgba(brand.brandPrimary, 0.28)} 0%, ${hexToRgba(brand.brandAccent, 0.18)} 55%, rgba(255,255,255,0) 100%)`,
            }}
          />

          <div
            style={{
              marginTop: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              flex: 1,
            }}
          >
            <span
              style={{
                fontSize: "15px",
                fontWeight: 700,
                letterSpacing: "0.09em",
                textTransform: "uppercase",
                color: hexToRgba(brand.brandPrimary, 0.92),
              }}
            >
              {truncate(category, 34)}
            </span>

            <h1
              style={{
                margin: 0,
                fontSize: titleSize(safeTitle),
                lineHeight: 1.02,
                letterSpacing: "-0.03em",
                color: hexToRgba(brand.brandSecondary, 0.97),
                fontFamily: '"Playfair Display", serif',
                maxWidth: "980px",
              }}
            >
              {safeTitle}
            </h1>

            {safeDescription ? (
              <p
                style={{
                  margin: 0,
                  maxWidth: "960px",
                  fontSize: descriptionSize(safeDescription),
                  lineHeight: 1.35,
                  color: "#334155",
                }}
              >
                {safeDescription}
              </p>
            ) : null}

            <MetaRow
              items={
                safeMeta.length > 0
                  ? safeMeta
                  : [
                      THEME_META.generic,
                      truncate(toUrlLabel(brand.siteUrl), 38),
                    ]
              }
              brand={brand}
            />

            <OptionalImage imageUrl={imageUrl} brand={brand} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function DetailTemplate({
  data,
  brand,
  defaultCategory,
  railTitle,
}: {
  data: OgImageData;
  brand: BrandSeoConfig;
  defaultCategory: string;
  railTitle: string;
}): React.ReactElement {
  const meta = [
    data.author ? `By ${truncate(data.author, 30)}` : null,
    data.date ? truncate(data.date, 24) : null,
    data.readTime ? `${data.readTime} min read` : null,
  ].filter(Boolean) as string[];

  return (
    <SimpleTemplate
      brand={brand}
      title={data.title}
      description={data.description}
      category={data.category || defaultCategory}
      routeLabel={railTitle}
      meta={meta}
      imageUrl={data.imageUrl}
    />
  );
}

export function getThemeLabel(theme: OgPageTheme): string {
  return THEME_LABELS[theme];
}
