import type { ApiSuccessResponse } from "@suba-company-template/types/api";

import type { PublicSocial, PublicSocialsParams } from "./socials-schema";

import { LANDING_API_ENDPOINTS } from "@/lib/API_ENDPOINTS";
import apiClient from "@/lib/axios";

export type PublicSocialsResponse = ApiSuccessResponse<PublicSocial[]>;

export const fetchPublicSocials = async (params?: PublicSocialsParams) => {
  const { data } = await apiClient.get<PublicSocialsResponse>(
    LANDING_API_ENDPOINTS.SOCIALS_CLIENT,
    { params },
  );

  return data;
};
