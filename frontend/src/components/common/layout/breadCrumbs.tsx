import { ArrowLeft, ChevronRight } from "lucide-react";
import React from "react";

export interface BreadcrumbsProps {
  breadcrumbs: string[];
  title: string;
  isTab?: boolean;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  breadcrumbs,
  title,
  isTab,
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        {!isTab ? (
          <button
            onClick={() => window.history.back()}
            className="mr-3 p-1 mb-4 rounded hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
            aria-label="Go back"
            type="button"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-200" />
          </button>
        ) : null}
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white capitalize">
          {title}
        </h1>
      </div>

      {breadcrumbs?.length ? (
        <nav className="text-sm" aria-label="Breadcrumb">
          <ol className="list-none p-0 inline-flex">
            {breadcrumbs.map((label, index) => (
              <React.Fragment key={index}>
                <li className="flex items-center">
                  <span className="text-gray-600 dark:text-gray-300 capitalize">
                    {label?.split("-")?.join(" ")}
                  </span>
                  {index < breadcrumbs.length - 1 && (
                    <ChevronRight className="h-4 w-4 mx-2 text-gray-500 dark:text-gray-400" />
                  )}
                </li>
              </React.Fragment>
            ))}
          </ol>
        </nav>
      ) : null}
    </div>
  );
};
