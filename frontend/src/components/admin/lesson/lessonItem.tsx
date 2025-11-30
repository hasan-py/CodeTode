import Badge from "@/components/common/badge";
import Button from "@/components/common/button";
import type {
  DraggableAttributes,
  DraggableSyntheticListeners,
} from "@dnd-kit/core";
import {
  ECourseStatus,
  ELessonType,
  type ILesson,
} from "@packages/definitions";
import { useNavigate } from "@tanstack/react-router";
import { ArchiveIcon, Edit, GripVertical } from "lucide-react";

export const LessonItem = (
  lesson: ILesson,
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
    <div className="flex p-4 items-center">
      {extraProps?.isReorderMode && (
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing mr-3"
        >
          <GripVertical className="text-gray-500 h-5 w-5" />
        </div>
      )}

      <span className="w-8 h-8 flex items-center justify-center bg-indigo-600 text-white rounded-full text-sm">
        {lesson.position}
      </span>

      <div className="ml-4 flex-1">
        <div className="flex items-center">
          <h4 className="font-medium text-gray-900 dark:text-white">
            {lesson.name}
          </h4>
          <div className="ml-auto flex items-center space-x-2">
            {lesson?.quizzes?.length || lesson?.contentLinks?.length ? (
              <Badge
                label={
                  lesson.type.charAt(0).toUpperCase() + lesson.type.slice(1)
                }
                status={
                  lesson.type === ELessonType.THEORY
                    ? "info"
                    : lesson.type === ELessonType.QUIZ
                    ? "secondary"
                    : "warning"
                }
              />
            ) : null}

            <Badge
              label={
                lesson.status.charAt(0).toUpperCase() + lesson.status.slice(1)
              }
              status={
                lesson.status === ECourseStatus.PUBLISHED ? "done" : "default"
              }
            />

            <Button
              size="xs"
              variant="secondary"
              icon={<Edit className="w-4 h-4" />}
              onClick={() => {
                navigate({
                  to: "/admin/lesson/$lessonId/edit-lesson",
                  params: { lessonId: lesson.id.toString() },
                });
              }}
            />

            {lesson.status !== ECourseStatus.ARCHIVED ? (
              <Button
                size="xs"
                variant="danger"
                icon={<ArchiveIcon className="w-4 h-4" />}
                onClick={() => {
                  if (extraProps?.onArchived) {
                    extraProps.onArchived(lesson.id);
                  }
                }}
              />
            ) : null}
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          XP: {lesson.xpPoints} · {lesson.description}
        </p>
      </div>
    </div>
  );
};
