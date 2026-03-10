/** @jsxImportSource react */
import type { BrandSeoConfig } from "@suba-company-template/types";
import type React from "react";

import type { OgImageData, OgPageTheme } from "../types";

const FALLBACK_HIGHLIGHTS: Record<OgPageTheme, string[]> = {
  home: ["General Contracting", "Material Supply", "Global Sourcing"],
  about: ["Mission-led", "Integrated delivery", "Ethiopian market focus"],
  articles: ["Operational insights", "Engineering stories", "Field notes"],
  gallery: ["Field moments", "Delivery snapshots", "Project highlights"],
  contact: ["Quotes", "Procurement", "Project planning"],
  career: ["Open roles", "Operational excellence", "Build with us"],
  legal: ["Transparency", "Clear terms", "Responsible data handling"],
  sector: ["Cross-border sourcing", "Reliable logistics", "Sector expertise"],
  generic: ["Trusted delivery", "Operational clarity", "Brand-led execution"],
};

const THEME_LABELS: Record<OgPageTheme, string> = {
  home: "Flagship Overview",
  about: "Company Profile",
  articles: "Insights Library",
  gallery: "Visual Archive",
  contact: "Contact Desk",
  career: "Talent Desk",
  legal: "Policy Record",
  sector: "Business Sector",
  generic: "Official Page",
};

const DETAILS_LIMIT = 4;

function hexToRgba(value: string, alpha: number): string {
  const normalized = value.replace("#", "").trim();

  if (normalized.length !== 3 && normalized.length !== 6) {
    return `rgba(255, 255, 255, ${alpha})`;
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
    return `rgba(255, 255, 255, ${alpha})`;
  }

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function truncate(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 3).trim()}...`;
}

function titleSize(title: string): string {
  if (title.length > 88) return "54px";
  if (title.length > 62) return "62px";
  return "72px";
}

function bodySize(description: string): string {
  if (description.length > 170) return "24px";
  return "26px";
}

function buildHighlights(data: OgImageData): string[] {
  const supplied = (data.highlights || data.tags || [])
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, DETAILS_LIMIT);

  if (supplied.length > 0) {
    return supplied;
  }

  const theme = data.pageTheme || "generic";
  return FALLBACK_HIGHLIGHTS[theme];
}

export function createCanvasStyle(brand: BrandSeoConfig): React.CSSProperties {
  return {
    width: "100%",
    height: "100%",
    display: "flex",
    position: "relative",
    overflow: "hidden",
    color: "#f8fafc",
    background: [
      `radial-gradient(circle at 10% 12%, ${hexToRgba(brand.brandAccent, 0.32)} 0%, rgba(255,255,255,0) 26%)`,
      `radial-gradient(circle at 87% 14%, ${hexToRgba(brand.brandPrimary, 0.36)} 0%, rgba(255,255,255,0) 31%)`,
      `radial-gradient(circle at 78% 88%, ${hexToRgba(brand.brandAccent, 0.2)} 0%, rgba(255,255,255,0) 30%)`,
      `linear-gradient(148deg, #050916 0%, ${hexToRgba(brand.brandSecondary, 0.98)} 34%, ${hexToRgba(brand.brandPrimary, 0.9)} 100%)`,
    ].join(", "),
    fontFamily: '"Manrope", sans-serif',
  };
}

