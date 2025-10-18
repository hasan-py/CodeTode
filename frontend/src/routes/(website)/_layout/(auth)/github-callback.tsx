import { useGithubCallbackController } from "@/hooks/controller/account/useGithubCallbackController";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/(website)/_layout/(auth)/github-callback"
)({
  component: RouteComponent,
});

function RouteComponent() {
  useGithubCallbackController();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
        <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <div className="h-10 w-10 border-t-2 border-b-2 border-indigo-600 dark:border-indigo-400 rounded-full animate-spin"></div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Authenticating...
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Please wait while we complete the GitHub authentication process.
        </p>
      </div>
    </div>
  );
}
