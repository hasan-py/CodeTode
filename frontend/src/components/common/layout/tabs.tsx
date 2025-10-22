import { Link } from "@tanstack/react-router";
import React from "react";

export interface ITab {
  to: string;
  label: string;
  id: string;
}

export interface TabsProps {
  tabs: ITab[];
  children: React.ReactNode;
}

const Tabs: React.FC<TabsProps> = ({ tabs, children }) => {
  if (!tabs?.length) return "";

  return (
    <>
      <div className="mb-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex" aria-label="Tabs">
              {tabs?.map((tab) => (
                <Link
                  key={tab.to}
                  to={tab.to}
                  className={`px-6 py-3 font-medium transition-colors duration-200 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300`}
                  activeProps={{
                    className:
                      "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500",
                  }}
                >
                  {tab?.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
      {children}
    </>
  );
};

export default Tabs;
