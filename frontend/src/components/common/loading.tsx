import { Loader2, Atom, Zap, RotateCw } from "lucide-react";
import { clsx } from "clsx";

export interface ILoadingProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "spinner" | "pulse" | "bounce" | "rotate" | "dots";
  text?: string;
  fullscreen?: boolean;
  className?: string;
  color?: "primary" | "secondary" | "accent" | "white";
  noGap?: boolean;
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
  xl: "w-12 h-12",
};

const textSizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
};

const colorClasses = {
  primary: "text-indigo-600 dark:text-indigo-400",
  secondary: "text-gray-600 dark:text-gray-400",
  accent: "text-purple-600 dark:text-purple-400",
  white: "text-white dark:text-gray-100",
};

const SpinnerIcon = ({
  size,
  color,
}: {
  size: keyof typeof sizeClasses;
  color: keyof typeof colorClasses;
}) => (
  <Loader2
    className={clsx(sizeClasses[size], colorClasses[color], "animate-spin")}
  />
);

const PulseIcon = ({
  size,
  color,
}: {
  size: keyof typeof sizeClasses;
  color: keyof typeof colorClasses;
}) => (
  <Atom
    className={clsx(sizeClasses[size], colorClasses[color], "animate-pulse")}
  />
);

const BounceIcon = ({
  size,
  color,
}: {
  size: keyof typeof sizeClasses;
  color: keyof typeof colorClasses;
}) => (
  <Zap
    className={clsx(sizeClasses[size], colorClasses[color], "animate-bounce")}
  />
);

const RotateIcon = ({
  size,
  color,
}: {
  size: keyof typeof sizeClasses;
  color: keyof typeof colorClasses;
}) => (
  <RotateCw
    className={clsx(sizeClasses[size], colorClasses[color], "animate-spin")}
  />
);

const DotsLoader = ({
  size,
  color,
}: {
  size: keyof typeof sizeClasses;
  color: keyof typeof colorClasses;
}) => {
  const dotSize =
    size === "sm"
      ? "w-1 h-1"
      : size === "md"
      ? "w-1.5 h-1.5"
      : size === "lg"
      ? "w-2 h-2"
      : "w-3 h-3";

  return (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={clsx(
            dotSize,
            "rounded-full",
            color === "primary"
              ? "bg-indigo-600 dark:bg-indigo-400"
              : color === "secondary"
              ? "bg-gray-600 dark:bg-gray-400"
              : color === "accent"
              ? "bg-purple-600 dark:bg-purple-400"
              : "bg-white dark:bg-gray-100",
            "animate-pulse"
          )}
          style={{
            animationDelay: `${i * 0.15}s`,
            animationDuration: "0.8s",
          }}
        />
      ))}
    </div>
  );
};

export default function Loading({
  size = "md",
  variant = "spinner",
  text,
  fullscreen = false,
  className,
  color = "primary",
  noGap = false,
}: ILoadingProps) {
  const renderIcon = () => {
    switch (variant) {
      case "spinner":
        return <SpinnerIcon size={size} color={color} />;
      case "pulse":
        return <PulseIcon size={size} color={color} />;
      case "bounce":
        return <BounceIcon size={size} color={color} />;
      case "rotate":
        return <RotateIcon size={size} color={color} />;
      case "dots":
        return <DotsLoader size={size} color={color} />;
      default:
        return <SpinnerIcon size={size} color={color} />;
    }
  };

  const content = (
    <div
      className={clsx(
        "flex flex-col items-center justify-center gap-2",
        !fullscreen || (!noGap && "p-4"),
        className
      )}
    >
      {renderIcon()}
      {text && (
        <p
          className={clsx(
            textSizeClasses[size],
            colorClasses[color],
            "font-medium"
          )}
        >
          {text}
        </p>
      )}
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
}
