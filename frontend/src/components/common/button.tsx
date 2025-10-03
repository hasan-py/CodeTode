import React from "react";
import type { ReactNode, ButtonHTMLAttributes } from "react";
import clsx from "clsx";

// Define possible button variants, including the new 'outline'
type ButtonVariant = "primary" | "secondary" | "danger" | "success" | "outline";

// Define possible colors for the outline variant
type OutlineColor = "indigo" | "red" | "emerald" | "gray";

// Define possible button sizes
type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

// Define possible icon positions
type IconPosition = "left" | "right";

// Define the component's props by extending standard button attributes
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  icon?: ReactNode;
  iconPosition?: IconPosition;
  shadow?: boolean;
  scaleOnHover?: boolean;
  className?: string;
  /**
   * Specifies the color for the 'outline' variant.
   * Required when variant is 'outline'.
   * Defaults to 'indigo' if variant is 'outline' and no color is provided.
   */
  outlineColor?: OutlineColor;
}

// --- Component Definition ---

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  icon,
  iconPosition = "left",
  shadow,
  scaleOnHover,
  className,
  outlineColor, // Include the new prop
  ...otherProps
}) => {
  const enableShadow =
    shadow === undefined
      ? variant === "primary" || variant === "success"
      : shadow;
  const enableScale = scaleOnHover === undefined ? size === "xl" : scaleOnHover;

  const baseClasses = clsx(
    `font-medium ${
      otherProps?.disabled ? "cursor-not-allowed" : "cursor-pointer"
    }`,
    icon
      ? "inline-flex items-center gap-2"
      : "inline-flex items-center justify-center",
    "transition-all duration-300"
  );

  // Determine the actual outline color if variant is 'outline'
  const actualOutlineColor =
    variant === "outline" ? outlineColor || "indigo" : undefined; // Default to indigo if outline and no color provided

  // Build variant-specific classes
  const variantClasses = clsx({
    // Primary button with dark mode gradient
    "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700":
      variant === "primary",
    // Secondary button with dark mode styles
    "bg-gray-50 text-gray-800 border border-gray-200 hover:bg-gray-300 !transition-colors dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700":
      variant === "secondary",
    // Danger button with dark mode styles
    "bg-red-100/50 text-red-700 border border-red-300/50 hover:bg-red-200/50 !transition-colors dark:bg-red-600/20 dark:text-red-400 dark:border-red-800/50 dark:hover:bg-red-600/30":
      variant === "danger",
    // Success button with dark mode styles
    "bg-emerald-600 text-white hover:bg-emerald-700": variant === "success",

    // Classes for the new 'outline' variant based on outlineColor
    "bg-transparent border !transition-colors": variant === "outline", // Base styles for outline

    // Specific outline colors (Light mode first, then dark mode)
    "text-indigo-600 border-indigo-600 hover:bg-indigo-600 hover:text-white dark:text-indigo-500 dark:border-indigo-500 dark:hover:bg-indigo-500 dark:hover:text-white":
      variant === "outline" && actualOutlineColor === "indigo",
    "text-red-600 border-red-600 hover:bg-red-600 hover:text-white dark:text-red-600 dark:border-red-600 dark:hover:bg-red-600 dark:hover:text-white":
      variant === "outline" && actualOutlineColor === "red",
    "text-emerald-600 border-emerald-600 hover:bg-emerald-600 hover:text-white dark:text-emerald-600 dark:border-emerald-600 dark:hover:bg-emerald-600 dark:hover:text-white":
      variant === "outline" && actualOutlineColor === "emerald",
    // Gray outline for 'outline' variant matches 'secondary' hover for consistency, but keeps text-gray-300 border-gray-700 initial state
    "text-gray-800 border-gray-400 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-300":
      variant === "outline" && actualOutlineColor === "gray",
  });

  // Standardized size classes - apply regardless of fullWidth
  const sizeClasses = clsx({
    "px-2 py-1 text-xs rounded-lg": size === "xs",
    "px-4 py-2 text-sm rounded-lg": size === "sm",
    "px-5 py-2 text-base rounded-lg": size === "md",
    "px-6 py-3 text-base rounded-xl": size === "lg",
    "px-8 py-4 text-lg rounded-xl": size === "xl",
  });

  // Width classes - add w-full if needed
  const widthClasses = fullWidth ? "w-full justify-center" : "";

  const shadowClasses = clsx({
    // Shadows for primary and success buttons (light and dark)
    "shadow-lg shadow-indigo-300/40 dark:shadow-indigo-500/20":
      enableShadow && variant === "primary",
    "shadow-lg shadow-emerald-300/40 dark:shadow-emerald-600/20":
      enableShadow && variant === "success",
    // Add generic shadow-lg if explicitly enabled for outline or other variants
    "shadow-lg": enableShadow && variant !== "primary" && variant !== "success", // Apply generic shadow if explicitly enabled and not primary/success
  });

  const hoverClasses = clsx({
    "transform hover:scale-105": enableScale,
  });

  const allClasses = clsx(
    baseClasses,
    variantClasses,
    sizeClasses,
    widthClasses,
    shadowClasses,
    hoverClasses,
    className
  );

  return (
    <button className={allClasses} {...otherProps}>
      {icon && iconPosition === "left" && icon}
      {children}
      {icon && iconPosition === "right" && icon}
    </button>
  );
};

export default Button;
