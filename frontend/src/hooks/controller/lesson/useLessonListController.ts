import { useGetCoursesQuery } from "@/hooks/query/course";
import { useGetChaptersMutation } from "@/hooks/query/course/chapter";
import {
  useArchivedLessonMutation,
  useGetLessonsQuery,
  useUpdateLessonPositionsMutation,
} from "@/hooks/query/course/lesson";
import { useGetModulesMutation } from "@/hooks/query/course/module";
import { useDropdownSelectionStore } from "@/stores/dropdownSelectionStore";
import {
  ECourseStatus,
  ELessonType,
  type ILesson,
} from "@packages/definitions";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export function useLessonListController() {
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [archivedModalOpen, setArchivedModalOpen] = useState(0);
  const [lessons, setLessons] = useState<ILesson[]>([]);
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

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

  const { data: lessonsData, isLoading: isLessonsLoading } = useGetLessonsQuery(
    {
      status: statusFilter as ECourseStatus,
      courseId: selectedCourse || undefined,
      moduleId: selectedModule || undefined,
      chapterId: selectedChapter || undefined,
      type: typeFilter as ELessonType,
    }
  );

  const { mutateAsync: archiveLessonMutate } = useArchivedLessonMutation();
  const { mutateAsync: updateLessonPositionsMutate, isPending: isUpdating } =
    useUpdateLessonPositionsMutation();

  const isLoading = isLessonsLoading || courseDataLoading;
  const isPending = modulesLoading || chaptersLoading || isUpdating;

  useEffect(() => {
    if (lessonsData) {
      setLessons(lessonsData?.lessons);
    }
  }, [lessonsData]);

  useEffect(() => {
    if (selectedCourse) {
      moduleListMutate({ courseId: selectedCourse });
    }

    if (selectedModule && selectedCourse) {
      chapterListMutate({ moduleId: selectedModule, courseId: selectedCourse });
    }
  }, [selectedCourse, selectedModule]);

  useEffect(() => {
    if (searchQuery) {
      const filteredLessons = lessonsData?.lessons?.filter((lesson) =>
        lesson.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setLessons(filteredLessons || []);
    } else {
      setLessons(lessonsData?.lessons || []);
    }
  }, [searchQuery, lessonsData?.lessons]);

  const saveChanges = async () => {
    if (!selectedCourse || !selectedModule || !selectedChapter) return;

    const positions = lessons.map(({ id, position }) => ({
      id,
      position,
    }));

    await toast.promise(
      updateLessonPositionsMutate({
        courseId: selectedCourse,
        moduleId: selectedModule,
        chapterId: selectedChapter,
        positions,
      }),
      {
        loading: "Saving lesson positions...",
        success: "Lesson positions saved successfully!",
        error: "Failed to save lesson positions",
      }
    );

    setIsReorderMode(false);
  };

  const cancelChanges = () => {
    setIsReorderMode(false);
  };

  const toggleReorderMode = async () => {
    if (isReorderMode) {
      await saveChanges();
    } else {
      setIsReorderMode(true);
    }
  };

  useEffect(() => {
    if (selectedCourse) {
      moduleListMutate({ courseId: selectedCourse });
    }

    if (selectedModule) {
      chapterListMutate({ moduleId: selectedModule });
    }
  }, [selectedCourse, selectedModule]);

  const handleReorder = (newList: ILesson[]) => {
    const chaptersWithUpdatedOrder: ILesson[] = newList.map(
      (chapter, index) => ({
        ...chapter,
        position: index + 1,
      })
    );
    setLessons(chaptersWithUpdatedOrder);
  };

  const confirmArchivedOperation = async (lesson: number) => {
    await toast.promise(archiveLessonMutate(lesson), {
      loading: "Archiving lesson...",
      success: "Lesson archived successfully!",
      error: "Failed to archive lesson",
    });
    setArchivedModalOpen(0);
  };

  const cancelArchivedOperationModal = () => {
    setArchivedModalOpen(0);
  };

  return {
    courseList,
    courseDataLoading,
    modulesDataList,
    modulesLoading,
    chaptersDataList,
    chaptersLoading,
    lessons,
    isLoading,
    archivedModalOpen,
    setArchivedModalOpen,
    moduleListMutate,
    chapterListMutate,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    handleReorder,
    confirmArchivedOperation,
    cancelArchivedOperationModal,
    selectedCourse,
    selectedModule,
    selectedChapter,
    setSelectedCourse,
    setSelectedModule,
    setSelectedChapter,
    isReorderMode,
    cancelChanges,
    isPending,
    toggleReorderMode,
    searchQuery,
    setSearchQuery,
  };
}
