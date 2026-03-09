import type { ApiSuccessResponse } from "@suba-company-template/types/api";

import type {
  Achievement,
  AchievementUpdatePayload,
  AchievementsListParams,
  CreateAchievementInput,
  ReorderAchievementsInput,
} from "./achievements-schema";

import { AUTH_API_ENDPOINTS } from "@/lib/API_ENDPOINTS";
import apiClient from "@/lib/axios";

export type AchievementResponse = ApiSuccessResponse<Achievement>;
export type AchievementsListResponse = ApiSuccessResponse<Achievement[]>;
export type DeleteAchievementResponse = ApiSuccessResponse<{ message: string }>;

const buildAchievementFormData = (values: {
  title?: string;
  description?: string;
  position?: number;
  isActive?: boolean;
  imageUrl?: string;
  image?: File;
}) => {
  const formData = new FormData();

  if (values.title !== undefined) formData.append("title", values.title);
  if (values.description !== undefined) {
    formData.append("description", values.description);
  }
  if (values.position !== undefined) {
    formData.append("position", String(values.position));
  }
  if (values.isActive !== undefined) {
    formData.append("isActive", String(values.isActive));
  }
  if (values.imageUrl !== undefined)
    formData.append("imageUrl", values.imageUrl);
  if (values.image) formData.append("image", values.image);

  return formData;
};

export const fetchAchievements = async (params: AchievementsListParams) => {
  const { data } = await apiClient.get<AchievementsListResponse>(
    AUTH_API_ENDPOINTS.ACHIEVEMENTS,
    { params },
  );

  return data;
};

export const fetchAchievementById = async (id: number | string) => {
  const { data } = await apiClient.get<AchievementResponse>(
    `${AUTH_API_ENDPOINTS.ACHIEVEMENTS}/${id}`,
  );

  return data;
};

export const createAchievement = async (values: CreateAchievementInput) => {
  const formData = buildAchievementFormData(values);

  const { data } = await apiClient.post<AchievementResponse>(
    AUTH_API_ENDPOINTS.ACHIEVEMENTS,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );

  return data;
};

export const updateAchievement = async (
  id: number | string,
  values: AchievementUpdatePayload,
) => {
  const formData = buildAchievementFormData(values);

  const { data } = await apiClient.patch<AchievementResponse>(
    `${AUTH_API_ENDPOINTS.ACHIEVEMENTS}/${id}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );

  return data;
};

export const deleteAchievement = async (id: number | string) => {
  const { data } = await apiClient.delete<DeleteAchievementResponse>(
    `${AUTH_API_ENDPOINTS.ACHIEVEMENTS}/${id}`,
  );

  return data;
};

export const reorderAchievements = async (
  payload: ReorderAchievementsInput,
) => {
  const { data } = await apiClient.patch<DeleteAchievementResponse>(
    `${AUTH_API_ENDPOINTS.ACHIEVEMENTS}/reorder`,
    payload,
  );

  return data;
};
