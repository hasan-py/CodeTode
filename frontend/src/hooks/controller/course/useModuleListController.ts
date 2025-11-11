import { useGetCoursesQuery } from "@/hooks/query/course";
import {
  useArchivedModuleMutation,
  useGetModulesQuery,
  useUpdateModulePositionsMutation,
} from "@/hooks/query/course/module";
import { ECourseStatus, type IModule } from "@packages/definitions";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export function useModuleListController() {
  const { data: CourseList, isLoading: isLoadingCourses } = useGetCoursesQuery({
    status: ECourseStatus.PUBLISHED,
  });

  const [archivedModalOpen, setArchivedModalOpen] = useState<number>(0);
  const [modules, setModules] = useState<IModule[]>([]);

  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isReorderMode, setIsReorderMode] = useState(false);

  const { data, isLoading } = useGetModulesQuery({
    status: statusFilter as ECourseStatus,
    courseId: selectedCourse || undefined,
  });
  const updatePositionsMutation = useUpdateModulePositionsMutation();
  const archivedModuleMutation = useArchivedModuleMutation();

  useEffect(() => {
    if (data?.modules) {
      setModules(data.modules);
    }
  }, [data?.modules]);

  useEffect(() => {
    if (searchQuery) {
      const filteredModules = data?.modules?.filter((module) =>
        module.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setModules(filteredModules || []);
    } else {
      setModules(data?.modules || []);
    }
  }, [searchQuery, data?.modules]);

  useEffect(() => {
    if (CourseList?.courses) {
      setSelectedCourse(CourseList.courses[0].id);
    }
  }, [CourseList]);

  const handleReorder = (newList: IModule[]) => {
    const reorderedModules = newList.map((module, index) => ({
      ...module,
      position: index + 1,
    }));

    setModules(reorderedModules);
  };

  const saveChanges = async () => {
    const positions = modules.map(({ id, position }) => ({
      id,
      position,
    }));

    await toast.promise(
      updatePositionsMutation.mutateAsync({
        positions,
        courseId: modules[0]?.courseId?.toString(),
      }),
      {
        loading: "Saving module positions...",
        success: "Module positions saved successfully!",
        error: "Failed to save module positions",
      }
    );

    setIsReorderMode(false);
  };

  const confirmArchivedOperation = async (moduleId: number) => {
    await toast.promise(archivedModuleMutation.mutateAsync(moduleId), {
      loading: "Archiving module...",
      success: "Module archived successfully!",
      error: "Failed to archive module",
    });
    setArchivedModalOpen(0);
  };

  const cancelChanges = () => {
    setModules(data?.modules || []);
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
    if (CourseList?.courses) {
      setSelectedCourse(CourseList.courses[0].id);
    }
  }, [CourseList]);

  return {
    modules,
    statusFilter,
    searchQuery,
    CourseList,
    isLoadingCourses,
    archivedModalOpen,
    isLoading,
    isReorderMode,
    isUpdating:
      updatePositionsMutation.isPending || archivedModuleMutation.isPending,
    selectedCourse,

    handleReorder,
    toggleReorderMode,
    saveChanges,
    cancelChanges,
    setStatusFilter,
    confirmArchivedOperation: confirmArchivedOperation,
    cancelArchivedOperationModal: cancelArchivedOperationModal,
    setArchivedModalOpen,
    setSearchQuery,
    setSelectedCourse,
  };
}
