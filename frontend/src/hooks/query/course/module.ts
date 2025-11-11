import {
  archiveModuleApi,
  createModuleApi,
  getModuleApi,
  getModulesApi,
  updateModuleApi,
  updateModulePositionsApi,
} from "@/api/endpoints/module";
import type {
  IModule,
  IModuleFilters,
  IModuleResponse,
  TModuleCreate,
  TModuleUpdate,
  TUpdatePositions,
} from "@packages/definitions";

import { Logger } from "@packages/logger";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const MODULE_KEYS = {
  all: ["modules"] as const,
  lists: () => [...MODULE_KEYS.all, "list"] as const,
  list: (filters?: IModuleFilters) =>
    [...MODULE_KEYS.lists(), { filters }] as const,
  details: () => [...MODULE_KEYS.all, "detail"] as const,
  detail: (id?: number) => [...MODULE_KEYS.details(), id] as const,
};

export function useGetModulesQuery(filters?: IModuleFilters) {
  return useQuery({
    queryKey: MODULE_KEYS.list(filters),
    queryFn: async () => {
      const response = await getModulesApi({
        status: filters?.status,
        courseId: filters?.courseId,
      });
      return response.data as IModuleResponse;
    },
  });
}

export function useGetModulesMutation() {
  return useMutation({
    mutationFn: async (filters?: IModuleFilters) => {
      const response = await getModulesApi({
        status: filters?.status,
        courseId: filters?.courseId,
      });
      return response.data as IModuleResponse;
    },
  });
}

export function useGetModuleQuery(moduleId?: number) {
  return useQuery({
    queryKey: MODULE_KEYS.detail(moduleId),
    queryFn: async () => {
      const response = await getModuleApi(moduleId as number);
      return response.data as IModule;
    },
    enabled: !!moduleId,
  });
}

export function useCreateModuleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (moduleData: TModuleCreate) => {
      const response = await createModuleApi(moduleData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MODULE_KEYS.lists() });
    },
  });
}

export function useUpdateModuleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (moduleData: TModuleUpdate & { id: number }) => {
      const response = await updateModuleApi(moduleData.id, moduleData);
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: MODULE_KEYS.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: MODULE_KEYS.lists() });
    },
  });
}

export function useArchivedModuleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (moduleId: number) => {
      const response = await archiveModuleApi(moduleId);
      return response.data;
    },
    onSuccess: (_data, moduleId) => {
      queryClient.removeQueries({ queryKey: MODULE_KEYS.detail(moduleId) });
      queryClient.invalidateQueries({ queryKey: MODULE_KEYS.lists() });
    },
  });
}

export function useUpdateModulePositionsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TUpdatePositions & { courseId: string }) => {
      const response = await updateModulePositionsApi(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MODULE_KEYS.lists() });
    },
    onError: (error: AxiosError) => {
      Logger.error("Update module positions failed", error);
      throw error;
    },
  });
}
