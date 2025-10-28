import React from "react";

const colorPalette = {
  pending:
    "bg-amber-100 text-amber-600 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50",
  done: "bg-emerald-100 text-emerald-600 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50",
  error:
    "bg-red-100 text-red-600 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50",
  default:
    "bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-700/30 dark:text-gray-300 dark:border-gray-600/50",
  info: "bg-blue-100 text-blue-600 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50",
  warning:
    "bg-orange-100 text-orange-600 border border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800/50",
  secondary:
    "bg-purple-100 text-purple-600 border border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800/50",
};

interface BadgeProps {
  status?: keyof typeof colorPalette;
  label: string;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ status, label, className = "" }) => {
  const badgeClasses = colorPalette[status || "default"];

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${badgeClasses} ${className}`}
    >
      {label}
    </span>
  );
};

export default Badge;
