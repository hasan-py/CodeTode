import { useGetCoursesQuery } from "@/hooks/query/course";
import {
  useArchivedChapterMutation,
  useGetChaptersQuery,
  useUpdateChapterPositionsMutation,
} from "@/hooks/query/course/chapter";
import { useGetModulesMutation } from "@/hooks/query/course/module";
import { ECourseStatus, type IChapter } from "@packages/definitions";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export function useChapterListController() {
  const [archivedModalOpen, setArchivedModalOpen] = useState<number>(0);
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [chapters, setChapters] = useState<IChapter[]>([]);
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: CourseList, isLoading: isLoadingCourses } = useGetCoursesQuery({
    status: ECourseStatus.PUBLISHED,
  });
  const {
    data: moduleListData,
    isPending: moduleDataLoading,
    mutateAsync,
    mutate,
  } = useGetModulesMutation();

  const updatePositionsMutation = useUpdateChapterPositionsMutation();
  const archivedChapterMutation = useArchivedChapterMutation();

  const { data, isLoading } = useGetChaptersQuery({
    status: statusFilter as ECourseStatus,
    courseId: selectedCourse || undefined,
    moduleId: selectedModule || undefined,
  });

  useEffect(() => {
    if (data?.chapters) {
      setChapters(data.chapters);
    }
  }, [data?.chapters]);

  const handleReorder = (newList: IChapter[]) => {
    const reorderedChapters = newList.map((chapter, index) => ({
      ...chapter,
      position: index + 1,
    }));

    setChapters(reorderedChapters);
  };

  const fetchModules = async (courseId: number) => {
    if (courseId) {
      await mutateAsync({ courseId });
    }
  };

  const saveChanges = async () => {
    const positions = chapters.map(({ id, position }) => ({
      id,
      position,
    }));

    await toast.promise(
      updatePositionsMutation.mutateAsync({
        positions,
        courseId: selectedCourse?.toString() || "",
        moduleId: selectedModule?.toString() || "",
      }),
      {
        loading: "Saving chapter positions...",
        success: "Chapter positions saved successfully!",
        error: "Failed to save chapter positions",
      }
    );

    setIsReorderMode(false);
  };

  const confirmArchivedOperation = async (chapterId: number) => {
    await toast.promise(archivedChapterMutation.mutateAsync(chapterId), {
      loading: "Archiving chapter...",
      success: "Chapter archived successfully!",
      error: "Failed to archive chapter",
    });
    setArchivedModalOpen(0);
  };

  const cancelChanges = () => {
    setChapters(data?.chapters || []);
    setIsReorderMode(false);
  };

  const toggleReorderMode = async () => {
    if (isReorderMode) {
      await saveChanges();
    } else {
      setIsReorderMode(true);
    }
  };

  const cancelArchivedOperationModal = () => {
    setArchivedModalOpen(0);
  };

  useEffect(() => {
    if (searchQuery) {
      const filteredChapters = data?.chapters?.filter((chapter) =>
        chapter.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setChapters(filteredChapters || []);
    } else {
      setChapters(data?.chapters || []);
    }
  }, [searchQuery, setChapters, data?.chapters]);

  useEffect(() => {
    if (CourseList?.courses) {
      setSelectedCourse(CourseList.courses[0].id);
      mutate({ courseId: CourseList.courses[0].id });
    }
  }, [CourseList]);

  return {
    chapters,
    statusFilter,
    searchQuery,
    CourseList,
    isLoadingCourses,
    archivedModalOpen,
    isLoading,
    isReorderMode,
    isUpdating:
      updatePositionsMutation.isPending || archivedChapterMutation.isPending,
    moduleListData,
    moduleDataLoading,
    selectedModule,
    selectedCourse,

    handleReorder,
    toggleReorderMode,
    cancelChanges,
    setStatusFilter,
    setArchivedModalOpen,
    confirmArchivedOperation,
    cancelArchivedOperationModal,
    setSearchQuery,
    fetchModules,
    setSelectedCourse,
    setSelectedModule,
  };
}
