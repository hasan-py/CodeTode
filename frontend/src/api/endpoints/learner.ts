import { api } from "..";

export const getLearnerBillingSummaryApi = async () => {
  const res = await api.get("/learner/enrollment/courses");
  return res;
};

export const getLearnerActiveCourses = async () => {
  const res = await api.get("/learner/activity/courses");
  return res;
};
