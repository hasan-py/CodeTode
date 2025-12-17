import {
  getCompletedLessonsApi,
  getLearnerAccessibleLessonApi,
  getLearnerActiveCourses,
  getLearnerBillingSummaryApi,
  getLearnerChaptersApi,
  getLearnerCurrentLessonApi,
  getLearnerModulesApi,
  postLessonCompleteApi,
} from "@/api/endpoints/learner";
import type {
  IChapter,
  ICompletedLesson,
  ICourseEnrollmentSummary,
  ICurrentLesson,
  IModule,
} from "@packages/definitions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PROFILE_KEYS } from "../account/user";

export const LEARNER_KEYS = {
  billingSummary: ["billingSummary"] as const,
  activeCourses: ["activeCourses"] as const,
  modules: (id: number) => ["learner", "modules", id] as const,
  chapters: (courseId: number, moduleId: number) =>
    ["learner", "chapters", courseId, moduleId] as const,
  currentLesson: (courseId: number, moduleId: number, chapterId: number) =>
    ["learner", "currentLesson", courseId, moduleId, chapterId] as const,
  completedLesson: ["completedLesson"] as const,
  accessibleLesson: (lessonId?: string) =>
    ["learner", "accessibleLesson", lessonId] as const,
};

export function useGetLearnerBillingSummaryQuery() {
  return useQuery({
    queryKey: LEARNER_KEYS.billingSummary,
    queryFn: async () => {
      const response = await getLearnerBillingSummaryApi();
      return response.data as ICourseEnrollmentSummary[];
    },
  });
}

export function useGetLearnerActiveCoursesQuery() {
  return useQuery({
    queryKey: LEARNER_KEYS.activeCourses,
    queryFn: async () => {
      const response = await getLearnerActiveCourses();
      return response.data as ICourseEnrollmentSummary[];
    },
    staleTime: 0,
  });
}

export function useGetLearnerModulesQuery(courseId: number) {
  return useQuery({
    queryKey: LEARNER_KEYS.modules(courseId),
    queryFn: async () => {
      const response = await getLearnerModulesApi(courseId);
      return response.data as IModule[];
    },
    enabled: !!courseId,
    staleTime: 0,
  });
}

export function useGetLearnerChapterQuery(courseId: number, moduleId: number) {
  return useQuery({
    queryKey: LEARNER_KEYS.chapters(courseId, moduleId),
    queryFn: async () => {
      const response = await getLearnerChaptersApi(courseId, moduleId);
      return response.data as IChapter[];
    },
    enabled: !!courseId && !!moduleId,
    staleTime: 0,
  });
}

export function useGetLearnerCurrentLessonQuery(
  courseId: number,
  moduleId: number,
  chapterId: number,
  lessonId?: string | undefined
) {
  return useQuery({
    queryKey: LEARNER_KEYS.currentLesson(courseId, moduleId, chapterId),
    queryFn: async () => {
      const response = await getLearnerCurrentLessonApi(
        courseId,
        moduleId,
        chapterId
      );
      return response.data as ICurrentLesson;
    },
    enabled: !lessonId ? true : false,
    staleTime: 0,
  });
}

export function useLessonCompleteMutation({
  courseId,
  moduleId,
  chapterId,
}: {
  courseId: number;
  moduleId: number;
  chapterId: number;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (lessonId: number) => {
      const response = await postLessonCompleteApi(lessonId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: LEARNER_KEYS.currentLesson(courseId, moduleId, chapterId),
      });
      queryClient.invalidateQueries({
        queryKey: LEARNER_KEYS.activeCourses,
      });
      queryClient.invalidateQueries({
        queryKey: LEARNER_KEYS.modules(courseId),
      });
      queryClient.invalidateQueries({
        queryKey: LEARNER_KEYS.chapters(courseId, moduleId),
      });
      queryClient.invalidateQueries({
        queryKey: PROFILE_KEYS.userData,
      });
    },
  });
}

export function useGetCompletedLessonsQuery(chapterId: number) {
  return useQuery({
    queryKey: [...LEARNER_KEYS.completedLesson, chapterId],
    queryFn: async () => {
      const response = await getCompletedLessonsApi(chapterId);
      return response.data as ICompletedLesson;
    },
    staleTime: 0,
    enabled: !!chapterId,
  });
}

export function useGetLearnerAccessibleLessonQuery(lessonId?: string) {
  return useQuery({
    queryKey: LEARNER_KEYS.accessibleLesson(lessonId),
    queryFn: async () => {
      if (!lessonId) return;
      const response = await getLearnerAccessibleLessonApi(+lessonId);
      return response.data as ICurrentLesson;
    },
    enabled: !!lessonId,
    staleTime: 0,
  });
}
