import React from "react";
import { Breadcrumbs } from "../common/layout/breadCrumbs";
import { useAdminLayout } from "@/hooks/ui/adminLayout";
import Tabs from "../common/layout/tabs";

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
  const { currentPath, routeTab } = useAdminLayout();
  const displayTabs = routeTab?.tabs?.length && isTab;

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
          title={title || routeTab?.title}
          isTab={isTab}
          breadcrumbs={isBreadcrumbs ? currentPath : []}
        />

        {displayTabs && isTab ? (
          <Tabs tabs={routeTab?.tabs}>{ChildrenComponent}</Tabs>
        ) : null}

        {!displayTabs && !isTab ? <>{ChildrenComponent}</> : null}
      </div>
    </>
  );
};

export default AdminLayout;
