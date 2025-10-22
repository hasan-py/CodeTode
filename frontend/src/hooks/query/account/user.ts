import { getUserProfileApi, putUpdateProfileApi } from "@/api/endpoints/user";
import { authStore } from "@/stores/authStore";
import type { IUser, TUpdateUserProfileWithId } from "@packages/definitions";
import { useMutation, useQuery } from "@tanstack/react-query";

const PROFILE_KEYS = {
  userData: ["userData"] as const,
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
