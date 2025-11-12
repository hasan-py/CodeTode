import {
  archiveChapterApi,
  createChapterApi,
  getChapterApi,
  getChaptersApi,
  updateChapterApi,
  updateChapterPositionsApi,
} from "@/api/endpoints/chapter";
import type {
  IChapter,
  IChapterFilters,
  IChapterResponse,
  TChapterCreate,
  TChapterUpdate,
  TUpdatePositions,
} from "@packages/definitions";

import { Logger } from "@packages/logger";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const CHAPTER_KEYS = {
  all: ["chapters"] as const,
  lists: () => [...CHAPTER_KEYS.all, "list"] as const,
  list: (filters?: IChapterFilters) =>
    [...CHAPTER_KEYS.lists(), { filters }] as const,
  details: () => [...CHAPTER_KEYS.all, "detail"] as const,
  detail: (id?: number) => [...CHAPTER_KEYS.details(), id] as const,
};

export function useGetChaptersQuery(filters?: IChapterFilters) {
  return useQuery({
    queryKey: CHAPTER_KEYS.list(filters),
    queryFn: async () => {
      const response = await getChaptersApi({
        status: filters?.status,
        courseId: filters?.courseId,
        moduleId: filters?.moduleId,
      });
      return response.data as IChapterResponse;
    },
  });
}

export function useGetChaptersMutation() {
  return useMutation({
    mutationFn: async (filters?: IChapterFilters) => {
      const response = await getChaptersApi({
        status: filters?.status,
        courseId: filters?.courseId,
        moduleId: filters?.moduleId,
      });
      return response.data as IChapterResponse;
    },
  });
}

export function useGetChapterQuery(chapterId?: number) {
  return useQuery({
    queryKey: CHAPTER_KEYS.detail(chapterId),
    queryFn: async () => {
      const response = await getChapterApi(chapterId as number);
      return response.data as IChapter;
    },
    enabled: !!chapterId,
  });
}

export function useCreateChapterMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (chapterData: TChapterCreate) => {
      const response = await createChapterApi(chapterData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHAPTER_KEYS.lists() });
    },
  });
}

export function useUpdateChapterMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (chapterData: TChapterUpdate & { id: number }) => {
      const response = await updateChapterApi(chapterData.id, chapterData);
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: CHAPTER_KEYS.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: CHAPTER_KEYS.lists() });
    },
  });
}

export function useArchivedChapterMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (chapterId: number) => {
      const response = await archiveChapterApi(chapterId);
      return response.data;
    },
    onSuccess: (_data, chapterId) => {
      queryClient.removeQueries({ queryKey: CHAPTER_KEYS.detail(chapterId) });
      queryClient.invalidateQueries({ queryKey: CHAPTER_KEYS.lists() });
    },
  });
}

export function useUpdateChapterPositionsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: TUpdatePositions & { courseId: string; moduleId: string }
    ) => {
      const response = await updateChapterPositionsApi(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHAPTER_KEYS.lists() });
    },
    onError: (error: AxiosError) => {
      Logger.error("Update chapter positions failed", error);
      throw error;
    },
  });
}
