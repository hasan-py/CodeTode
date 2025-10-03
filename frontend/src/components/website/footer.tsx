export default function Footer({
  copyright = `© ${new Date().getFullYear()} CodeTode. All rights reserved.`,
}) {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-base text-gray-500 dark:text-gray-400 text-center">
          {copyright}
        </p>
      </div>
    </footer>
  );
}
