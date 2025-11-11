import { buildQueryString } from "@/utilities/helper/buildQueryString";
import type {
  IModule,
  TModuleCreate,
  TModuleUpdate,
  TUpdatePositions,
} from "@packages/definitions";
import { api } from "..";

export const getModulesApi = async (params: {
  status?: IModule["status"];
  courseId?: number;
}) => {
  const query = buildQueryString(params);
  return api.get(`/admin/module${query}`);
};

export const getModuleApi = async (id: number) => {
  const res = await api.get(`/admin/module/${id}`);
  return res;
};

export const createModuleApi = async (data: TModuleCreate) => {
  const res = await api.post("/admin/module", data);
  return res;
};

export const updateModuleApi = async (id: number, data: TModuleUpdate) => {
  const res = await api.put(`/admin/module/${id}`, data);
  return res;
};

export const updateModulePositionsApi = async (
  data: TUpdatePositions & { courseId: string }
) => {
  const res = await api.put(`/admin/module/positions/${data.courseId}`, data);
  return res;
};

export const archiveModuleApi = async (id: number) => {
  const res = await api.post(`/admin/module/${id}/archive`);
  return res;
};
