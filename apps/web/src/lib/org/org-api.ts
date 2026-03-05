import type { ApiSuccessResponse } from "@suba-company-template/types/api";

import type { PublicOrgMember, PublicOrgParams } from "./org-schema";

import { LANDING_API_ENDPOINTS } from "@/lib/API_ENDPOINTS";
import apiClient from "@/lib/axios";

export type PublicOrgResponse = ApiSuccessResponse<PublicOrgMember[]>;

export const fetchPublicOrg = async (params?: PublicOrgParams) => {
  const { data } = await apiClient.get<PublicOrgResponse>(
    LANDING_API_ENDPOINTS.ORG_CLIENT,
    { params },
  );

  return data;
};
