import {
  useArchivedCourseMutation,
  useGetCoursesQuery,
  useUpdateCoursePositionsMutation,
} from "@/hooks/query/course";
import { ECourseStatus, type ICourse } from "@packages/definitions";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export function useCourseListController() {
  const [archivedModalOpen, setArchivedModalOpen] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [statusFilter, setStatusFilter] = useState("");

  const { data, isLoading } = useGetCoursesQuery({
    status: statusFilter as ECourseStatus,
  });
  const updatePositionsMutation = useUpdateCoursePositionsMutation();
  const archivedCourseMutation = useArchivedCourseMutation();

  const isUpdating =
    updatePositionsMutation.isPending || archivedCourseMutation.isPending;

  useEffect(() => {
    if (data?.courses) {
      setCourses(data.courses);
    }
  }, [data?.courses]);

  useEffect(() => {
    if (searchQuery) {
      const filteredCourses = data?.courses?.filter((course) =>
        course.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setCourses(filteredCourses || []);
    } else {
      setCourses(data?.courses || []);
    }
  }, [searchQuery, data?.courses]);

  const saveChanges = async () => {
    const positions = courses.map(({ id, position }) => ({
      id,
      position,
    }));

    await toast.promise(updatePositionsMutation.mutateAsync({ positions }), {
      loading: "Saving course positions...",
      success: "Course positions saved successfully!",
      error: "Failed to save course positions",
    });

    setIsReorderMode(false);
  };

  const handleReorder = (newList: ICourse[]) => {
    const reorderedCourses = newList.map((course, index) => ({
      ...course,
      position: index + 1,
    }));

    setCourses(reorderedCourses);
  };

  const toggleReorderMode = async () => {
    if (isReorderMode) {
      await saveChanges();
    } else {
      setIsReorderMode(true);
    }
  };

  const cancelChanges = () => {
    setIsReorderMode(false);
  };

  const confirmArchivedOperation = async (courseId: number) => {
    await toast.promise(archivedCourseMutation.mutateAsync(courseId), {
      loading: "Archiving course..." + courseId,
      success: "Course archived successfully!",
      error: "Failed to archive course",
    });
    setArchivedModalOpen(0);
  };

  const cancelArchivedOperationModal = () => {
    setArchivedModalOpen(0);
  };

  return {
    courses,
    searchQuery,
    isReorderMode,
    archivedModalOpen,
    isLoading,
    isUpdating,
    toggleReorderMode,
    handleReorder,
    setSearchQuery,
    cancelChanges,
    confirmArchivedOperation,
    cancelArchivedOperationModal,
    setArchivedModalOpen,
    setStatusFilter,
    statusFilter,
  };
}
