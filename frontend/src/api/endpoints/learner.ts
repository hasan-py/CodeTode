import { api } from "..";

export const getLearnerBillingSummaryApi = async () => {
  const res = await api.get("/learner/enrollment/courses");
  return res;
};

export const getLearnerActiveCourses = async () => {
  const res = await api.get("/learner/activity/courses");
  return res;
};

export const getLearnerModulesApi = async (courseId: number) => {
  const res = await api.get(`/learner/activity/${courseId}/modules`);
  return res;
};

export const getLearnerChaptersApi = async (
  courseId: number,
  moduleId: number
) => {
  const res = await api.get(
    `/learner/activity/${courseId}/modules/${moduleId}/chapters`
  );
  return res;
};
