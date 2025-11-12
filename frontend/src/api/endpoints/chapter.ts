import { buildQueryString } from "@/utilities/helper/buildQueryString";
import type {
  IChapter,
  TChapterCreate,
  TChapterUpdate,
  TUpdatePositions,
} from "@packages/definitions";
import { api } from "..";

export const getChaptersApi = async (params: {
  status?: IChapter["status"];
  courseId?: number;
  moduleId?: number;
}) => {
  const query = buildQueryString(params);
  return api.get(`/admin/chapter${query}`);
};

export const getChapterApi = async (id: number) => {
  const res = await api.get(`/admin/chapter/${id}`);
  return res;
};

export const createChapterApi = async (data: TChapterCreate) => {
  const res = await api.post("/admin/chapter", data);
  return res;
};

export const updateChapterApi = async (id: number, data: TChapterUpdate) => {
  const res = await api.put(`/admin/chapter/${id}`, data);
  return res;
};

export const updateChapterPositionsApi = async (
  data: TUpdatePositions & { courseId: string; moduleId?: string }
) => {
  const res = await api.put(
    `/admin/chapter/positions/${data.courseId}/${data.moduleId}`,
    data
  );
  return res;
};

export const archiveChapterApi = async (id: number) => {
  const res = await api.post(`/admin/chapter/${id}/archive`);
  return res;
};
