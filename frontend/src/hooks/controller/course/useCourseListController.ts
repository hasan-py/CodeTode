import { ECourseStatus, type ICourse } from "@packages/definitions";
import { useState } from "react";
import toast from "react-hot-toast";

export function useCourseListController() {
  const [archivedModalOpen, setArchivedModalOpen] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [courses, setCourses] = useState<ICourse[]>(courseData);

  const handleReorder = (newList: ICourse[]) => {
    const reorderedCourses = newList.map((course, index) => ({
      ...course,
      position: index + 1,
    }));

    setCourses(reorderedCourses);
  };

  const toggleReorderMode = async () => {
    if (isReorderMode) {
      setIsReorderMode(false);
    } else {
      setIsReorderMode(true);
    }
  };

  const cancelChanges = () => {
    setIsReorderMode(false);
  };

  const confirmArchivedOperation = async (courseId: number) => {
    await toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 1000);
      }),
      {
        loading: "Archiving course..." + courseId,
        success: "Course archived successfully!",
        error: "Failed to archive course",
      }
    );
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
    toggleReorderMode,
    handleReorder,
    setSearchQuery,
    cancelChanges,
    confirmArchivedOperation,
    cancelArchivedOperationModal,
    setArchivedModalOpen,
  };
}

const courseData: ICourse[] = [
  {
    id: 1,
    name: "Introduction to TypeScript",
    description:
      "Learn the basics of TypeScript, a powerful typed superset of JavaScript.",
    imageUrl: "https://placehold.co/24x24/png",
    status: ECourseStatus.PUBLISHED,
    price: "$49.99",
    position: 1,
    createdAt: "2025-01-15T10:00:00Z",
    updatedAt: "2025-08-20T12:00:00Z",
    validityYear: 1,
    lemonSqueezyProductId: "prod_12345",
    moduleCount: 5,
    chapterCount: 10,
    lessonCount: 25,
    quizCount: 5,
    enrollLink: "https://example.com/enroll/typescript-course",
  },
  {
    id: 2,
    name: "Advanced React",
    description:
      "Master advanced concepts in React, including hooks, context, and performance optimization.",
    imageUrl: "https://placehold.co/24x24/png",
    status: ECourseStatus.ARCHIVED,
    price: "$79.99",
    position: 2,
    createdAt: "2025-02-10T14:00:00Z",
    updatedAt: "2025-08-25T16:00:00Z",
    lemonSqueezyProductId: "prod_67890",
    moduleCount: 8,
    chapterCount: 15,
    lessonCount: 40,
    quizCount: 10,
  },
  {
    id: 3,
    name: "Node.js for Beginners",
    description:
      "Get started with Node.js and learn how to build scalable backend applications.",
    imageUrl: "https://placehold.co/24x24/png",
    status: ECourseStatus.DRAFT,
    price: "$39.99",
    position: 3,
    createdAt: "2025-03-05T09:00:00Z",
    updatedAt: "2025-07-30T11:00:00Z",
    moduleCount: 4,
    chapterCount: 8,
    lessonCount: 20,
    quizCount: 3,
  },
];
