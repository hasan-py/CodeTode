import {
  getAllActiveLearnerApi,
  getUserProfileApi,
  putUpdateProfileApi,
} from "@/api/endpoints/user";
import { authStore } from "@/stores/authStore";
import { formattedLearnerStats } from "@/utilities/helper/learnerStats";
import type {
  IUser,
  TLearnerStats,
  TUpdateUserProfileWithId,
} from "@packages/definitions";
import { useMutation, useQuery } from "@tanstack/react-query";

export const PROFILE_KEYS = {
  userData: ["userData"] as const,
  learner: ["learner"] as const,
};

export function useGetUserProfileQuery() {
  const accessToken = authStore((state) => state.accessToken);
  const updateUser = authStore((state) => state.updateUser);

  return useQuery({
    queryKey: PROFILE_KEYS.userData,
    queryFn: async () => {
      if (!accessToken) {
        throw new Error("No access token available");
      }
      const response = await getUserProfileApi();
      if (response.data) {
        updateUser(response.data);
      }

      return response.data as IUser;
    },
    enabled: !!accessToken,
    refetchOnWindowFocus: false,
  });
}

export function useUpdateProfileMutation() {
  const updateUser = authStore((state) => state.updateUser);

  return useMutation({
    mutationFn: async (profileData: TUpdateUserProfileWithId) => {
      const response = await putUpdateProfileApi(profileData);
      return response.data;
    },
    onSuccess: (data) => {
      if (data) {
        updateUser(data);
      }
    },
  });
}

export function useGetAllLearnerQuery() {
  return useQuery({
    queryKey: PROFILE_KEYS.learner,
    queryFn: async () => {
      const response = await getAllActiveLearnerApi();
      return formattedLearnerStats(response.data as TLearnerStats[]);
    },
    staleTime: 0,
  });
}
