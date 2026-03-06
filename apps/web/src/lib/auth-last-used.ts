export type LastUsedAuthMethod = "email" | "google";

const LAST_USED_AUTH_METHOD_STORAGE_KEY = "ds-general:last-used-auth-method";

export const getLastUsedAuthMethod = (): LastUsedAuthMethod | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const value = window.localStorage.getItem(LAST_USED_AUTH_METHOD_STORAGE_KEY);
  return value === "email" || value === "google" ? value : null;
};

export const setLastUsedAuthMethod = (method: LastUsedAuthMethod): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(LAST_USED_AUTH_METHOD_STORAGE_KEY, method);
};
