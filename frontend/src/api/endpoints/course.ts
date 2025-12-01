import type {
  ICourse,
  TCourseCreate,
  TCourseUpdate,
  TUpdatePositions,
} from "@packages/definitions";
import { api } from "..";
import { buildQueryString } from "@/utilities/helper/buildQueryString";

export const getPublishedCoursesApi = async () => {
  return api.get(`/course/published`);
};

export const getPublishedCourseApi = async (id: number) => {
  const res = await api.get(`/course/${id}`);
  return res;
};

export const getLsProductsApi = async () => {
  const res = await api.get(`/admin/products/?page=1&limit=100`);
  return res;
};

export const getCoursesApi = async (params: { status?: ICourse["status"] }) => {
  const query = buildQueryString(params);
  return api.get(`/admin/course${query}`);
};

export const getCourseApi = async (id: number) => {
  const res = await api.get(`/admin/course/${id}`);
  return res;
};

export const createCourseApi = async (data: TCourseCreate) => {
  const res = await api.post("/admin/course", data);
  return res;
};

export const updateCourseApi = async (data: TCourseUpdate) => {
  const res = await api.put(`/admin/course/${data?.id}`, data);
  return res;
};

export const archiveCourseApi = async (id: number) => {
  const res = await api.post(`/admin/course/${id}/archive`);
  return res;
};

export const updateCoursesPositionApi = async (data: TUpdatePositions) => {
  const res = await api.put(`/admin/course/positions`, data);
  return res;
};
