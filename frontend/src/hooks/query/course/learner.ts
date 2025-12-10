import {
  getLearnerActiveCourses,
  getLearnerBillingSummaryApi,
} from "@/api/endpoints/learner";
import type { ICourseEnrollmentSummary } from "@packages/definitions";
import { useQuery } from "@tanstack/react-query";

export const LEARNER_KEYS = {
  billingSummary: ["billingSummary"] as const,
  activeCourses: ["activeCourses"] as const,
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
  });
}
