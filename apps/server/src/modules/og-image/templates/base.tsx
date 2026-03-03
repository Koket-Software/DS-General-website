/** @jsxImportSource react */
import type { BrandSeoConfig } from "@suba-company-template/types";
import type React from "react";

import type { OgImageData } from "../types";

interface BaseTemplateProps {
  data: OgImageData;
  brand: BrandSeoConfig;
  children?: React.ReactNode;
}

export const BaseTemplate = ({
  data,
  brand,
  children,
}: BaseTemplateProps): React.ReactElement => {
  const hasImage = Boolean(data.imageUrl);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        fontFamily: '"Playfair Display", serif',
        background: `linear-gradient(125deg, ${brand.brandSecondary} 0%, ${brand.brandPrimary} 70%, ${brand.brandAccent} 100%)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "-20%",
          background:
            "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 40%), radial-gradient(circle at 80% 85%, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 35%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.2,
          backgroundImage:
            "linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(180deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
        }}
      />

      {hasImage && (
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "48%",
            height: "100%",
            display: "flex",
          }}
        >
          <img
            src={data.imageUrl!}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.4,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(92deg, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.7) 52%, rgba(15,23,42,0.2) 100%)",
            }}
          />
        </div>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
          padding: "56px",
          position: "relative",
          zIndex: 3,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const OgHeader = ({
  category,
  type,
  brand,
}: {
  category?: string;
  type: string;
  brand: BrandSeoConfig;
}): React.ReactElement => {
  const displayCategory =
    category || type.charAt(0).toUpperCase() + type.slice(1);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          borderRadius: "999px",
          padding: "9px 18px",
          border: "1px solid rgba(255,255,255,0.35)",
          backgroundColor: "rgba(0, 0, 0, 0.18)",
        }}
      >
        <span
          style={{
            color: "#ffffff",
            fontSize: "16px",
            fontWeight: 700,
            letterSpacing: "2.1px",
            textTransform: "uppercase",
            fontFamily: '"Manrope", sans-serif',
          }}
        >
          {displayCategory}
        </span>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          color: "rgba(255,255,255,0.9)",
          fontSize: "18px",
        }}
      >
        <div
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "999px",
            background: brand.brandAccent,
            boxShadow: "0 0 18px rgba(255,255,255,0.6)",
          }}
        />
        <span>{brand.siteName}</span>
      </div>
    </div>
  );
};

export const OgTitle = ({ title }: { title: string }): React.ReactElement => {
  const displayTitle =
    title.length > 92 ? `${title.substring(0, 89).trim()}...` : title;

  return (
    <h1
      style={{
        margin: 0,
        color: "#ffffff",
        fontSize: displayTitle.length > 60 ? "50px" : "60px",
        fontWeight: 700,
        lineHeight: 1.1,
        maxWidth: "790px",
        textShadow: "0 12px 40px rgba(0, 0, 0, 0.35)",
      }}
    >
      {displayTitle}
    </h1>
  );
};

export const OgDescription = ({
  description,
}: {
  description: string;
}): React.ReactElement => {
  const displayDescription =
    description.length > 180
      ? `${description.substring(0, 177).trim()}...`
      : description;

  return (
    <p
      style={{
        margin: 0,
        color: "rgba(255,255,255,0.9)",
        fontSize: "24px",
        lineHeight: 1.45,
        maxWidth: "780px",
        fontFamily: '"Manrope", sans-serif',
      }}
    >
      {displayDescription}
    </p>
  );
};

export const OgFooter = ({
  author,
  date,
  readTime,
  brand,
}: {
  author?: string;
  date?: string;
  readTime?: number;
  brand: BrandSeoConfig;
}): React.ReactElement => {
  const details: string[] = [];
  if (author) details.push(`By ${author}`);
  if (date) details.push(date);
  if (readTime) details.push(`${readTime} min read`);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "24px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {details.length > 0 ? (
          details.map((item, index) => (
            <span
              key={`${item}-${index}`}
              style={{
                color: "rgba(255,255,255,0.78)",
                fontSize: "17px",
                fontWeight: 500,
                fontFamily: '"Manrope", sans-serif',
              }}
            >
              {index > 0 ? `• ${item}` : item}
            </span>
          ))
        ) : (
          <span
            style={{
              color: "rgba(255,255,255,0.78)",
              fontSize: "17px",
              fontWeight: 500,
              fontFamily: '"Manrope", sans-serif',
            }}
          >
            {brand.defaultDescription}
          </span>
        )}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          backgroundColor: "rgba(0,0,0,0.2)",
          padding: "10px 14px",
          borderRadius: "14px",
          border: "1px solid rgba(255,255,255,0.25)",
        }}
      >
        <div
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "9px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: "18px",
            color: "#fff",
            background: `linear-gradient(130deg, ${brand.brandAccent} 0%, ${brand.brandPrimary} 100%)`,
          }}
        >
          {brand.siteName.charAt(0).toUpperCase()}
        </div>
        <span
          style={{
            color: "#fff",
            fontSize: "20px",
            fontWeight: 600,
          }}
        >
          {brand.siteName}
        </span>
      </div>
    </div>
  );
};

export const OgTags = ({
  tags,
  brand,
}: {
  tags: string[];
  brand: BrandSeoConfig;
}): React.ReactElement => {
  const displayTags = tags.slice(0, 4);
  return (
    <div style={{ display: "flex", gap: "11px", flexWrap: "wrap" }}>
      {displayTags.map((tag, index) => (
        <span
          key={`${tag}-${index}`}
          style={{
            fontSize: "15px",
            fontWeight: 500,
            color: "#ffffff",
            borderRadius: "999px",
            padding: "8px 14px",
            backgroundColor: "rgba(0,0,0,0.22)",
            border: `1px solid ${brand.brandAccent}`,
            fontFamily: '"Manrope", sans-serif',
          }}
        >
          {tag}
        </span>
      ))}
    </div>
  );
};
