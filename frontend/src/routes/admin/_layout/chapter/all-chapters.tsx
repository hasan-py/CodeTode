import AdminLayout from "@/components/admin/adminLayout";
import { ChapterItem } from "@/components/admin/course/chapterItem";
import Select from "@/components/common/form/select";
import ModuleHeader from "@/components/common/layout/moduleHeader";
import { AlertModal } from "@/components/common/modal/alertModal";
import ReorderButtons from "@/components/common/reorderButtons";
import { SortableList } from "@/components/common/sortableList";
import { useChapterListController } from "@/hooks/controller/course/useChapterListController";
import type { IChapter } from "@packages/definitions";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_layout/chapter/all-chapters")({
  component: RouteComponent,
});

function RouteComponent() {
  const {
    chapters,
    statusFilter,
    searchQuery,
    CourseList,
    isLoadingCourses,
    archivedModalOpen,
    isLoading,
    isReorderMode,
    isUpdating,

    handleReorder,
    toggleReorderMode,
    cancelChanges,
    setStatusFilter,
    setArchivedModalOpen,

    confirmArchivedOperation,
    cancelArchivedOperationModal,
    setSearchQuery,

    selectedCourse,
    setSelectedCourse,
    fetchModules,
    moduleListData,
    moduleDataLoading,

    selectedModule,
    setSelectedModule,
  } = useChapterListController();

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
          disabled={isLoadingCourses}
          value={selectedCourse}
          onChange={(val) => {
            setSelectedCourse(val as number);
            fetchModules(Number(val));
            setSelectedModule(null);
          }}
          placeholder="Select Course"
          className="w-64"
        />

        <Select
          disabled={moduleDataLoading}
          options={
            moduleListData?.modules?.map((product) => ({
              value: product.id,
              label: product.name,
            })) || []
          }
          value={selectedModule}
          onChange={(val) => setSelectedModule(Number(val))}
          placeholder="Select module"
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
          onChange={(val) => setStatusFilter(val as IChapter["status"])}
          placeholder="All Status"
          className="w-38"
        />

        <ReorderButtons
          visible={!!(chapters?.length && selectedCourse && selectedModule)}
          isReorderMode={isReorderMode}
          cancelChanges={cancelChanges}
          isUpdating={isUpdating}
          toggleReorderMode={toggleReorderMode}
        />
      </ModuleHeader>

      <SortableList<
        IChapter,
        { isReorderMode: boolean; onArchived?: (module: number) => void }
      >
        items={chapters}
        onItemsReorder={handleReorder}
        renderItem={ChapterItem}
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
