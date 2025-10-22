import { useUpdateProfileMutation } from "@/hooks/query/account/user";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  SUpdateUserProfile,
  type TUpdateUserProfile,
} from "@packages/definitions";
import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { useAuthController } from "./useAuthController";

export function useProfileFormController() {
  const { user } = useAuthController();
  const updateProfileMutation = useUpdateProfileMutation();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TUpdateUserProfile>({
    defaultValues: {
      name: "",
      imageUrl: "",
    },
    resolver: zodResolver(SUpdateUserProfile),
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        imageUrl: user.imageUrl || "",
      });
    }
  }, [user]);

  const onSubmit: SubmitHandler<TUpdateUserProfile> = async (formData) => {
    if (!user?.id) return;

    await toast.promise(
      updateProfileMutation.mutateAsync({ ...formData, id: user.id }),
      {
        loading: `Updating profile...`,
        success: "Profile updated successfully!",
        error: "Failed to update profile",
      }
    );
  };

  return {
    control,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
    user,
  };
}
