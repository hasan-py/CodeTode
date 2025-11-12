import { useGetCoursesQuery } from "@/hooks/query/course";
import {
  useCreateChapterMutation,
  useGetChapterQuery,
  useUpdateChapterMutation,
} from "@/hooks/query/course/chapter";
import { useGetModulesMutation } from "@/hooks/query/course/module";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ECourseStatus,
  SChapterCreate,
  type TChapterCreate,
} from "@packages/definitions";

import { useEffect } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

export function useChapterFormController({ id }: { id?: number }) {
  const { data: singleData, isLoading: singleDataLoading } =
    useGetChapterQuery(id);
  const { data: courseListData, isLoading: courseDataLoading } =
    useGetCoursesQuery();

  const {
    data: moduleListData,
    isPending: moduleDataLoading,
    mutateAsync,
    mutate,
  } = useGetModulesMutation();

  const createMutation = useCreateChapterMutation();
  const updateMutation = useUpdateChapterMutation();

  const isLoading = singleDataLoading || courseDataLoading || moduleDataLoading;
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
      moduleId: undefined,
      status: ECourseStatus.DRAFT,
    },
    resolver: zodResolver(SChapterCreate),
  });

  useEffect(() => {
    if (id && singleData) {
      reset({
        name: singleData?.name || "",
        description: singleData?.description || "",
        courseId: singleData?.courseId,
        moduleId: singleData?.moduleId,
        status: singleData?.status || ECourseStatus.DRAFT,
      });
    }
  }, [id, singleData]);

  useEffect(() => {
    if (id && singleData) {
      mutate({ courseId: singleData?.courseId });
    }
  }, [id, singleData, mutate]);

  const fetchModules = async (courseId: number) => {
    if (courseId) {
      await mutateAsync({ courseId });
    }
  };

  const onSubmit: SubmitHandler<TChapterCreate> = async (data) => {
    if (id) {
      await toast.promise(updateMutation.mutateAsync({ ...data, id }), {
        loading: `Updating chapter...`,
        success: "Chapter updated successfully!",
        error: "Failed to update chapter",
      });
    } else {
      await toast.promise(createMutation.mutateAsync(data), {
        loading: `Creating chapter...`,
        success: "Chapter created successfully!",
        error: "Failed to create chapter",
      });
      reset();
    }
  };

  return {
    control,
    handleSubmit,
    errors,
    isPending,
    isLoading,
    setValue,
    onSubmit,
    courseListData,
    moduleListData,
    fetchModules,
  };
}
