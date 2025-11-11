import { useGetCoursesQuery } from "@/hooks/query/course";
import { ECourseStatus, type IModule } from "@packages/definitions";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export function useModuleListController() {
  const { data: CourseList, isLoading: isLoadingCourses } = useGetCoursesQuery({
    status: ECourseStatus.PUBLISHED,
  });

  const [archivedModalOpen, setArchivedModalOpen] = useState<number>(0);
  const [modules, setModules] = useState<IModule[]>(ModuleData);

  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isReorderMode, setIsReorderMode] = useState(false);

  const handleReorder = (newList: IModule[]) => {
    const reorderedModules = newList.map((module, index) => ({
      ...module,
      position: index + 1,
    }));

    setModules(reorderedModules);
  };

  const saveChanges = async () => {
    await toast.promise(
      new Promise((resolve) => {
        resolve(true);
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
    await toast.promise(
      new Promise((resolve) => {
        resolve(true);
      }),
      {
        loading: "Archiving module..." + moduleId,
        success: "Module archived successfully!",
        error: "Failed to archive module",
      }
    );
    setArchivedModalOpen(0);
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
    isLoading: false,
    isReorderMode,
    isUpdating: false,
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

const ModuleData: IModule[] = [
  {
    id: 1,
    name: "Introduction to TypeScript",
    description:
      "Learn the basics of TypeScript, including types and interfaces.",
    status: ECourseStatus.PUBLISHED,
    position: 1,
    createdAt: "2025-01-01T10:00:00Z",
    updatedAt: "2025-01-15T12:00:00Z",
    courseId: 101,
    iconName: "book",
    chapterCount: 5,
    lessonCount: 20,
    quizCount: 3,
    course: {
      id: 101,
      name: "TypeScript Mastery",
      description: "A comprehensive course on TypeScript.",
      imageUrl: "https://example.com/images/typescript.jpg",
      status: ECourseStatus.PUBLISHED,
      price: "$49.99",
      position: 1,
      createdAt: "2025-01-01T10:00:00Z",
      updatedAt: "2025-01-15T12:00:00Z",
      validityYear: 1,
      lemonSqueezyProductId: "prod_12345",
      moduleCount: 10,
      chapterCount: 50,
      lessonCount: 200,
      quizCount: 20,
      enrollLink: "https://example.com/enroll/typescript",
    },
    isCurrent: true,
  },
  {
    id: 2,
    name: "Advanced React",
    description: "Dive deep into React concepts like hooks and context.",
    status: ECourseStatus.DRAFT,
    position: 2,
    createdAt: "2025-02-01T10:00:00Z",
    updatedAt: "2025-02-10T12:00:00Z",
    courseId: 102,
    iconName: "react",
    chapterCount: 8,
    lessonCount: 30,
    quizCount: 5,
    course: undefined,
    isCurrent: false,
  },
  {
    id: 3,
    name: "Node.js Basics",
    description:
      "Learn how to build scalable backend applications with Node.js.",
    status: ECourseStatus.ARCHIVED,
    position: 3,
    createdAt: "2025-03-01T10:00:00Z",
    updatedAt: "2025-03-15T12:00:00Z",
    courseId: 103,
    iconName: "server",
    chapterCount: 6,
    lessonCount: 25,
    quizCount: 4,
    course: undefined,
    isCurrent: false,
  },
];
