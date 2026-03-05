import type { ApiSuccessResponse } from "@suba-company-template/types/api";

import type { ClientPartner } from "./partners-schema";

import { LANDING_API_ENDPOINTS } from "@/lib/API_ENDPOINTS";
import apiClient from "@/lib/axios";

export type ClientPartnersListResponse = ApiSuccessResponse<ClientPartner[]>;

/**
 * Fetches partners from the public client endpoint.
 * Returns partners with logos for the landing page slider.
 */
export const fetchClientPartners = async () => {
  const { data } = await apiClient.get<ClientPartnersListResponse>(
    LANDING_API_ENDPOINTS.PARTNERS_CLIENT,
  );

  return data;
};
