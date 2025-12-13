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

export const getLearnerCurrentLessonApi = async (
  courseId: number,
  moduleId: number,
  chapterId: number
) => {
  const res = await api.get(
    `/learner/activity/${courseId}/modules/${moduleId}/chapters/${chapterId}/current-lesson`
  );
  return res;
};

export const postLessonCompleteApi = async (lessonId: number) => {
  const res = await api.post(`/learner/activity/complete-lesson/${lessonId}`);
  return res;
};

export const getCompletedLessonsApi = async (chapterId: number) => {
  const res = await api.get(`/learner/activity/completed-lessons/${chapterId}`);
  return res;
};
