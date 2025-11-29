import { buildQueryString } from "@/utilities/helper/buildQueryString";
import type {
  ELessonType,
  TLessonContentLinkCreate,
  TLessonContentLinkUpdate,
  TLessonCreate,
  TLessonUpdate,
  TQuizCreate,
  TQuizUpdate,
} from "@packages/definitions";
import { api } from "..";

export const getLessonsApi = async (params: {
  status?: string;
  courseId?: number;
  moduleId?: number;
  chapterId?: number;
  type?: ELessonType;
}) => {
  const query = buildQueryString(params);
  const res = await api.get(`/admin/lesson${query}`);
  return res;
};

export const getLessonApi = async (id: number) => {
  const res = await api.get(`/admin/lesson/${id}`);
  return res;
};

export const postLessonCreateApi = async (data: TLessonCreate) => {
  const res = await api.post(`/admin/lesson`, data);
  return res;
};

export const putLessonUpdateApi = async (data: TLessonUpdate) => {
  const res = await api.put(`/admin/lesson/${data.id}`, data);
  return res;
};

export const putLessonPositionsApi = async ({
  courseId,
  moduleId,
  chapterId,
  positions,
}: {
  courseId: number;
  moduleId: number;
  chapterId: number;
  positions: { id: number; position: number }[];
}) => {
  const res = await api.put(
    `/admin/lesson/positions/${courseId}/${moduleId}/${chapterId}`,
    { positions }
  );
  return res;
};

export const archiveLessonApi = async (id: number) => {
  const res = await api.post(`/admin/lesson/${id}/archive`);
  return res;
};

export const getLessonContentLinkApi = async (id: number) => {
  const res = await api.get(`/admin/lesson/lesson-content-link/${id}`);
  return res;
};

export const postLessonContentLinkApi = async (
  data: TLessonContentLinkCreate
) => {
  const res = await api.post(`/admin/lesson/lesson-content-link`, data);
  return res;
};

export const putLessonContentLinkApi = async (
  data: TLessonContentLinkUpdate
) => {
  const res = await api.put(
    `/admin/lesson/lesson-content-link/${data.id}`,
    data
  );
  return res;
};

export const getMarkdownFileList = async () => {
  const res = await api.get(`/admin/lesson/markdown-list`);
  return res;
};

export const getSingleMarkdownFile = async (path: string) => {
  const res = await api.get(`/admin/lesson/markdown-content?path=${path}`);
  return res;
};

export const postQuizCreateApi = async (data: TQuizCreate) => {
  const res = await api.post(`/admin/lesson/quiz`, data);
  return res;
};

export const putQuizUpdateApi = async (data: TQuizUpdate) => {
  const res = await api.put(`/admin/lesson/quiz/${data.id}`, data);
  return res;
};