export function BackgroundDecor({
  brand,
}: {
  brand: BrandSeoConfig;
}): React.ReactElement {
  return (
    <>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: [
            "linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
            "linear-gradient(180deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
          ].join(", "),
          backgroundSize: "68px 68px",
          opacity: 0.18,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "-8%",
          width: "46%",
          height: "2px",
          transform: "rotate(-12deg)",
          background: `linear-gradient(90deg, rgba(255,255,255,0) 0%, ${hexToRgba(brand.brandAccent, 0.7)} 52%, rgba(255,255,255,0) 100%)`,
          opacity: 0.8,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "14%",
          right: "-8%",
          width: "52%",
          height: "2px",
          transform: "rotate(-12deg)",
          background: `linear-gradient(90deg, rgba(255,255,255,0) 0%, ${hexToRgba(brand.brandAccent, 0.56)} 44%, rgba(255,255,255,0) 100%)`,
          opacity: 0.68,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "-12%",
          right: "6%",
          width: "360px",
          height: "360px",
          borderRadius: "999px",
          border: `1px solid ${hexToRgba(brand.brandAccent, 0.25)}`,
          opacity: 0.45,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "8%",
          right: "12%",
          width: "220px",
          height: "220px",
          borderRadius: "999px",
          border: `1px solid ${hexToRgba(brand.brandAccent, 0.16)}`,
          opacity: 0.55,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "-12%",
          bottom: "-28%",
          width: "680px",
          height: "360px",
          borderRadius: "999px",
          background: `radial-gradient(circle at 60% 40%, ${hexToRgba(brand.brandPrimary, 0.26)} 0%, rgba(255,255,255,0) 68%)`,
          opacity: 0.7,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "16%",
          left: "35%",
          width: "120px",
          height: "120px",
          border: `1px solid ${hexToRgba(brand.brandAccent, 0.16)}`,
          transform: "rotate(45deg)",
          opacity: 0.44,
        }}
      />
    </>
  );
}

export function Frame({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div
      style={{
        position: "relative",
        zIndex: 2,
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        padding: "54px",
      }}
    >
      {children}
    </div>
  );
}

export function SectionChip({
  label,
  brand,
}: {
  label: string;
  brand: BrandSeoConfig;
}): React.ReactElement {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        alignSelf: "flex-start",
        padding: "12px 18px",
        borderRadius: "999px",
        border: `1px solid ${hexToRgba(brand.brandAccent, 0.34)}`,
        background: "rgba(5, 10, 21, 0.42)",
      }}
    >
      <div
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "999px",
          background: brand.brandAccent,
          boxShadow: `0 0 20px ${hexToRgba(brand.brandAccent, 0.55)}`,
        }}
      />
      <span
        style={{
          fontSize: "16px",
          fontWeight: 700,
          letterSpacing: "2.1px",
          textTransform: "uppercase",
          color: "#f8fafc",
        }}
      >
        {truncate(label, 34)}
      </span>
    </div>
  );
}

export function BrandLine({
  brand,
  rightLabel,
}: {
  brand: BrandSeoConfig;
  rightLabel?: string;
}): React.ReactElement {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "18px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "42px",
            height: "42px",
            borderRadius: "14px",
            color: "#ffffff",
            fontSize: "20px",
            fontWeight: 800,
            background: `linear-gradient(135deg, ${hexToRgba(brand.brandPrimary, 1)} 0%, ${hexToRgba(brand.brandAccent, 0.92)} 100%)`,
          }}
        >
          DS
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "#ffffff",
              fontFamily: '"Playfair Display", serif',
            }}
          >
            {brand.siteName}
          </span>
          <span
            style={{
              fontSize: "14px",
              textTransform: "uppercase",
              letterSpacing: "2px",
              color: "rgba(248,250,252,0.68)",
            }}
          >
            Addis Ababa, Ethiopia
          </span>
        </div>
      </div>

      <span
        style={{
          fontSize: "16px",
          letterSpacing: "1.6px",
          textTransform: "uppercase",
          color: "rgba(248,250,252,0.72)",
        }}
      >
        {rightLabel || brand.siteUrl.replace(/^https?:\/\//, "")}
      </span>
    </div>
  );
}

export function DisplayTitle({
  title,
  maxLength = 96,
}: {
  title: string;
  maxLength?: number;
}): React.ReactElement {
  const display = truncate(title, maxLength);

  return (
    <h1
      style={{
        margin: 0,
        fontSize: titleSize(display),
        lineHeight: 1.02,
        fontWeight: 700,
        letterSpacing: "-1.8px",
        color: "#ffffff",
        fontFamily: '"Playfair Display", serif',
        maxWidth: "760px",
      }}
    >
      {display}
    </h1>
  );
}

export function Lead({
  description,
  maxLength = 210,
}: {
  description: string;
  maxLength?: number;
}): React.ReactElement {
  const display = truncate(description, maxLength);

  return (
    <p
      style={{
        margin: 0,
        maxWidth: "760px",
        fontSize: bodySize(display),
        lineHeight: 1.35,
        color: "rgba(241,245,249,0.9)",
      }}
    >
      {display}
    </p>
  );
}

