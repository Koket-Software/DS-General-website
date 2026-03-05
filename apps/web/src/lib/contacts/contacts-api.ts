import type { ApiSuccessResponse } from "@suba-company-template/types/api";

import type {
  CreatePublicContactInput,
  PublicContact,
  PublicContactsParams,
} from "./contacts-schema";

import { LANDING_API_ENDPOINTS } from "@/lib/API_ENDPOINTS";
import apiClient from "@/lib/axios";

export type PublicContactsResponse = ApiSuccessResponse<PublicContact[]>;
export type PublicContactResponse = ApiSuccessResponse<PublicContact>;

export const fetchPublicContacts = async (params?: PublicContactsParams) => {
  const { data } = await apiClient.get<PublicContactsResponse>(
    LANDING_API_ENDPOINTS.CONTACT_US_CLIENT,
    { params },
  );

  return data;
};

export const createPublicContact = async (
  payload: CreatePublicContactInput,
) => {
  const { data } = await apiClient.post<PublicContactResponse>(
    LANDING_API_ENDPOINTS.CONTACT_US_CLIENT,
    payload,
  );

  return data;
};
