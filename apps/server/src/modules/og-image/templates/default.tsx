/** @jsxImportSource react */
import type { BrandSeoConfig } from "@suba-company-template/types";
import type React from "react";

interface DefaultTemplateProps {
  brand: BrandSeoConfig;
}

export const DefaultTemplate = ({
  brand,
}: DefaultTemplateProps): React.ReactElement => {
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
        background: `linear-gradient(132deg, ${brand.brandSecondary} 0%, ${brand.brandPrimary} 72%, ${brand.brandAccent} 100%)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 12% 18%, rgba(255,255,255,0.2) 0%, transparent 45%), radial-gradient(circle at 84% 82%, rgba(255,255,255,0.14) 0%, transparent 42%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.22,
          backgroundImage:
            "linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(180deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "46px 46px",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          height: "100%",
          padding: "68px 76px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              borderRadius: "999px",
              border: "1px solid rgba(255,255,255,0.35)",
              backgroundColor: "rgba(0,0,0,0.2)",
              padding: "10px 18px",
            }}
          >
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "999px",
                background: brand.brandAccent,
                boxShadow: "0 0 20px rgba(255,255,255,0.7)",
              }}
            />
            <span
              style={{
                color: "rgba(255,255,255,0.95)",
                fontWeight: 700,
                fontSize: "16px",
                letterSpacing: "1.8px",
                textTransform: "uppercase",
                fontFamily: '"Manrope", sans-serif',
              }}
            >
              Official Site
            </span>
          </div>
          <span
            style={{
              color: "rgba(255,255,255,0.82)",
              fontSize: "18px",
              fontFamily: '"Manrope", sans-serif',
            }}
          >
            {brand.siteUrl}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <h1
            style={{
              margin: 0,
              color: "#fff",
              fontWeight: 700,
              fontSize: "74px",
              lineHeight: 1,
              maxWidth: "860px",
              textShadow: "0 14px 38px rgba(0,0,0,0.35)",
            }}
          >
            {brand.siteName}
          </h1>
          <p
            style={{
              margin: 0,
              maxWidth: "860px",
              color: "rgba(255,255,255,0.9)",
              fontSize: "30px",
              lineHeight: 1.25,
              fontFamily: '"Manrope", sans-serif',
            }}
          >
            {brand.defaultDescription}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {brand.keywords.slice(0, 4).map((keyword, index) => (
              <span
                key={`${keyword}-${index}`}
                style={{
                  fontSize: "16px",
                  color: "#fff",
                  borderRadius: "999px",
                  backgroundColor: "rgba(0,0,0,0.25)",
                  border: `1px solid ${brand.brandAccent}`,
                  padding: "8px 14px",
                  fontFamily: '"Manrope", sans-serif',
                }}
              >
                {keyword}
              </span>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 14px",
              borderRadius: "14px",
              border: "1px solid rgba(255,255,255,0.28)",
              backgroundColor: "rgba(0,0,0,0.2)",
            }}
          >
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 700,
                fontSize: "19px",
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
      </div>
    </div>
  );
};