export function HighlightChips({
  items,
  brand,
}: {
  items: string[];
  brand: BrandSeoConfig;
}): React.ReactElement | null {
  if (items.length === 0) return null;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
      {items.map((item) => (
        <div
          key={item}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "10px 16px",
            borderRadius: "999px",
            border: `1px solid ${hexToRgba(brand.brandAccent, 0.28)}`,
            background: hexToRgba(brand.brandSecondary, 0.44),
            color: "#f8fafc",
            fontSize: "17px",
            fontWeight: 600,
          }}
        >
          {truncate(item, 28)}
        </div>
      ))}
    </div>
  );
}

export function MetaBar({
  author,
  date,
  readTime,
}: {
  author?: string;
  date?: string;
  readTime?: number;
}): React.ReactElement | null {
  const items = [
    author ? `By ${truncate(author, 32)}` : null,
    date ? truncate(date, 26) : null,
    readTime ? `${readTime} min read` : null,
  ].filter(Boolean) as string[];

  if (items.length === 0) return null;

  return (
    <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
      {items.map((item) => (
        <div
          key={item}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "10px 14px",
            borderRadius: "14px",
            background: "rgba(255,255,255,0.08)",
            color: "rgba(241,245,249,0.92)",
            fontSize: "18px",
          }}
        >
          {item}
        </div>
      ))}
    </div>
  );
}

export function BrandStamp({
  brand,
  label,
}: {
  brand: BrandSeoConfig;
  label: string;
}): React.ReactElement {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        padding: "22px",
        borderRadius: "28px",
        border: `1px solid ${hexToRgba(brand.brandAccent, 0.24)}`,
        background: "rgba(8, 13, 28, 0.54)",
      }}
    >
      <span
        style={{
          fontSize: "14px",
          textTransform: "uppercase",
          letterSpacing: "2px",
          color: "rgba(241,245,249,0.64)",
        }}
      >
        {label}
      </span>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "18px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "86px",
            height: "86px",
            borderRadius: "22px",
            color: "#ffffff",
            fontSize: "40px",
            fontWeight: 800,
            fontFamily: '"Playfair Display", serif',
            background: `linear-gradient(135deg, ${hexToRgba(brand.brandPrimary, 1)} 0%, ${hexToRgba(brand.brandAccent, 0.84)} 100%)`,
          }}
        >
          DS
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            flex: 1,
          }}
        >
          <span
            style={{
              fontSize: "26px",
              fontWeight: 700,
              color: "#ffffff",
              fontFamily: '"Playfair Display", serif',
            }}
          >
            {brand.siteName}
          </span>
          <span
            style={{
              fontSize: "18px",
              lineHeight: 1.35,
              color: "rgba(241,245,249,0.78)",
            }}
          >
            {brand.defaultDescription}
          </span>
        </div>
      </div>
    </div>
  );
}

export function InfoCard({
  brand,
  title,
  body,
}: {
  brand: BrandSeoConfig;
  title: string;
  body: string;
}): React.ReactElement {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        padding: "20px 22px",
        borderRadius: "22px",
        border: `1px solid ${hexToRgba(brand.brandAccent, 0.18)}`,
        background: "rgba(255,255,255,0.05)",
      }}
    >
      <span
        style={{
          fontSize: "14px",
          textTransform: "uppercase",
          letterSpacing: "2px",
          color: "rgba(241,245,249,0.6)",
        }}
      >
        {title}
      </span>
      <span
        style={{
          fontSize: "22px",
          lineHeight: 1.32,
          color: "#ffffff",
          fontFamily: '"Playfair Display", serif',
        }}
      >
        {truncate(body, 92)}
      </span>
    </div>
  );
}

