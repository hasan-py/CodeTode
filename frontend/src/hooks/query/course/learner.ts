import {
  getCompletedLessonsApi,
  getLeaderboardApi,
  getLearnerAccessibleLessonApi,
  getLearnerActiveCourses,
  getLearnerActivityGraphApi,
  getLearnerBillingSummaryApi,
  getLearnerChaptersApi,
  getLearnerCurrentLessonApi,
  getLearnerModulesApi,
  getStatisticsDataApi,
  postLessonCompleteApi,
} from "@/api/endpoints/learner";
import type {
  IActivityGraph,
  IChapter,
  ICompletedLesson,
  ICourseEnrollmentSummary,
  ICurrentLesson,
  IDashboardStatistics,
  ILeaderboard,
  IModule,
} from "@packages/definitions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PROFILE_KEYS } from "../account/user";
import { convertDatesWithTimezoneArray } from "@/utilities/helper/convertDateWithTimezone";

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
  leaderBoard: ["leaderboard"] as const,
  statistics: ["statistics"] as const,
};

export function useGetLearnerBillingSummaryQuery(isAdmin?: boolean) {
  return useQuery({
    queryKey: LEARNER_KEYS.billingSummary,
    queryFn: async () => {
      const response = await getLearnerBillingSummaryApi(isAdmin);
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
      queryClient.invalidateQueries({
        queryKey: [...LEARNER_KEYS.leaderBoard, new Date().getFullYear()],
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

export function useGetLearnerActivityGraphQuery(year?: number) {
  return useQuery({
    queryKey: [...LEARNER_KEYS.leaderBoard, year],
    queryFn: async () => {
      const response = await getLearnerActivityGraphApi(year);
      return convertDatesWithTimezoneArray(response.data) as IActivityGraph[];
    },
    staleTime: 0,
    enabled: !!year,
  });
}

export function useGetStatisticsDataQuery() {
  return useQuery({
    queryKey: [...LEARNER_KEYS.statistics],
    queryFn: async () => {
      const response = await getStatisticsDataApi();
      return response.data as IDashboardStatistics;
    },
  });
}

export function useGetLeaderboardQuery() {
  return useQuery({
    queryKey: [...LEARNER_KEYS.leaderBoard],
    queryFn: async () => {
      const response = await getLeaderboardApi();
      return response.data as ILeaderboard[];
    },
    staleTime: 0,
  });
}
