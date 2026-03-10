import { COMPANY } from "@/config/template";
import type { PublicSocial } from "@/lib/socials/socials-schema";

type LandingSocial = Pick<PublicSocial, "id" | "title" | "baseUrl" | "iconUrl">;

const LANDING_SOCIAL_ORDER = [
  "linkedin",
  "instagram",
  "whatsapp",
  "telegram",
  "youtube",
] as const;

const LEGACY_LANDING_SOCIALS = new Set(["x", "twitter", "dribbble"]);

const landingSocialOrderMap = new Map<string, number>(
  LANDING_SOCIAL_ORDER.map((platform, index) => [platform, index]),
);

const normalizePlatform = (title: string) => title.trim().toLowerCase();

export function shouldUseResolvedLandingSocialIcon(title: string) {
  const platform = normalizePlatform(title);

  return LANDING_SOCIAL_ORDER.includes(
    platform as (typeof LANDING_SOCIAL_ORDER)[number],
  );
}

const createFallbackLandingSocials = (): LandingSocial[] => {
  const phoneDigits = COMPANY.phone.replace(/\D/g, "");

  return [
    {
      id: -1,
      title: "WhatsApp",
      baseUrl: `https://wa.me/${phoneDigits}`,
      iconUrl: null,
    },
    {
      id: -2,
      title: "Telegram",
      baseUrl: "https://t.me/dsgeneralplc",
      iconUrl: null,
    },
  ];
};

export function getLandingSocials(socials: LandingSocial[]) {
  const visibleSocials = socials.filter((social) => {
    const platform = normalizePlatform(social.title);
    return !LEGACY_LANDING_SOCIALS.has(platform);
  });

  const seenPlatforms = new Set(
    visibleSocials.map((social) => normalizePlatform(social.title)),
  );

  const fallbackSocials = createFallbackLandingSocials().filter((social) => {
    const platform = normalizePlatform(social.title);
    return !seenPlatforms.has(platform);
  });

  return [...visibleSocials, ...fallbackSocials].sort((left, right) => {
    const leftPlatform = normalizePlatform(left.title);
    const rightPlatform = normalizePlatform(right.title);
    const leftOrder =
      landingSocialOrderMap.get(leftPlatform) ?? Number.MAX_SAFE_INTEGER;
    const rightOrder =
      landingSocialOrderMap.get(rightPlatform) ?? Number.MAX_SAFE_INTEGER;

    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }

    return left.title.localeCompare(right.title);
  });
}
