import { Search } from "lucide-react";
import InputField from "../form/inputField";

function ModuleHeader({
  title,
  isSearch = true,
  searchPlaceholder,
  children,
  searchQuery,
  setSearchQuery,
}: {
  title?: string;
  isSearch?: boolean;
  searchPlaceholder?: string;
  children?: React.ReactNode;
  onSearch?: (query: string) => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
}) {
  return (
    <div className="w-full">
      <div className={`flex justify-between items-start mb-6`}>
        {title ? <h1 className="text-2xl font-semibold">{title}</h1> : null}

        {isSearch ? (
          <div className="relative">
            <InputField
              name="search"
              type="text"
              placeholder={searchPlaceholder || "Search..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
            />

            <Search className="absolute right-3 top-4 h-4 w-4 text-gray-500 dark:text-gray-400" />
          </div>
        ) : null}

        {children ? (
          <div className="flex flex-wrap gap-4 justify-end">{children}</div>
        ) : null}
      </div>
    </div>
  );
}

export default ModuleHeader;
