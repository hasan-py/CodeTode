import { useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import Button from "./button";
import { useTheme } from "@/hooks/ui/useTheme";

export default function NotFound() {
  useTheme();
  const router = useRouter();
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col items-center justify-center">
      <div className="max-w-3xl mx-auto text-center px-4 py-8">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-indigo-600 dark:text-indigo-500 mb-4">
          404
        </h1>
        <p className="text-2xl sm:text-3xl font-semibold text-gray-700 dark:text-gray-300 mb-6">
          Page Not Found
        </p>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Sorry, we couldn't find the page you're looking for. It might have
          doesn't exist.
        </p>
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={() => router.navigate({ to: "/" })}
            icon={<ArrowLeft className="h-5 w-5" />}
          >
            Home Page
          </Button>
        </div>
      </div>
    </div>
  );
}
