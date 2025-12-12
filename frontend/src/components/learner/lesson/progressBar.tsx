interface ProgressBarProps {
  progress: number;
  isCircular?: boolean;
  size?: number;
  height?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  isCircular = false,
  size = 100,
  height = 2,
}) => {
  if (isCircular) {
    const strokeWidth = 7;
    const radius = size / 2 - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - progress / 100);

    return (
      <div
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <svg className="w-full h-full" viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-gray-200 dark:stroke-gray-700"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-emerald-500 dark:stroke-emerald-400"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              strokeLinecap: "round",
              transform: "rotate(-90deg)",
              transformOrigin: "center",
              transition: "stroke-dashoffset 0.5s ease-out",
            }}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-xs font-bold text-gray-900 dark:text-white">
            {progress}%
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-4">
        <div
          className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-${height}`}
        >
          <div
            className={`bg-emerald-500 h-${height} rounded-full transition-all duration-500`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex-shrink-0">
          <span className="text-md font-bold text-emerald-600 dark:text-emerald-400 w-12 text-right">
            {progress}%
          </span>
        </div>
      </div>
    </div>
  );
};
