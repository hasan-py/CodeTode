import { useGetCoursesQuery } from "@/hooks/query/course";
import { zodResolver } from "@hookform/resolvers/zod";
import { ECourseStatus } from "@packages/definitions";
import { SModuleCreate, type TModuleCreateSchema } from "@packages/definitions";
import { type SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

export function useModuleFormController({ id }: { id?: number }) {
  const { data: CourseList, isLoading } = useGetCoursesQuery({
    status: ECourseStatus.PUBLISHED,
  });
  const listDataLoading = isLoading;
  const isPending = false;

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      courseId: undefined,
      iconName: "",
      status: ECourseStatus.DRAFT,
    },
    resolver: zodResolver(SModuleCreate),
  });

  const onSubmit: SubmitHandler<TModuleCreateSchema> = async (data) => {
    console.log("data", data);
    if (id) {
      await toast.promise(
        new Promise((resolve) => {
          resolve(true);
        }),
        {
          loading: `Updating module...`,
          success: "Module updated successfully!",
          error: "Failed to update module",
        }
      );
    } else {
      await toast.promise(
        new Promise((resolve) => {
          resolve(true);
        }),
        {
          loading: `Creating module...`,
          success: "Module created successfully!",
          error: "Failed to create module",
        }
      );
      reset();
    }
  };

  return {
    CourseList,
    listDataLoading,
    isPending,
    control,
    handleSubmit,
    setValue,
    onSubmit,
    errors,
  };
}
