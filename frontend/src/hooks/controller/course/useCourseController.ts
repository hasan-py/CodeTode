import { zodResolver } from "@hookform/resolvers/zod";
import {
  SCourseCreate,
  ECourseStatus,
  type TCourseCreate,
} from "@packages/definitions";
import { type SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

export function useCourseFormController({ id }: { id?: number }) {
  const courseDataLoading = false;
  const lemonSqueezyData: any[] = [
    {
      id: 1,
      attributes: { name: "test product" },
    },
  ];

  const isPending = false;

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      validityYear: 0,
      status: ECourseStatus.DRAFT,
      lemonSqueezyProductId: "",
      name: "",
      price: 0,
      description: "",
      imageUrl: "",
    },
    resolver: zodResolver(SCourseCreate),
  });

  const onSubmit: SubmitHandler<TCourseCreate> = async (data) => {
    console.log("data", data);
    if (id) {
      await toast.promise(
        new Promise((resolve) => {
          setTimeout(() => {
            resolve(true);
          }, 1000);
        }),
        {
          loading: `Updating course...`,
          success: "Course updated successfully!",
          error: "Failed to update course",
        }
      );
    } else {
      await toast.promise(
        new Promise((resolve) => {
          setTimeout(() => {
            resolve(true);
          }, 1000);
        }),
        {
          loading: `Updating course...`,
          success: "Course updated successfully!",
          error: "Failed to update course",
        }
      );
      reset();
    }
  };

  return {
    control,
    handleSubmit,
    errors,
    isPending,
    courseDataLoading,
    lemonSqueezyData,
    setValue,
    onSubmit,
  };
}
