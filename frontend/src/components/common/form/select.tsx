import { ChevronDown } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

export interface Option {
  description?: string;
  value: string | number;
  label: string;
  [key: string]: unknown;
}

interface SelectProps {
  options: Option[];
  value: string | number | (string | number)[] | unknown;
  onChange: (value: string | number | (string | number)[] | null) => void;
  placeholder?: string;
  isMulti?: boolean;
  label?: string;
  searchable?: boolean;
  className?: string;
  error?: string;
  info?: string;
  required?: boolean;
  disabled?: boolean;
  renderOption?: (
    option: Option,
    isSelected: boolean
  ) => React.ReactNode | React.JSX.Element;
  renderSelectedValue?: (
    value: string | number | (string | number)[] | unknown,
    placeholder: string
  ) => React.ReactNode | React.JSX.Element;
  searchOptions?: (query: string) => Option[];
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  label,
  placeholder = "Select an option",
  isMulti = false,
  searchable = false,
  error,
  info,
  required,
  className,
  disabled = false,
  renderOption,
  renderSelectedValue,
  searchOptions,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const selectRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectRef]);

  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      const timeoutId = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
      return () => clearTimeout(timeoutId);
    }
    if (!isOpen) {
      setSearchTerm("");
    }
  }, [isOpen, searchable]);

  const handleOptionClick = (option: Option) => {
    if (isMulti) {
      const currentValueArray = Array.isArray(value) ? value : [];
      const isSelected = currentValueArray.includes(option.value);

      if (isSelected) {
        const newValue = currentValueArray.filter((v) => v !== option.value);
        onChange(newValue);
      } else {
        const newValue = [...currentValueArray, option.value];
        onChange(newValue);
      }
    } else {
      onChange(option.value);
      setIsOpen(false);
    }
  };

  const handleTriggerClick = () => {
    setIsOpen(!isOpen);
  };

  const filteredOptions =
    searchable && debouncedSearchTerm
      ? searchOptions
        ? searchOptions(debouncedSearchTerm)
        : options.filter((option) =>
            option.label
              .toLowerCase()
              .includes(debouncedSearchTerm.toLowerCase())
          )
      : options;

  const displayValue = () => {
    if (isMulti) {
      const currentValueArray = Array.isArray(value) ? value : [];
      if (currentValueArray.length === 0) {
        return placeholder;
      } else {
        const selectedLabels = options
          .filter((option) => currentValueArray.includes(option.value))
          .map((option) => option.label);
        if (selectedLabels.length > 2) {
          return `${selectedLabels.slice(0, 2).join(", ")} +${
            selectedLabels.length - 2
          } more`;
        }
        return selectedLabels.join(", ");
      }
    } else {
      const selectedOption = options.find((option) => option.value === value);
      return selectedOption ? selectedOption.label : placeholder;
    }
  };

  const isOptionSelected = (option: Option) => {
    if (isMulti) {
      return Array.isArray(value) && value.includes(option.value);
    } else {
      return value === option.value;
    }
  };

  return (
    <div className="space-y-2">
      {label ? (
        <label
          htmlFor={label}
          className={`block text-sm font-medium text-gray-700 dark:text-gray-300`}
        >
          {label}
          {required && <span className="text-red-400"> *</span>}
        </label>
      ) : null}

      <div className={`relative ${className}`} ref={selectRef}>
        <button
          disabled={disabled}
          type="button"
          className={`${
            error
              ? "border-red-400 focus:ring-red-400 focus:border-red-400"
              : "border-gray-200 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
          } ${
            disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          } bg-white dark:bg-gray-700 flex items-center justify-between w-full px-4 py-3 border rounded-lg text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1`}
          onClick={handleTriggerClick}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          {renderSelectedValue ? (
            <div className="">{renderSelectedValue(value, placeholder)}</div>
          ) : (
            <span className="truncate">{displayValue()}</span>
          )}
          <ChevronDown
            className={`w-5 h-5 ml-2 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg overflow-hidden">
            {searchable && (
              <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                <input
                  ref={searchInputRef}
                  type="text"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
            <ul
              className={`max-h-60 overflow-y-auto ${
                searchable ? "pt-0" : "pt-1"
              } pb-1`}
              role="listbox"
            >
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => {
                  const selected = isOptionSelected(option);
                  return (
                    <li
                      key={option.value}
                      className={`text-left flex px-4 py-2 cursor-pointer ${
                        selected
                          ? "bg-indigo-500 text-white"
                          : "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                      onClick={() => handleOptionClick(option)}
                      role="option"
                      aria-selected={selected}
                    >
                      {renderOption
                        ? renderOption(option, selected)
                        : option.label}
                    </li>
                  );
                })
              ) : (
                <li className="px-4 py-2 text-gray-500 dark:text-gray-400">
                  No options found
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      {error || info ? (
        <div>
          {error && !info && <p className="text-sm text-red-400">{error}</p>}
          {info && !error && <p className="text-sm text-gray-400">{info}</p>}
        </div>
      ) : null}
    </div>
  );
};

export default Select;
