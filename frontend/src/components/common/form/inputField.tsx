import clsx from "clsx";
import React from "react";

interface InputFieldProps {
  label?: string;
  name: string;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  value?: string | number | unknown;
  onChange?: (
    value: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  error?: string;
  info?: string;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  required?: boolean;
  disabled?: boolean;
  isTextArea?: boolean;
  rows?: number;
  onKeyDown?: (
    event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

export default function InputField({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  info,
  className,
  labelClassName,
  inputClassName,
  required,
  disabled,
  isTextArea,
  rows,
  onKeyDown,
}: InputFieldProps) {
  // Base styles for the input/textarea element, now with light and dark modes
  const baseStyle = clsx(
    "w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-1",
    // Disabled state styles for both modes
    disabled
      ? "bg-gray-200 text-gray-600 border-gray-200 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600"
      : "bg-white text-gray-900 border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
  );

  // Combine base styles with error/custom classes
  const elementClassName = clsx(
    baseStyle,
    inputClassName,
    error
      ? "border-red-500 focus:ring-red-500 focus:border-red-500 dark:border-red-400 dark:focus:ring-red-400 dark:focus:border-red-400"
      : ""
  );

  const changeHandler = onChange as
    | React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
    | undefined;

  return (
    <div className={className}>
      <div className="space-y-2">
        {label ? (
          // Label with light and dark mode text color
          <label
            htmlFor={name}
            className={clsx(
              "block text-sm font-medium text-gray-700 dark:text-gray-300",
              labelClassName
            )}
          >
            {label}
            {required && (
              <span className="text-red-500 dark:text-red-400"> *</span>
            )}
          </label>
        ) : null}

        {isTextArea ? (
          <textarea
            id={name}
            name={name}
            placeholder={placeholder}
            value={value as string}
            disabled={disabled}
            onChange={changeHandler}
            className={elementClassName}
            rows={rows}
            onKeyDown={onKeyDown}
          />
        ) : (
          <input
            type={type}
            id={name}
            name={name}
            placeholder={placeholder}
            value={value as string | number}
            disabled={disabled}
            onChange={changeHandler}
            className={elementClassName}
            onKeyDown={onKeyDown}
          />
        )}
      </div>

      {/* Error and Info messages with light and dark mode text colors */}
      {error || info ? (
        <div className={isTextArea ? "" : "mt-1"}>
          {error && !info && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
          {info && !error && (
            <p className="text-sm text-gray-600 dark:text-gray-400">{info}</p>
          )}
        </div>
      ) : null}
    </div>
  );
}
