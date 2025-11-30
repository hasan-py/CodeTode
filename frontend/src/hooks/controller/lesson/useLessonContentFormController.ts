import {
  useCreateLessonContentLinkMutation,
  useGetLessonsQuery,
  useGetMarkdownFileListQuery,
  useGetSingleMarkdownFileMutation,
  useUpdateLessonContentLinkMutation,
} from "@/hooks/query/course/lesson";
import { useDropdownSelectionStore } from "@/stores/dropdownSelectionStore";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ECourseStatus,
  ELessonContentLinkType,
  ELessonType,
  SLessonContentLinkCreate,
  type TLessonContentLinkCreate,
} from "@packages/definitions";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export function useLessonContentFormController() {
  const [markdownContent, setMarkdownContent] = useState("");
  const { selectedCourse, selectedModule, selectedChapter } =
    useDropdownSelectionStore();

  const { data: lessonsData, isLoading: lessonsLoading } = useGetLessonsQuery({
    status: ECourseStatus.DRAFT,
    courseId: selectedCourse || undefined,
    moduleId: selectedModule || undefined,
    chapterId: selectedChapter || undefined,
  });
  const { data: markDownFileList } = useGetMarkdownFileListQuery();
  const { mutate: getSingleMarkdownFile } = useGetSingleMarkdownFileMutation();

  const createLessonContentMutation = useCreateLessonContentLinkMutation({
    courseId: selectedCourse || undefined,
    moduleId: selectedModule || undefined,
    chapterId: selectedChapter || undefined,
  });
  const updateLessonContentMutation = useUpdateLessonContentLinkMutation({
    courseId: selectedCourse || undefined,
    moduleId: selectedModule || undefined,
    chapterId: selectedChapter || undefined,
  });

  const isLoading = lessonsLoading;
  const isPending =
    createLessonContentMutation.isPending ||
    updateLessonContentMutation.isPending;

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    reset,
  } = useForm({
    defaultValues: {
      lessonId: undefined,
      url: "",
      linkType: ELessonContentLinkType.MARKDOWN,
      title: "",
    },
    resolver: zodResolver(SLessonContentLinkCreate),
  });

  const handleMarkdownFileChange = (path: string) => {
    getSingleMarkdownFile(path, {
      onSuccess: (data) => {
        setMarkdownContent(data.content);
      },
    });
  };

  const onSubmit = async (data: TLessonContentLinkCreate) => {
    const id = lessonsData?.lessons?.find(
      (lesson) => lesson.id === data.lessonId
    )?.contentLinks?.[0]?.id;

    if (id) {
      await toast.promise(
        updateLessonContentMutation.mutateAsync({ ...data, id }),
        {
          loading: `Updating lesson content...`,
          success: "Lesson content updated successfully!",
          error: "Failed to update lesson content",
        }
      );
    } else {
      await toast.promise(createLessonContentMutation.mutateAsync(data), {
        loading: `Creating lesson content...`,
        success: "Lesson content created successfully!",
        error: "Failed to create lesson content",
      });
      reset();
      setMarkdownContent("");
    }
  };

  return {
    control,
    handleSubmit,
    errors,
    setValue,
    getValues,
    reset,
    markdownContent,
    setMarkdownContent,
    isLoading,
    isPending,
    markDownFileList,
    handleMarkdownFileChange,
    onSubmit,
    lessonsData: {
      ...lessonsData,
      lessons:
        lessonsData?.lessons?.filter(
          (item) => item?.type !== ELessonType.QUIZ
        ) || [],
    },
  };
}
