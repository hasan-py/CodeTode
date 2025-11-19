import { useGetCoursesQuery } from "@/hooks/query/course";
import { useGetChaptersMutation } from "@/hooks/query/course/chapter";
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

  const isLoading = courseDataLoading || modulesLoading || chaptersLoading;

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
    if (selectedCourse) {
      moduleListMutate({ courseId: selectedCourse });
    }
    if (selectedModule) {
      chapterListMutate({ moduleId: selectedModule });
    }
  }, [id, selectedCourse, selectedModule]);

  const onSubmit = async (data: TLessonCreate) => {
    console.log("data", data);
    if (id) {
      await toast.promise(
        new Promise((resolve) => {
          setTimeout(() => {
            resolve(true);
          }, 1000);
        }),
        {
          loading: `Updating lesson...`,
          success: "Lesson updated successfully!",
          error: "Failed to update lesson",
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
          loading: `Creating lesson...`,
          success: "Lesson created successfully!",
          error: "Failed to create lesson",
        }
      );
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
