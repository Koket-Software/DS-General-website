import svgPaths from "../../../../imports/svg-ocmhtzor95";

import dsLogo from "@/assets/ds/ds_logo.svg";
import dsLogoLarge from "@/assets/ds/ds_logo_large.svg";

export function Logo({ size = "sm" }: { size?: "sm" | "lg" }) {
  const src = size === "sm" ? dsLogo : dsLogoLarge;
  const className = size === "sm" ? "h-8 w-8" : "h-10 w-auto";

  return <img src={src} alt="DS General PLC logo" className={className} />;
}

export function CaretDown() {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
      <path d={svgPaths.p3c55300} fill="var(--foreground)" />
    </svg>
  );
}

export function ArrowUpRight({ color = "white" }: { color?: string }) {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
      <path d={svgPaths.p12e71f00} fill={color} />
    </svg>
  );
}

export function ArrowRight({ color = "var(--primary)" }: { color?: string }) {
  return (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path d={svgPaths.p24860100} fill={color} />
    </svg>
  );
}

export function CraneIcon() {
  return (
    <svg width="42" height="42" fill="none" viewBox="0 0 42 42">
      <path d={svgPaths.p2135ce00} fill="var(--foreground)" />
    </svg>
  );
}

export function DesktopIcon() {
  return (
    <svg width="42" height="42" fill="none" viewBox="0 0 42 42">
      <path d={svgPaths.p1e04b8f0} fill="var(--foreground)" />
    </svg>
  );
}

export function OfficeChairIcon() {
  return (
    <svg width="42" height="42" fill="none" viewBox="0 0 42 42">
      <path d={svgPaths.p221ca900} fill="var(--foreground)" />
    </svg>
  );
}

export function MinusIcon() {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
      <path d={svgPaths.p2a87ddc0} fill="var(--foreground)" />
    </svg>
  );
}

export function PlusIcon() {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
      <path d={svgPaths.p9106f00} fill="var(--foreground)" />
    </svg>
  );
}

export function CaretLeft() {
  return (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path d={svgPaths.p204a5580} fill="var(--muted-foreground)" />
    </svg>
  );
}

export function CaretRight() {
  return (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path d={svgPaths.p2c0b8700} fill="var(--foreground)" />
    </svg>
  );
}

export function YoutubeIcon() {
  return (
    <svg width="23" height="16" fill="none" viewBox="0 0 22.7556 16">
      <g clipPath="url(#yt-clip)">
        <path d={svgPaths.p2caba6f1} fill="var(--primary)" />
      </g>
      <defs>
        <clipPath id="yt-clip">
          <rect fill="white" height="16" width="22.7556" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function XIcon() {
  return (
    <svg width="42" height="42" fill="none" viewBox="0 0 42 42">
      <rect fill="var(--primary)" fillOpacity="0.05" height="42" width="42" />
      <path d={svgPaths.p3f2b5f80} fill="var(--primary)" />
    </svg>
  );
}

export function InstagramIcon() {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
      <g clipPath="url(#ig-clip)">
        <path d={svgPaths.p12180a80} fill="var(--primary)" />
      </g>
      <defs>
        <clipPath id="ig-clip">
          <rect fill="white" height="20" width="20" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function LinkedinIcon() {
  return (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path d={svgPaths.p31e05f70} fill="var(--primary)" />
    </svg>
  );
}
