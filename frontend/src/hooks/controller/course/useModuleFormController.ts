import { useGetCoursesQuery } from "@/hooks/query/course";
import {
  useCreateModuleMutation,
  useGetModuleQuery,
  useUpdateModuleMutation,
} from "@/hooks/query/course/module";
import { zodResolver } from "@hookform/resolvers/zod";
import { ECourseStatus } from "@packages/definitions";
import { SModuleCreate, type TModuleCreate } from "@packages/definitions";
import { useEffect } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

export function useModuleFormController({ id }: { id?: number }) {
  const { data: CourseList, isLoading: courseListLoading } = useGetCoursesQuery(
    {
      status: ECourseStatus.PUBLISHED,
    }
  );
  const { data: moduleData, isLoading: moduleLoading } = useGetModuleQuery(id);
  const createMutation = useCreateModuleMutation();
  const updateMutation = useUpdateModuleMutation();

  const isLoading = courseListLoading || moduleLoading;
  const isPending = createMutation.isPending || updateMutation.isPending;
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

  useEffect(() => {
    if (id && moduleData) {
      reset({
        name: moduleData.name,
        description: moduleData.description,
        courseId: moduleData.courseId,
        iconName: moduleData.iconName,
        status: moduleData.status,
      });
    }
  }, [id, moduleData]);

  const onSubmit: SubmitHandler<TModuleCreate> = async (data) => {
    if (id) {
      await toast.promise(updateMutation.mutateAsync({ ...data, id }), {
        loading: `Updating module...`,
        success: "Module updated successfully!",
        error: "Failed to update module",
      });
    } else {
      await toast.promise(createMutation.mutateAsync(data), {
        loading: `Creating module...`,
        success: "Module created successfully!",
        error: "Failed to create module",
      });
      reset();
    }
  };

  return {
    CourseList,
    isLoading,
    isPending,
    control,
    handleSubmit,
    setValue,
    onSubmit,
    errors,
  };
}
