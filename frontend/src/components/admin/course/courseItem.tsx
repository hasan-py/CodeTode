import Badge from "@/components/common/badge";
import Button from "@/components/common/button";
import {
  type DraggableAttributes,
  type DraggableSyntheticListeners,
} from "@dnd-kit/core";
import { ECourseStatus, type ICourse } from "@packages/definitions";
import { useNavigate } from "@tanstack/react-router";
import {
  ArchiveIcon,
  CuboidIcon as Cube,
  Edit,
  Folder,
  GraduationCap,
  GripVertical,
} from "lucide-react";

export const CourseItem = (
  course: ICourse,
  {
    attributes,
    listeners,
  }: {
    attributes: DraggableAttributes;
    listeners: DraggableSyntheticListeners | undefined;
  },
  extraProps?: {
    isReorderMode: boolean;
    onArchived?: (courseId: number) => void;
  }
): React.ReactNode => {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg mb-4 hover:border-gray-200 dark:hover:border-gray-600 transition-colors duration-200">
      <div className="flex items-center space-x-4">
        {extraProps?.isReorderMode && (
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing mr-3"
          >
            <GripVertical className="text-gray-500 h-5 w-5" />
          </div>
        )}

        <span className="w-8 h-8 flex items-center justify-center bg-indigo-600 dark:bg-indigo-700 text-white rounded-full text-sm">
          {course.position.toString()}
        </span>

        <div className="w-24 h-24 rounded-lg bg-gray-200 dark:bg-gray-700 overflow-hidden flex-shrink-0">
          <img
            src={course.imageUrl || "https://placehold.co/24x24"}
            alt={course.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-white">
              {course.name}
            </h3>
            <Badge
              label={
                course.status === ECourseStatus.PUBLISHED
                  ? "Published"
                  : course.status === ECourseStatus.ARCHIVED
                  ? "Archived"
                  : "Draft"
              }
              status={
                course.status === ECourseStatus.PUBLISHED
                  ? "done"
                  : course.status === ECourseStatus.ARCHIVED
                  ? "error"
                  : "pending"
              }
            />
          </div>

          <p className="w-[300px] text-gray-400 text-sm truncate">
            {course.description}
          </p>

          <div className="flex justify-between">
            <div className="flex gap-6 mt-4">
              <div className="text-sm text-gray-500">
                <Cube className="h-4 w-4 inline mr-2" />
                {course.moduleCount} Modules
              </div>
              <div className="text-sm text-gray-500">
                <Folder className="h-4 w-4 inline mr-2" />
                {course.chapterCount} Chapters
              </div>
              <div className="text-sm text-gray-500">
                <GraduationCap className="h-4 w-4 inline mr-2" />
                {course.lessonCount} Lessons
              </div>
              <div className="text-sm text-gray-500">
                <GraduationCap className="h-4 w-4 inline mr-2" />
                {course.quizCount} Quizzes
              </div>
            </div>

            <div className="space-x-2">
              <Button
                size="xs"
                variant="secondary"
                icon={<Edit className="w-4 h-4" />}
                onClick={() =>
                  navigate({
                    to: "/admin/course/$courseId/edit-course",
                    params: { courseId: course.id.toString() },
                  })
                }
              />

              {course.status !== ECourseStatus.ARCHIVED ? (
                <Button
                  size="xs"
                  variant="danger"
                  icon={<ArchiveIcon className="w-4 h-4" />}
                  onClick={() => {
                    if (extraProps?.onArchived) {
                      extraProps.onArchived(course.id);
                    }
                  }}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