export function VisualPanel({
  brand,
  imageUrl,
  label,
}: {
  brand: BrandSeoConfig;
  imageUrl?: string | null;
  label: string;
}): React.ReactElement {
  if (imageUrl) {
    return (
      <div
        style={{
          position: "relative",
          display: "flex",
          flex: 1,
          borderRadius: "32px",
          overflow: "hidden",
          minHeight: "100%",
          border: `1px solid ${hexToRgba(brand.brandAccent, 0.18)}`,
          background: "rgba(255,255,255,0.06)",
        }}
      >
        <img
          src={imageUrl}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: [
              "linear-gradient(180deg, rgba(7,11,22,0.12) 0%, rgba(7,11,22,0.78) 100%)",
              `radial-gradient(circle at 20% 18%, ${hexToRgba(brand.brandAccent, 0.18)} 0%, rgba(255,255,255,0) 26%)`,
            ].join(", "),
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "24px",
            right: "24px",
            bottom: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "14px",
          }}
        >
          <span
            style={{
              fontSize: "14px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "rgba(248,250,252,0.72)",
            }}
          >
            {label}
          </span>
          <div
            style={{
              width: "64px",
              height: "64px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "18px",
              background: hexToRgba(brand.brandPrimary, 0.78),
              color: "#ffffff",
              fontSize: "28px",
              fontWeight: 800,
              fontFamily: '"Playfair Display", serif',
            }}
          >
            DS
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRadius: "32px",
        minHeight: "100%",
        padding: "28px",
        border: `1px solid ${hexToRgba(brand.brandAccent, 0.18)}`,
        background: [
          `linear-gradient(135deg, ${hexToRgba(brand.brandPrimary, 0.35)} 0%, rgba(255,255,255,0.05) 100%)`,
          `radial-gradient(circle at 72% 18%, ${hexToRgba(brand.brandAccent, 0.18)} 0%, rgba(255,255,255,0) 28%)`,
        ].join(", "),
      }}
    >
      <span
        style={{
          fontSize: "14px",
          letterSpacing: "2px",
          textTransform: "uppercase",
          color: "rgba(248,250,252,0.64)",
        }}
      >
        {label}
      </span>
      <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "220px",
            borderRadius: "28px",
            border: `1px solid ${hexToRgba(brand.brandAccent, 0.18)}`,
            color: "#ffffff",
            fontSize: "112px",
            fontWeight: 800,
            fontFamily: '"Playfair Display", serif',
            background: "rgba(5, 10, 21, 0.32)",
          }}
        >
          DS
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <span
            style={{
              fontSize: "28px",
              lineHeight: 1.15,
              color: "#ffffff",
              fontFamily: '"Playfair Display", serif',
            }}
          >
            Integrated delivery across sourcing, construction, and operations.
          </span>
          <span
            style={{
              fontSize: "17px",
              lineHeight: 1.35,
              color: "rgba(241,245,249,0.74)",
            }}
          >
            Route-aware visual metadata generated dynamically with the brand
            system.
          </span>
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
  const highlights = buildHighlights(data);

  return (
    <div style={createCanvasStyle(brand)}>
      <BackgroundDecor brand={brand} />
      <Frame>
        <BrandLine brand={brand} rightLabel={railTitle} />
        <div
          style={{
            display: "flex",
            gap: "28px",
            flex: 1,
            marginTop: "32px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: "24px",
              flex: 1.25,
              padding: "34px",
              borderRadius: "34px",
              border: `1px solid ${hexToRgba(brand.brandAccent, 0.16)}`,
              background: "rgba(7, 11, 22, 0.44)",
            }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              <SectionChip
                label={data.category || defaultCategory}
                brand={brand}
              />
              <DisplayTitle title={data.title} />
              {data.description ? (
                <Lead description={data.description} />
              ) : null}
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "18px" }}
            >
              <HighlightChips items={highlights} brand={brand} />
              <MetaBar
                author={data.author}
                date={data.date}
                readTime={data.readTime}
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              width: "348px",
            }}
          >
            <VisualPanel
              brand={brand}
              imageUrl={data.imageUrl}
              label={railTitle}
            />
          </div>
        </div>
      </Frame>
    </div>
  );
}

export function getThemeLabel(theme: OgPageTheme): string {
  return THEME_LABELS[theme];
}

export function getPageHighlights(data: OgImageData): string[] {
  return buildHighlights(data);
}
