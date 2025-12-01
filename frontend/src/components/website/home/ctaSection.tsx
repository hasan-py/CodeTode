import { Link } from "@tanstack/react-router";
import type { ISectionProps } from "./featuredCourses";

interface ICtaSectionProps extends ISectionProps {
  primaryButton?: { to: string; label: string };
  secondaryButton?: { to: string; label: string };
  isAuthenticated?: boolean;
}

export function CtaSection({
  title = "Ready to Start Your Learning Journey?",
  description = "Join thousands of students who are already advancing their careers with our courses.",
  primaryButton = { to: "/courses", label: "Browse All Courses" },
  secondaryButton = { to: "/signin", label: "Get Started Today" },
  isAuthenticated,
}: ICtaSectionProps) {
  return (
    <section className="pb-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="bg-gradient-to-r from-white to-gray-50/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-sm rounded-3xl p-12 border border-gray-200 dark:border-gray-700">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              {title}
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-400 mb-8">
              {description}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to={primaryButton.to}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-medium transform hover:scale-105"
              >
                {primaryButton.label}
              </Link>

              {!isAuthenticated ? (
                <Link
                  to={secondaryButton.to}
                  className="px-8 py-4 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-all duration-300 font-medium border border-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:border-gray-700 transform hover:scale-105"
                >
                  {secondaryButton.label}
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
