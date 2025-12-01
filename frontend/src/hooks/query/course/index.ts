import {
  archiveCourseApi,
  createCourseApi,
  getCourseApi,
  getCoursesApi,
  getLsProductsApi,
  getPublishedCourseApi,
  getPublishedCoursesApi,
  updateCourseApi,
  updateCoursesPositionApi,
} from "@/api/endpoints/course";
import {
  ECourseStatus,
  type ICommonFilters,
  type ICourse,
  type ILemonSqueezyProduct,
  type IPaginatedCourseResult,
  type TCourseCreate,
  type TCourseUpdate,
  type TUpdatePositions,
} from "@packages/definitions";
import { Logger } from "@packages/logger";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const COURSE_KEYS = {
  lsProducts: ["lsProducts"] as const,
  courses: (filters?: ICommonFilters) =>
    filters ? (["courses", "list", { filters }] as const) : ["courses", "list"],
  details: (id?: number) => ["course", id] as const,
};

export function useGetPublishedCoursesQuery() {
  return useQuery({
    queryKey: COURSE_KEYS.courses({ status: ECourseStatus.PUBLISHED }),
    queryFn: async () => {
      const response = await getPublishedCoursesApi();
      return response.data as IPaginatedCourseResult;
    },
  });
}

export function useLemonSqueezyProductsQuery() {
  return useQuery({
    queryKey: COURSE_KEYS.lsProducts,
    queryFn: async () => {
      const response = await getLsProductsApi();
      return response.data as ILemonSqueezyProduct[];
    },
  });
}

export function useGetCoursesQuery(filters?: ICommonFilters) {
  return useQuery({
    queryKey: COURSE_KEYS.courses(filters),
    queryFn: async () => {
      const response = await getCoursesApi({ status: filters?.status });
      return response.data as IPaginatedCourseResult;
    },
  });
}

export function useGetCourseQuery(courseId?: number, isPublished = false) {
  return useQuery({
    queryKey: COURSE_KEYS.details(courseId),
    queryFn: async () => {
      const response = isPublished
        ? await getPublishedCourseApi(courseId as number)
        : await getCourseApi(courseId as number);
      return response.data as ICourse;
    },
    enabled: !!courseId,
  });
}

export function useCreateCourseMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (courseData: TCourseCreate) => {
      const response = await createCourseApi(courseData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COURSE_KEYS.courses() });
    },
  });
}

export function useUpdateCourseMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (courseData: TCourseUpdate) => {
      const response = await updateCourseApi(courseData);
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: COURSE_KEYS.details(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: COURSE_KEYS.courses() });
    },
  });
}

export function useArchivedCourseMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (courseId: number) => {
      const response = await archiveCourseApi(courseId);
      return response.data;
    },
    onSuccess: (_data, courseId) => {
      queryClient.removeQueries({ queryKey: COURSE_KEYS.details(courseId) });
      queryClient.invalidateQueries({ queryKey: COURSE_KEYS.courses() });
    },
  });
}

export function useUpdateCoursePositionsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TUpdatePositions) => {
      const response = await updateCoursesPositionApi(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COURSE_KEYS.courses() });
    },
    onError: (error: AxiosError) => {
      Logger.error("Update course positions failed", error);
      throw error;
    },
  });
}
