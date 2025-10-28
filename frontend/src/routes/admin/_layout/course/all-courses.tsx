import AdminLayout from "@/components/admin/adminLayout";
import { CourseItem } from "@/components/admin/course/courseItem";
import Button from "@/components/common/button";
import Select from "@/components/common/form/select";
import ModuleHeader from "@/components/common/layout/moduleHeader";
import { AlertModal } from "@/components/common/modal/alertModal";
import { SortableList } from "@/components/common/sortableList";
import { useCourseListController } from "@/hooks/controller/course/useCourseListController";
import { ECourseStatus, type ICourse } from "@packages/definitions";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCheck, SortAscIcon, X } from "lucide-react";

export const Route = createFileRoute("/admin/_layout/course/all-courses")({
  component: RouteComponent,
});

function RouteComponent() {
  const {
    searchQuery,
    setSearchQuery,
    courses,
    handleReorder,
    isReorderMode,
    setArchivedModalOpen,
    cancelChanges,
    toggleReorderMode,
    archivedModalOpen,
    cancelArchivedOperationModal,
    confirmArchivedOperation,
  } = useCourseListController();

  return (
    <AdminLayout>
      <ModuleHeader
        searchPlaceholder="Search courses..."
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      >
        <Select
          options={[
            { value: "", label: "All Status" },
            { value: ECourseStatus.PUBLISHED, label: "Published" },
            { value: ECourseStatus.DRAFT, label: "Draft" },
            { value: ECourseStatus.ARCHIVED, label: "Archived" },
          ]}
          value={undefined}
          onChange={() => {}}
          placeholder="All Status"
          className="w-38"
        />

        {courses?.length ? (
          <div className="flex gap-2">
            {isReorderMode && (
              <Button
                variant="danger"
                icon={<X />}
                onClick={cancelChanges}
                disabled={false}
              />
            )}

            <Button
              variant={isReorderMode ? "success" : "outline"}
              icon={isReorderMode ? <CheckCheck /> : <SortAscIcon />}
              onClick={toggleReorderMode}
              disabled={false}
            />
          </div>
        ) : null}
      </ModuleHeader>

      <SortableList<
        ICourse,
        { isReorderMode: boolean; onArchived?: (courseId: number) => void }
      >
        items={courses}
        onItemsReorder={handleReorder}
        renderItem={CourseItem}
        itemIdKey="id"
        containerClassName="divide-y divide-gray-200 dark:divide-gray-700"
        extraProps={{
          isReorderMode,
          onArchived: (id) => setArchivedModalOpen(id),
        }}
      />

      <AlertModal
        open={!!archivedModalOpen}
        onCancel={cancelArchivedOperationModal}
        onConfirm={() => confirmArchivedOperation(archivedModalOpen)}
      />
    </AdminLayout>
  );
}
