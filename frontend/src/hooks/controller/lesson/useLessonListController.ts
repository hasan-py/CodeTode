import { useGetCoursesQuery } from "@/hooks/query/course";
import { useGetChaptersMutation } from "@/hooks/query/course/chapter";
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

  const [lessons, setLessons] = useState<ILesson[]>(lessonData);
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

  const isLoading = false;
  const isPending = false;

  const saveChanges = async () => {
    if (!selectedCourse || !selectedModule || !selectedChapter) return;

    const positions = lessons.map(({ id, position }) => ({
      id,
      position,
    }));

    await toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(positions);
        }, 1000);
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
    await toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(lesson);
        }, 1000);
      }),
      {
        loading: "Archiving lesson...",
        success: "Lesson archived successfully!",
        error: "Failed to archive lesson",
      }
    );
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

const lessonData: ILesson[] = [
  {
    id: 2,
    name: "Advanced TypeScript",
    description: "Dive deeper into advanced TypeScript features.",
    courseId: 101,
    moduleId: 202,
    chapterId: 302,
    status: ECourseStatus.PUBLISHED,
    position: 2,
    xpPoints: 100,
    type: ELessonType.THEORY,
    createdAt: "2025-09-10T11:00:00Z",
    updatedAt: "2025-09-10T11:00:00Z",
    contentLinks: [],
    quizzes: [],
    isLocked: false,
    isCompleted: true,
  },
  {
    id: 3,
    name: "TypeScript in Practice",
    description: "Apply TypeScript in real-world projects.",
    courseId: 101,
    moduleId: 203,
    chapterId: 303,
    status: ECourseStatus.PUBLISHED,
    position: 3,
    xpPoints: 150,
    type: ELessonType.CODING,
    createdAt: "2025-09-10T12:00:00Z",
    updatedAt: "2025-09-10T12:00:00Z",
    contentLinks: [],
    quizzes: [],
    isLocked: true,
    isCompleted: false,
  },
];
