import Button from "@/components/common/button";
import { useGetGithubUrlMutation } from "@/hooks/query/account/auth";
import { authStore } from "@/stores/authStore";
import { createFileRoute, redirect } from "@tanstack/react-router";
// import { GithubIcon } from "lucide-react";

export const Route = createFileRoute("/(website)/_layout/(auth)/signin")({
  component: RouteComponent,
  beforeLoad: () => {
    const isAuthenticated = authStore.getState().isAuthenticated;
    if (isAuthenticated) {
      return redirect({
        to: "/",
      });
    }
    return {};
  },
});

function RouteComponent() {
  const githubAuthMutation = useGetGithubUrlMutation();

  const signinHandler = async () => {
    if (githubAuthMutation?.isPending || githubAuthMutation?.data) return;
    await githubAuthMutation.mutateAsync();
  };

  return (
    <div className="text-gray-800 flex flex-col justify-center dark:text-gray-200">
      <div className="max-w-xl mx-auto w-full px-4 sm:px-6 py-16">
        <div className="bg-gradient-to-b from-white to-gray-50 rounded-2xl p-8 border border-gray-200 dark:from-gray-800 dark:to-gray-900 dark:border-gray-700">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Sign in or Sign up to your account
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Start your learning journey today
            </p>
          </div>

          <div className="space-y-6">
            <Button
              // icon={<GithubIcon className="text-gray-800 dark:text-white" />}
              icon={<GitHubIcon />}
              fullWidth
              size="lg"
              onClick={signinHandler}
              className="bg-white text-gray-800 border border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700"
            >
              Continue with Github
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

const GitHubIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    role="img"
    aria-label="GitHub icon"
  >
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);
