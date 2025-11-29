import {
  archiveLessonApi,
  getLessonApi,
  getLessonContentLinkApi,
  getLessonsApi,
  getMarkdownFileList,
  getSingleMarkdownFile,
  postLessonContentLinkApi,
  postLessonCreateApi,
  postQuizCreateApi,
  putLessonContentLinkApi,
  putLessonPositionsApi,
  putLessonUpdateApi,
  putQuizUpdateApi,
} from "@/api/endpoints/lesson";
import type {
  ILessonFilters,
  ILessonResponse,
  TLessonContentLinkCreate,
  TLessonContentLinkUpdate,
  TLessonCreate,
  TLessonUpdate,
  TQuizCreate,
  TQuizUpdate,
} from "@packages/definitions";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const LESSON_KEYS = {
  all: ["lessons"] as const,
  lists: () => ["lessons", "list"] as const,
  list: (filters?: ILessonFilters) => ["lessons", "list", { filters }] as const,
  details: (id?: number) => ["lessons", "details", id] as const,
  markDownList: () => ["markdownFiles"] as const,
  contentLink: (lessonId?: number) => ["lessonContentLink", lessonId] as const,
};

export function useGetLessonQuery(lessonId?: number) {
  return useQuery({
    queryKey: LESSON_KEYS.details(lessonId),
    queryFn: async () => {
      const response = await getLessonApi(lessonId as number);
      return response.data;
    },
    enabled: !!lessonId,
  });
}

export function useGetLessonsQuery(filters?: ILessonFilters) {
  return useQuery({
    queryKey: LESSON_KEYS.list(filters),
    queryFn: async () => {
      const response = await getLessonsApi({
        status: filters?.status,
        courseId: filters?.courseId,
        moduleId: filters?.moduleId,
        chapterId: filters?.chapterId,
        type: filters?.type,
      });
      return response.data as ILessonResponse;
    },
  });
}

export function useGetLessonsMutation() {
  return useMutation({
    mutationFn: async (filters?: ILessonFilters) => {
      const response = await getLessonsApi({
        status: filters?.status,
        courseId: filters?.courseId,
        moduleId: filters?.moduleId,
        chapterId: filters?.chapterId,
      });
      return response.data as ILessonResponse;
    },
  });
}

export function useCreateLessonMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (lessonData: TLessonCreate) => {
      const response = await postLessonCreateApi(lessonData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LESSON_KEYS.lists() });
    },
  });
}

export function useUpdateLessonMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (lessonData: TLessonUpdate & { id: number }) => {
      const response = await putLessonUpdateApi(lessonData);
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: LESSON_KEYS.details(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: LESSON_KEYS.lists() });
    },
  });
}

export function useArchivedLessonMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (lessonId: number) => {
      const response = await archiveLessonApi(lessonId);
      return response.data;
    },
    onSuccess: (_data, lessonId) => {
      queryClient.removeQueries({ queryKey: LESSON_KEYS.details(lessonId) });
      queryClient.invalidateQueries({ queryKey: LESSON_KEYS.lists() });
    },
  });
}

export function useUpdateLessonPositionsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      courseId: number;
      moduleId: number;
      chapterId: number;
      positions: { id: number; position: number }[];
    }) => {
      const response = await putLessonPositionsApi(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LESSON_KEYS.lists() });
    },
  });
}

export function useGetMarkdownFileListQuery() {
  return useQuery({
    queryKey: LESSON_KEYS.markDownList(),
    queryFn: async () => {
      const response = await getMarkdownFileList();
      return response.data as string[];
    },
  });
}

export function useGetSingleMarkdownFileMutation() {
  return useMutation({
    mutationFn: async (filePath: string) => {
      const response = await getSingleMarkdownFile(filePath);
      return response.data as { content: string };
    },
  });
}

export function useGetLessonContentLinkQuery(id?: number) {
  return useQuery({
    queryKey: LESSON_KEYS.contentLink(id),
    queryFn: async () => {
      const response = await getLessonContentLinkApi(id as number);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateLessonContentLinkMutation(filters: ILessonFilters) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: TLessonContentLinkCreate) => {
      const response = await postLessonContentLinkApi(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: LESSON_KEYS.list(filters),
      });
    },
  });
}

export function useUpdateLessonContentLinkMutation(filters: ILessonFilters) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: TLessonContentLinkUpdate) => {
      const response = await putLessonContentLinkApi(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: LESSON_KEYS.list(filters),
      });
    },
  });
}

export function useCreateQuizMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: TQuizCreate) => {
      const response = await postQuizCreateApi(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LESSON_KEYS.lists() });
    },
  });
}

export function useUpdateQuizMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (lessonData: TQuizUpdate) => {
      const response = await putQuizUpdateApi(lessonData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LESSON_KEYS.lists() });
    },
  });
}
