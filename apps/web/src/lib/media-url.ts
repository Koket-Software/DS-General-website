import { API_BASE_URL } from "@/lib/api-base";

const MEDIA_URL_KEY_PATTERN =
  /(image|icon|logo|headshot|featured|cover).*url$/i;
const MEDIA_STRING_KEYS = new Set(["featuredImage", "image"]);
const MEDIA_ARRAY_KEYS = new Set(["imageUrls"]);
const ABSOLUTE_URL_PATTERN = /^[a-z][a-z\d+\-.]*:\/\//i;

const serverBaseUrl = (API_BASE_URL ?? "").replace(/\/$/, "");

export const resolveMediaUrl = (
  value: string | null | undefined,
): string | null | undefined => {
  if (!value) return value;

  const trimmed = value.trim();
  if (!trimmed) return value;

  if (
    ABSOLUTE_URL_PATTERN.test(trimmed) ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed;
  }

  if (!serverBaseUrl) {
    return trimmed;
  }

  const normalizedPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return `${serverBaseUrl}${normalizedPath}`;
};

const shouldNormalizeStringKey = (key: string) => {
  const normalizedKey = key.trim();
  if (!normalizedKey) return false;

  return (
    MEDIA_STRING_KEYS.has(normalizedKey) ||
    MEDIA_URL_KEY_PATTERN.test(normalizedKey)
  );
};

const shouldNormalizeArrayKey = (key: string) => MEDIA_ARRAY_KEYS.has(key);

export const normalizeMediaUrlsDeep = <T>(input: T): T => {
  if (Array.isArray(input)) {
    return input.map((item) => normalizeMediaUrlsDeep(item)) as T;
  }

  if (!input || typeof input !== "object") {
    return input;
  }

  const output: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
    if (typeof value === "string" && shouldNormalizeStringKey(key)) {
      output[key] = resolveMediaUrl(value) ?? value;
      continue;
    }

    if (Array.isArray(value) && shouldNormalizeArrayKey(key)) {
      output[key] = value.map((item) =>
        typeof item === "string" ? (resolveMediaUrl(item) ?? item) : item,
      );
      continue;
    }

    output[key] = normalizeMediaUrlsDeep(value);
  }

  return output as T;
};
