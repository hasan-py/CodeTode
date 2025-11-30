import Badge from "@/components/common/badge";
import Button from "@/components/common/button";
import {
  type DraggableAttributes,
  type DraggableSyntheticListeners,
} from "@dnd-kit/core";
import { ECourseStatus, type IModule } from "@packages/definitions";
import { useNavigate } from "@tanstack/react-router";
import { ArchiveIcon, Edit, GripVertical } from "lucide-react";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";

export const ModuleItem = (
  module: IModule,
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
      <div
        className={`flex items-center ${
          extraProps?.isReorderMode ? "w-20" : "w-12"
        }`}
      >
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
          {module.position}
        </span>
      </div>

      <div className="w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center w-full justify-between">
            <div className="flex items-center space-x-2">
              <h3 className="font-medium text-gray-900 dark:text-white">
                {module.name}
              </h3>
              <DynamicIcon name={module.iconName as IconName} size={20} />
            </div>
            <Badge
              label={
                module.status === ECourseStatus.PUBLISHED
                  ? "Published"
                  : module.status === ECourseStatus.ARCHIVED
                  ? "Archived"
                  : "Draft"
              }
              status={
                module.status === ECourseStatus.PUBLISHED
                  ? "done"
                  : module.status === ECourseStatus.ARCHIVED
                  ? "error"
                  : "pending"
              }
            />
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {module.description}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-500">
          <span>
            {module.chapterCount} Chapters • {module.lessonCount} Lessons
          </span>

          <div className="space-x-2">
            <Button
              size="xs"
              variant="secondary"
              icon={<Edit className="w-4 h-4" />}
              onClick={() =>
                navigate({
                  to: "/admin/module/$moduleId/edit-module",
                  params: { moduleId: module?.id.toString() },
                })
              }
            />

            {module.status !== ECourseStatus.ARCHIVED ? (
              <Button
                size="xs"
                variant="danger"
                icon={<ArchiveIcon className="w-4 h-4" />}
                onClick={() => {
                  if (extraProps?.onArchived) {
                    extraProps.onArchived(module.id);
                  }
                }}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
