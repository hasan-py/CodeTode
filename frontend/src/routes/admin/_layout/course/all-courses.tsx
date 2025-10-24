import AdminLayout from "@/components/admin/adminLayout";
import Button from "@/components/common/button";
import Select from "@/components/common/form/select";
import ModuleHeader from "@/components/common/layout/moduleHeader";
import { useCourseListController } from "@/hooks/controller/course/useCourseListController";
import { ECourseStatus } from "@packages/definitions";
import { createFileRoute } from "@tanstack/react-router";
import { SortAscIcon, X } from "lucide-react";

export const Route = createFileRoute("/admin/_layout/course/all-courses")({
  component: RouteComponent,
});

function RouteComponent() {
  const { searchQuery, setSearchQuery } = useCourseListController();

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

        <div className="flex gap-2">
          <Button
            variant="danger"
            icon={<X />}
            onClick={() => {}}
            disabled={false}
          />

          <Button
            variant={"outline"}
            icon={<SortAscIcon />}
            onClick={() => {}}
            disabled={false}
          />
        </div>
      </ModuleHeader>
    </AdminLayout>
  );
}
