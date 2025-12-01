import Button from "@/components/common/button";
import { Link } from "@tanstack/react-router";

export default function Hero({
  isAuthenticated = false,
  backgroundImage = "/placeholder.svg?height=800&width=1600",
  badgeText = "Over 50,000+ students trust us",
  titleParts = ["Master Your Skills with ", "Expert-Led", " Courses"],
  description = "Join thousands of students learning from our comprehensive text-based courses designed to help you succeed in today's digital world.",
  primaryButton = { to: "/courses", label: "Explore Courses" },
  secondaryButton = { to: "/signin", label: "Join the journey" },
  stats = [
    {
      value: "50K+",
      label: "Active Learners",
      description: "Joining our community every month",
    },
    {
      value: "100+",
      label: "Text Courses",
      description: "Covering in-demand skills and topics",
    },
    {
      value: "95%",
      label: "Success Rate",
      description: "Students completing their courses",
    },
  ],
}) {
  return (
    <section className="relative overflow-hidden">
      <div
        className={`absolute inset-0 bg-[url('${backgroundImage}')] bg-cover bg-center opacity-5 dark:opacity-10`}
      ></div>
      <div className="absolute inset-0 bg-gray-50 dark:bg-gray-900"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-6 border border-indigo-300 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800">
            {badgeText}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {titleParts.map((part, index) =>
              index === 1 ? ( // Apply gradient to the second part
                <span
                  key={index}
                  className="bg-gradient-to-r from-indigo-600 to-purple-700 dark:from-indigo-400 dark:to-purple-500 bg-clip-text text-transparent"
                >
                  {part}
                </span>
              ) : (
                <span key={index}>{part}</span>
              )
            )}
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            {description}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Link to={primaryButton.to}>
              <Button size="lg">{primaryButton.label}</Button>
            </Link>

            {!isAuthenticated ? (
              <Link to={secondaryButton.to}>
                <Button variant="secondary" size="lg">
                  {secondaryButton.label}
                </Button>
              </Link>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mt-16">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-white to-gray-50/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-sm rounded-xl p-8 transform hover:scale-105 transition-transform duration-300 border border-gray-200 dark:border-gray-700"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100/30 text-indigo-700 mb-4 dark:bg-indigo-900/30 dark:text-indigo-400">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </span>
              </div>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {stat.label}
              </p>
              <p className="text-gray-700 dark:text-gray-400 mt-2">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
