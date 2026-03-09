import type { ApiSuccessResponse } from "@suba-company-template/types/api";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";

import {
  createAchievement,
  deleteAchievement,
  fetchAchievementById,
  fetchAchievements,
  reorderAchievements,
  updateAchievement,
  type DeleteAchievementResponse,
} from "./achievements-api";
import {
  normalizeAchievementsListParams,
  type Achievement,
  type AchievementUpdatePayload,
  type AchievementsListParams,
  type CreateAchievementInput,
  type ReorderAchievementsInput,
} from "./achievements-schema";

import { AUTH_API_ENDPOINTS } from "@/lib/API_ENDPOINTS";

export const achievementKeys = {
  all: [AUTH_API_ENDPOINTS.ACHIEVEMENTS] as const,
  list: (params: AchievementsListParams) =>
    [AUTH_API_ENDPOINTS.ACHIEVEMENTS, params] as const,
  detail: (id: number | string) =>
    [`${AUTH_API_ENDPOINTS.ACHIEVEMENTS}/${id}`] as const,
};

export const useAchievementsQuery = (
  params?: Partial<AchievementsListParams>,
  options?: Omit<
    UseQueryOptions<ApiSuccessResponse<Achievement[]>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const normalizedParams = normalizeAchievementsListParams(params ?? {});

  return useQuery<ApiSuccessResponse<Achievement[]>, Error>({
    queryKey: achievementKeys.list(normalizedParams),
    queryFn: () => fetchAchievements(normalizedParams),
    ...options,
  });
};

export const useAchievementByIdQuery = (
  id: number | string,
  options?: Omit<
    UseQueryOptions<ApiSuccessResponse<Achievement>, Error>,
    "queryKey" | "queryFn"
  >,
) =>
  useQuery<ApiSuccessResponse<Achievement>, Error>({
    queryKey: achievementKeys.detail(id),
    queryFn: () => fetchAchievementById(id),
    enabled: Boolean(id),
    ...options,
  });

type CreateMutationOptions = Omit<
  UseMutationOptions<
    ApiSuccessResponse<Achievement>,
    Error,
    CreateAchievementInput
  >,
  "mutationFn"
>;

export const useCreateAchievementMutation = (
  options?: CreateMutationOptions,
) => {
  const queryClient = useQueryClient();
  const { onSuccess, onError, ...rest } = options || {};

  return useMutation<
    ApiSuccessResponse<Achievement>,
    Error,
    CreateAchievementInput
  >({
    mutationFn: createAchievement,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: achievementKeys.all });
      onSuccess?.(...args);
    },
    onError,
    ...rest,
  });
};

type UpdateVariables = {
  id: number | string;
  payload: AchievementUpdatePayload;
};
type UpdateMutationOptions = Omit<
  UseMutationOptions<ApiSuccessResponse<Achievement>, Error, UpdateVariables>,
  "mutationFn"
>;

export const useUpdateAchievementMutation = (
  options?: UpdateMutationOptions,
) => {
  const queryClient = useQueryClient();
  const { onSuccess, onError, ...rest } = options || {};

  return useMutation<ApiSuccessResponse<Achievement>, Error, UpdateVariables>({
    mutationFn: ({ id, payload }) => updateAchievement(id, payload),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: achievementKeys.all });
      onSuccess?.(...args);
    },
    onError,
    ...rest,
  });
};

type DeleteMutationOptions = Omit<
  UseMutationOptions<DeleteAchievementResponse, Error, number | string>,
  "mutationFn"
>;

export const useDeleteAchievementMutation = (
  options?: DeleteMutationOptions,
) => {
  const queryClient = useQueryClient();
  const { onSuccess, onError, ...rest } = options || {};

  return useMutation<DeleteAchievementResponse, Error, number | string>({
    mutationFn: deleteAchievement,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: achievementKeys.all });
      onSuccess?.(...args);
    },
    onError,
    ...rest,
  });
};

type ReorderMutationOptions = Omit<
  UseMutationOptions<
    DeleteAchievementResponse,
    Error,
    ReorderAchievementsInput
  >,
  "mutationFn"
>;

export const useReorderAchievementsMutation = (
  options?: ReorderMutationOptions,
) => {
  const queryClient = useQueryClient();
  const { onSuccess, onError, ...rest } = options || {};

  return useMutation<
    DeleteAchievementResponse,
    Error,
    ReorderAchievementsInput
  >({
    mutationFn: reorderAchievements,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: achievementKeys.all });
      onSuccess?.(...args);
    },
    onError,
    ...rest,
  });
};
