import React from "react";
import { Breadcrumbs } from "../common/layout/breadCrumbs";
import { useAdminLayout } from "@/hooks/ui/adminLayout";

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  isTab?: boolean;
  isBreadcrumbs?: boolean;
  isFormLayout?: boolean;
  isDashboard?: boolean;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  title,
  isTab = true,
  isBreadcrumbs = true,
  isFormLayout = false,
  isDashboard = false,
}) => {
  const { currentPath } = useAdminLayout();

  const ChildrenComponent = (
    <div
      className={
        isDashboard
          ? ""
          : "bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700" +
            (isFormLayout ? " p-0" : " p-6")
      }
    >
      {children}
    </div>
  );

  return (
    <>
      <div className="w-full">
        <Breadcrumbs
          title={title || ""}
          isTab={isTab}
          breadcrumbs={isBreadcrumbs ? currentPath : []}
        />

        {<>{ChildrenComponent}</>}
      </div>
    </>
  );
};

export default AdminLayout;
