import { DynamicIcon, iconNames } from "lucide-react/dynamic";
import { useCallback, useMemo } from "react";
import Select, { type Option } from "./select";

export type IconName = (typeof iconNames)[number];

interface IconSelectorProps {
  value: IconName | string;
  onChange: (iconName: IconName) => void;
  placeholder?: string;
  className?: string;
  maxIcons?: number;
  label?: string;
  error?: string;
  info?: string;
}

export default function LucideIconSelector({
  value,
  onChange,
  label = "Select Lucide Icon",
  placeholder = "Select an icon",
  className = "",
  maxIcons = 50,
  error,
  info,
}: IconSelectorProps) {
  // Convert initial iconNames to Select options format (limited by maxIcons)
  const iconOptions = useMemo(() => {
    return iconNames.slice(0, maxIcons).map((name) => ({
      value: name,
      label: name.replace(/-/g, " "),
    }));
  }, [maxIcons]);

  // Memoized cache for search results to avoid redundant computations
  const searchResultsCache = useMemo(() => new Map<string, Option[]>(), []);

  // Search function to search across all iconNames (not limited by maxIcons)
  // With caching for better performance
  const searchAllIcons = useCallback(
    (query: string) => {
      const searchLower = query.toLowerCase().trim();

      // Return initial options if search is empty
      if (!searchLower) return iconOptions;

      // Check if we have cached results for this query
      if (searchResultsCache.has(searchLower)) {
        return searchResultsCache.get(searchLower)!;
      }

      // If not in cache, perform the search
      const results = iconNames
        .filter(
          (name) =>
            name.toLowerCase().includes(searchLower) ||
            name.replace(/-/g, " ").toLowerCase().includes(searchLower) ||
            name.replace(/-/g, "").toLowerCase().includes(searchLower)
        )
        .map((name) => ({
          value: name,
          label: name.replace(/-/g, " "),
        }));

      // Store in cache and return
      searchResultsCache.set(searchLower, results);
      return results;
    },
    [iconOptions, searchResultsCache]
  );

  // Custom render function for the icon options
  const renderIconOption = (option: Option, isSelected: boolean) => {
    return (
      <div className="flex items-center gap-2">
        <DynamicIcon name={option.value as IconName} size={20} />
        <span className={isSelected ? "font-medium" : ""}>{option.label}</span>
      </div>
    );
  };

  // Custom render function for the selected value, works even if the icon is not in the initial options
  const renderSelectedValue = useCallback(
    (
      selectedValue: string | number | (string | number)[] | unknown,
      placeholder: string
    ) => {
      // Handle empty or array values with placeholder
      if (!selectedValue || Array.isArray(selectedValue)) {
        return <span>{placeholder}</span>;
      }

      // We can create the icon name and label directly from the selected value
      const iconName = selectedValue as IconName;
      const iconLabel = String(iconName).replace(/-/g, " ");

      return (
        <div className="flex items-center gap-2">
          <DynamicIcon name={iconName} size={20} />
          <span>{iconLabel}</span>
        </div>
      );
    },
    []
  );

  // Handle icon selection
  const handleIconChange = (
    selectedValue: string | number | (string | number)[] | null
  ) => {
    if (selectedValue && !Array.isArray(selectedValue)) {
      onChange(selectedValue as IconName);
    }
  };

  return (
    <Select
      error={error}
      info={info}
      label={label}
      options={iconOptions}
      value={value}
      onChange={handleIconChange}
      placeholder={placeholder}
      searchable={true}
      className={className}
      renderOption={renderIconOption}
      renderSelectedValue={renderSelectedValue}
      searchOptions={searchAllIcons}
    />
  );
}
