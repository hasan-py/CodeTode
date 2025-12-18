import { Calendar, DollarSign, ListOrderedIcon, Users } from "lucide-react";

interface SummaryCardsProps {
  totalStudents: number | string;
  totalSales: number | string;
  totalOrder: number | string;
  maxExpiredDays: number | string;
}

function SummaryCards({
  totalStudents = 0,
  totalSales = 0,
  totalOrder = 0,
  maxExpiredDays = 0,
}: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
            <Users className="text-indigo-600 dark:text-indigo-400 h-6 w-6" />
          </div>
          <div className="ml-4">
            <h3 className="text-sm text-gray-600 dark:text-gray-400">
              Total Students
            </h3>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {totalStudents}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
            <DollarSign className="text-emerald-600 dark:text-emerald-400 h-6 w-6" />
          </div>
          <div className="ml-4">
            <h3 className="text-sm text-gray-600 dark:text-gray-400">
              Total Sales
            </h3>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {totalSales}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
            <ListOrderedIcon className="text-amber-600 dark:text-amber-400 h-6 w-6" />
          </div>
          <div className="ml-4">
            <h3 className="text-sm text-gray-600 dark:text-gray-400">
              Total Order
            </h3>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {totalOrder}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <Calendar className="text-purple-600 dark:text-purple-400 h-6 w-6" />
          </div>
          <div className="ml-4">
            <h3 className="text-sm text-gray-600 dark:text-gray-400">
              Last Course Expired
            </h3>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {maxExpiredDays}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SummaryCards;
