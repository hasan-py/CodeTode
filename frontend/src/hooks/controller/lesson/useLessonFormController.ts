import { useGetCoursesQuery } from "@/hooks/query/course";
import { useGetChaptersMutation } from "@/hooks/query/course/chapter";
import {
  useCreateLessonMutation,
  useGetLessonQuery,
  useUpdateLessonMutation,
} from "@/hooks/query/course/lesson";
import { useGetModulesMutation } from "@/hooks/query/course/module";
import { useDropdownSelectionStore } from "@/stores/dropdownSelectionStore";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ECourseStatus,
  ELessonType,
  SLessonCreate,
  type TLessonCreate,
} from "@packages/definitions";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export function useLessonFormController({ id }: { id?: number }) {
  const {
    selectedCourse,
    selectedModule,
    selectedChapter,
    setSelectedCourse,
    setSelectedModule,
    setSelectedChapter,
  } = useDropdownSelectionStore();

  const { data: courseList, isLoading: courseDataLoading } =
    useGetCoursesQuery();

  const { data: singleLessonData, isLoading: lessonLoading } =
    useGetLessonQuery(id);

  const createLessonMutation = useCreateLessonMutation();
  const updateLessonMutation = useUpdateLessonMutation();

  const {
    data: modulesDataList,
    isPending: modulesLoading,
    mutate: moduleListMutate,
  } = useGetModulesMutation();
  const {
    data: chaptersDataList,
    isPending: chaptersLoading,
    mutate: chapterListMutate,
  } = useGetChaptersMutation();

  const isLoading =
    lessonLoading || courseDataLoading || modulesLoading || chaptersLoading;

  const isPending =
    createLessonMutation.isPending || updateLessonMutation.isPending;

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
      courseId: selectedCourse || undefined,
      moduleId: selectedModule || undefined,
      chapterId: selectedChapter || undefined,
      status: ECourseStatus.DRAFT,
      type: ELessonType.THEORY,
      xpPoints: 5,
    },
    resolver: zodResolver(SLessonCreate),
  });

  useEffect(() => {
    if (id && singleLessonData) {
      moduleListMutate({ courseId: singleLessonData?.courseId });
      chapterListMutate({ moduleId: singleLessonData?.moduleId });
    } else {
      if (selectedCourse) {
        moduleListMutate({ courseId: selectedCourse });
      }
      if (selectedModule) {
        chapterListMutate({ moduleId: selectedModule });
      }
    }
  }, [
    id,
    singleLessonData,
    moduleListMutate,
    chapterListMutate,
    selectedCourse,
    selectedModule,
  ]);

  useEffect(() => {
    if (id && singleLessonData) {
      const lesson = singleLessonData;
      reset({
        name: lesson.name,
        description: lesson.description,
        courseId: lesson.courseId,
        moduleId: lesson.moduleId,
        chapterId: lesson.chapterId,
        status: lesson.status,
        type: lesson.type,
        xpPoints: lesson.xpPoints,
      });
    }
  }, [singleLessonData, id]);

  const onSubmit = async (data: TLessonCreate) => {
    if (id) {
      await toast.promise(updateLessonMutation.mutateAsync({ ...data, id }), {
        loading: `Updating lesson...`,
        success: "Lesson updated successfully!",
        error: "Failed to update lesson",
      });
    } else {
      await toast.promise(createLessonMutation.mutateAsync(data), {
        loading: `Creating lesson...`,
        success: "Lesson created successfully!",
        error: "Failed to create lesson",
      });
      reset({
        courseId: selectedCourse ?? undefined,
        moduleId: selectedModule ?? undefined,
        chapterId: selectedChapter ?? undefined,
      });
    }
  };

  return {
    control,
    handleSubmit,
    errors,
    setValue,
    onSubmit,
    isLoading,
    isPending,
    courseList,
    modulesDataList,
    chaptersDataList,
    setSelectedCourse,
    setSelectedModule,
    setSelectedChapter,
    moduleListMutate,
    chapterListMutate,
    resetForm: () => reset(),
  };
}
