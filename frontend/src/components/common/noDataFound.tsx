import Button from "./button";

function NoDataFound({
  message = "No data found",
  description = "There is no data available to display at the moment.",
  isBack,
}: {
  message?: string;
  description?: string;
  isBack?: boolean;
}) {
  return (
    <div className="flex items-center justify-center rounded-lg bg-gray-100 p-16 text-center dark:bg-gray-800">
      <div className="flex flex-col items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="42"
          height="42"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-indigo-500 dark:text-indigo-400 opacity-50"
        >
          <path d="m13.5 8.5-5 5"></path>
          <path d="m8.5 8.5 5 5"></path>
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.3-4.3"></path>
        </svg>

        <h3 className="mt-2 text-lg font-semibold text-gray-900 dark:text-gray-50">
          {message}
        </h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>

        {isBack ? (
          <Button className="mt-4" onClick={() => window.history.back()}>
            Go Back
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export default NoDataFound;
