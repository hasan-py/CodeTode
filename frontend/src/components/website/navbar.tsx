import { Link } from "@tanstack/react-router";

interface NavbarProps {
  navLinks?: Array<{
    to: string;
    label: string;
    isExact?: boolean;
  }>;
}

export default function Navbar({
  navLinks = [
    { to: "/", label: "Home", isExact: true },
    { to: "/courses", label: "Courses" },
    { to: "/leaderboard", label: "Leaderboard" },
  ],
}: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gradient-to-r dark:from-gray-900 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700 backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-8">
            <Link to="/" className="cursor-pointer flex items-center space-x-2">
              <div className="h-8 w-8 bg-indigo-600 rounded-md flex items-center justify-center">
                <span className="text-white font-bold">CT</span>
              </div>
              <span className="text-gray-900 dark:text-white font-semibold">
                CodeTode
              </span>
            </Link>
            <div className="hidden md:flex space-x-8">
              {navLinks?.map((link, index) => (
                <Link
                  key={index}
                  to={link.to}
                  className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-white font-medium transition-colors duration-300 hover:border-b-2 hover:border-indigo-500 pb-1"
                  activeProps={{
                    className: "text-indigo-500",
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
