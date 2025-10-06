import {
  SUpdateUserProfile,
  type TUpdateUserProfile,
} from "@packages/definitions";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Logger } from "@packages/logger";
import toast from "react-hot-toast";

export function useProfileFormController() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TUpdateUserProfile>({
    defaultValues: {
      name: "",
      imageUrl: "",
    },
    resolver: zodResolver(SUpdateUserProfile),
  });

  const onSubmit: SubmitHandler<TUpdateUserProfile> = async (formData) => {
    Logger.info("formData", formData);

    await toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
      loading: `Updating profile...`,
      success: "Profile updated successfully!",
      error: "Failed to update profile",
    });
  };

  return {
    control,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
    user: {
      email: "user@example.com",
      username: "user123",
      name: "User",
      lastLogin: new Date(),
      createdAt: new Date(),
    },
  };
}
