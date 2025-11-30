import {
  useCreateQuizMutation,
  useGetLessonsQuery,
  useUpdateQuizMutation,
} from "@/hooks/query/course/lesson";
import { useDropdownSelectionStore } from "@/stores/dropdownSelectionStore";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ELessonType,
  SQuizCreate,
  type IQuizOption,
  type TQuizCreate,
} from "@packages/definitions";
import { useCallback } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";

export function useQuizFormController() {
  const { selectedCourse, selectedModule, selectedChapter } =
    useDropdownSelectionStore();

  const { data: lessonsData, isLoading: isLoadingLessons } = useGetLessonsQuery(
    {
      courseId: selectedCourse || undefined,
      moduleId: selectedModule || undefined,
      chapterId: selectedChapter || undefined,
      type: ELessonType.QUIZ,
    }
  );

  const quizCreateMutation = useCreateQuizMutation();
  const quizUpdateMutation = useUpdateQuizMutation();

  const isPending =
    quizCreateMutation.isPending || quizUpdateMutation.isPending;
  const isLoading = isLoadingLessons;

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    reset,
    trigger,
  } = useForm({
    defaultValues: {
      courseId: selectedCourse || 0,
      lessonId: 0,
      question: "",
      explanation: "",
      options: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
    },
    resolver: zodResolver(SQuizCreate),
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "options",
  });

  const addOption = useCallback(async () => {
    append({ text: "", isCorrect: false });
  }, [append]);

  const removeOption = useCallback(
    async (indexToRemove: number) => {
      if (fields.length <= 2) return;
      remove(indexToRemove);
    },
    [fields.length, remove]
  );

  const updateOptionCorrect = useCallback(
    async (index: number) => {
      fields.forEach((_, i) => {
        setValue(`options.${i}.isCorrect`, i === index);
      });
    },
    [setValue, fields]
  );

  const handleReorder = useCallback(
    (
      reorderedItems: Array<{ id: string; text: string; isCorrect: boolean }>
    ) => {
      // Create arrays for comparison
      const currentOrder = fields.map((field) => field.id);
      const newOrder = reorderedItems.map((item) => item.id);

      // Find the item that changed position the most (the dragged item)
      let maxPositionChange = 0;
      let draggedItemId: string | null = null;
      let oldIndex = -1;
      let newIndex = -1;

      for (let i = 0; i < newOrder.length; i++) {
        const itemId = newOrder[i];
        const currentPos = currentOrder.indexOf(itemId);
        const positionChange = Math.abs(currentPos - i);

        if (positionChange > maxPositionChange) {
          maxPositionChange = positionChange;
          draggedItemId = itemId;
          oldIndex = currentPos;
          newIndex = i;
        }
      }

      // If we found a dragged item with significant movement, perform the move
      if (
        draggedItemId &&
        maxPositionChange > 0 &&
        oldIndex !== -1 &&
        newIndex !== -1
      ) {
        move(oldIndex, newIndex);
      }
    },
    [fields, move]
  );

  const onSubmit = useCallback(
    async (data: TQuizCreate) => {
      const selectedLesson = lessonsData?.lessons?.find(
        (lesson) => lesson.id === data.lessonId
      );

      if (selectedLesson?.quizzes?.length) {
        await toast.promise(
          quizUpdateMutation.mutateAsync({
            id: selectedLesson.quizzes[0].id,
            ...data,
            options: (data?.options as IQuizOption[])?.map((item, key) => ({
              ...item,
              position: key + 1,
            })),
          }),
          {
            loading: `Updating quiz...`,
            success: "Quiz updated successfully!",
            error: "Failed to update quiz",
          }
        );
      } else {
        await toast.promise(
          quizCreateMutation.mutateAsync({
            ...data,
            options: data?.options?.map((item, key) => ({
              ...item,
              position: key + 1,
            })),
          }),
          {
            loading: `Creating quiz...`,
            success: "Quiz created successfully!",
            error: "Failed to create quiz",
          }
        );
        reset();
      }
    },
    [lessonsData?.lessons]
  );

  return {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    reset,
    trigger,
    isPending,
    isLoading,
    fields,
    append,
    remove,
    addOption,
    removeOption,
    updateOptionCorrect,
    handleReorder,
    onSubmit,
    lessonsData,
  };
}
