import AdminLayout from "@/components/admin/adminLayout";
import { LessonItem } from "@/components/admin/lesson/lessonItem";
import Select from "@/components/common/form/select";
import ModuleHeader from "@/components/common/layout/moduleHeader";
import { AlertModal } from "@/components/common/modal/alertModal";
import ReorderButtons from "@/components/common/reorderButtons";
import { SortableList } from "@/components/common/sortableList";
import { useLessonListController } from "@/hooks/controller/lesson/useLessonListController";
import {
  ECourseStatus,
  ELessonType,
  type ILesson,
} from "@packages/definitions";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_layout/lesson/_a/all-lessons")({
  component: RouteComponent,
});

function RouteComponent() {
  const {
    courseList,
    courseDataLoading,
    archivedModalOpen,
    setArchivedModalOpen,
    statusFilter,
    isLoading,
    setStatusFilter,
    confirmArchivedOperation,
    cancelArchivedOperationModal,
    lessons,
    setTypeFilter,
    typeFilter,
    modulesDataList,
    chaptersDataList,
    modulesLoading,
    chaptersLoading,
    handleReorder,
    selectedCourse,
    selectedModule,
    selectedChapter,
    setSelectedCourse,
    setSelectedModule,
    setSelectedChapter,
    isReorderMode,
    cancelChanges,
    isPending,
    toggleReorderMode,
    searchQuery,
    setSearchQuery,
  } = useLessonListController();

  return (
    <AdminLayout>
      <ModuleHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        title=""
        searchPlaceholder="Search lessons..."
      >
        <Select
          disabled={!!courseDataLoading}
          options={
            courseList?.courses?.map((product) => ({
              value: product.id,
              label: product.name,
            })) || []
          }
          value={
            courseList?.courses?.find(
              (product) => product.id === selectedCourse
            )?.id
          }
          onChange={(val) => {
            setSelectedCourse(Number(val));
          }}
          placeholder="Select course"
          className="w-50"
        />

        <Select
          disabled={modulesLoading}
          options={
            modulesDataList?.modules?.map((product) => ({
              value: product.id,
              label: product.name,
            })) || []
          }
          value={
            modulesDataList?.modules?.find(
              (product) => product.id === selectedModule
            )?.id
          }
          onChange={(val) => {
            setSelectedModule(Number(val));
          }}
          placeholder="Select module"
          className="w-50"
        />

        <Select
          disabled={chaptersLoading}
          options={
            chaptersDataList?.chapters?.map((product) => ({
              value: product.id,
              label: product.name,
            })) || []
          }
          value={
            chaptersDataList?.chapters?.find(
              (product) => product.id === selectedChapter
            )?.id
          }
          onChange={(val) => {
            setSelectedChapter(Number(val));
          }}
          placeholder="Select chapter"
          className="w-50"
        />

        <Select
          options={[
            { value: "", label: "All Types" },
            { value: ELessonType.THEORY, label: "Theory" },
            { value: ELessonType.QUIZ, label: "Quiz" },
            { value: ELessonType.CODING, label: "Coding" },
          ]}
          value={typeFilter}
          onChange={(val) => setTypeFilter(val as ELessonType)}
          placeholder="All Types"
          className="w-38"
        />

        <Select
          options={[
            { value: "", label: "All Status" },
            { value: "published", label: "Published" },
            { value: "draft", label: "Draft" },
          ]}
          value={statusFilter}
          onChange={(val) => setStatusFilter(val as ECourseStatus)}
          placeholder="All Status"
          className="w-38"
        />

        <ReorderButtons
          visible={
            !!(
              lessons?.length &&
              selectedCourse &&
              selectedModule &&
              selectedChapter
            )
          }
          isReorderMode={isReorderMode}
          cancelChanges={cancelChanges}
          isUpdating={isPending}
          toggleReorderMode={toggleReorderMode}
        />
      </ModuleHeader>

      <SortableList<
        ILesson,
        { isReorderMode: boolean; onArchived?: (lessonId: number) => void }
      >
        items={lessons}
        onItemsReorder={handleReorder}
        renderItem={LessonItem}
        itemIdKey="id"
        containerClassName="divide-y divide-gray-200 dark:divide-gray-700"
        extraProps={{
          isReorderMode: isReorderMode,
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
