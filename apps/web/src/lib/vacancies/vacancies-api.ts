import type { ApiSuccessResponse } from "@suba-company-template/types/api";

import type {
  CreatePublicVacancyApplicationInput,
  PublicVacanciesParams,
  PublicVacancy,
} from "./vacancies-schema";

import { LANDING_API_ENDPOINTS } from "@/lib/API_ENDPOINTS";
import apiClient from "@/lib/axios";

export type PublicVacanciesResponse = ApiSuccessResponse<PublicVacancy[]>;
export type PublicVacancyResponse = ApiSuccessResponse<PublicVacancy>;
export type PublicVacancyApplicationResponse = ApiSuccessResponse<{
  id: number;
  status: string;
  createdAt: string;
}>;

export const fetchPublicVacancies = async (params?: PublicVacanciesParams) => {
  const { data } = await apiClient.get<PublicVacanciesResponse>(
    LANDING_API_ENDPOINTS.VACANCIES_CLIENT,
    { params },
  );

  return data;
};

export const fetchPublicVacancyBySlug = async (slug: string) => {
  const { data } = await apiClient.get<PublicVacancyResponse>(
    `${LANDING_API_ENDPOINTS.VACANCIES_CLIENT}/slug/${slug}`,
  );

  return data;
};

const toVacancyApplicationFormData = (
  payload: CreatePublicVacancyApplicationInput,
) => {
  const formData = new FormData();

  formData.append("fullName", payload.fullName);
  formData.append("email", payload.email);

  if (payload.phone) {
    formData.append("phone", payload.phone);
  }

  if (payload.resume) {
    formData.append("resume", payload.resume);
  }

  if (payload.portfolioUrl) {
    formData.append("portfolioUrl", payload.portfolioUrl);
  }

  if (payload.linkedinUrl) {
    formData.append("linkedinUrl", payload.linkedinUrl);
  }

  if (payload.coverLetter) {
    formData.append("coverLetter", payload.coverLetter);
  }

  // Honeypot is intentionally empty for real users.
  formData.append("honeypot", "");

  return formData;
};

export const submitPublicVacancyApplication = async (
  vacancyId: number | string,
  payload: CreatePublicVacancyApplicationInput,
) => {
  const { data } = await apiClient.post<PublicVacancyApplicationResponse>(
    `${LANDING_API_ENDPOINTS.VACANCIES_CLIENT}/${vacancyId}/applications`,
    toVacancyApplicationFormData(payload),
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return data;
};
