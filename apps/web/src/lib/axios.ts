import axios from "axios";

import { API_BASE_URL } from "@/lib/api-base";
import { normalizeAxiosErrorMessage } from "@/lib/api-error";
import { normalizeMediaUrlsDeep } from "@/lib/media-url";
import { handleRateLimitEncounter } from "@/lib/rate-limit-tracker";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => {
    const requestUrl = response?.config?.url ?? "";

    if (
      typeof requestUrl === "string" &&
      requestUrl.includes("/client") &&
      response?.data
    ) {
      response.data = normalizeMediaUrlsDeep(response.data);
    }

    return response;
  },
  (error) => {
    normalizeAxiosErrorMessage(error);
    const status = error?.response?.status;
    if (status === 429) {
      handleRateLimitEncounter({
        path: error?.config?.url,
        method: error?.config?.method?.toUpperCase(),
        status,
        message: error?.message,
        meta: {
          source: "axios",
          retryAfter: error?.response?.headers?.["retry-after"],
        },
      });
    }
    return Promise.reject(error);
  },
);

export default apiClient;
