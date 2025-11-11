import AdminLayout from "@/components/admin/adminLayout";
import { ModuleItem } from "@/components/admin/course/moduleItem";
import Select from "@/components/common/form/select";
import ModuleHeader from "@/components/common/layout/moduleHeader";
import { AlertModal } from "@/components/common/modal/alertModal";
import ReorderButtons from "@/components/common/reorderButtons";
import { SortableList } from "@/components/common/sortableList";
import { useModuleListController } from "@/hooks/controller/course/useModuleListController";
import type { IModule } from "@packages/definitions";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_layout/module/all-modules")({
  component: RouteComponent,
});

function RouteComponent() {
  const {
    modules,
    CourseList,
    handleReorder,
    isReorderMode,
    archivedModalOpen,
    setArchivedModalOpen,
    searchQuery,
    statusFilter,
    isLoading,
    isUpdating,
    cancelChanges,
    setStatusFilter,
    confirmArchivedOperation,
    cancelArchivedOperationModal,
    setSearchQuery,
    selectedCourse,
    setSelectedCourse,
    toggleReorderMode,
  } = useModuleListController();

  return (
    <AdminLayout>
      <ModuleHeader
        title=""
        searchPlaceholder="Search courses..."
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      >
        <Select
          options={
            CourseList?.courses?.map((product) => ({
              value: product.id,
              label: product.name,
            })) || []
          }
          value={selectedCourse}
          onChange={(val) => setSelectedCourse(val as number)}
          placeholder="Select Course"
          className="w-64"
        />

        <Select
          options={[
            { value: "", label: "All Status" },
            { value: "published", label: "Published" },
            { value: "draft", label: "Draft" },
            { value: "archived", label: "Archived" },
          ]}
          value={statusFilter}
          onChange={(val) => setStatusFilter(val as IModule["status"])}
          placeholder="All Status"
          className="w-38"
        />

        <ReorderButtons
          visible={modules?.length > 0}
          isReorderMode={isReorderMode}
          cancelChanges={cancelChanges}
          isUpdating={isUpdating}
          toggleReorderMode={toggleReorderMode}
        />
      </ModuleHeader>

      <SortableList<
        IModule,
        { isReorderMode: boolean; onArchived?: (module: number) => void }
      >
        items={modules}
        onItemsReorder={handleReorder}
        renderItem={ModuleItem}
        itemIdKey="id"
        containerClassName="divide-y divide-gray-200 dark:divide-gray-700"
        extraProps={{
          isReorderMode,
          onArchived: (id) => setArchivedModalOpen(id),
        }}
        isLoading={isLoading}
      />

      <AlertModal
        open={!!archivedModalOpen}
        onCancel={cancelArchivedOperationModal}
        onConfirm={() => confirmArchivedOperation(archivedModalOpen)}
      />
    </AdminLayout>
  );
}
