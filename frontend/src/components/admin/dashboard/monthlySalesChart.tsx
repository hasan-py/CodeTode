import type { IDashboardStatistics } from "@packages/definitions";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type propsType = IDashboardStatistics["monthlySales"];
function MonthlySalesChart({ data }: { data: propsType }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Monthly Sales Overview
        </h3>
      </div>
      <div className="h-80">
        <ResponsiveContainer
          width={data?.length < 5 ? "50%" : "100%"}
          height="100%"
        >
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7eb"
              className="dark:stroke-[#374151]"
            />
            <XAxis
              dataKey="name"
              stroke="#6b7280"
              className="dark:stroke-[#9ca3af]"
            />
            <YAxis stroke="#6b7280" className="dark:stroke-[#9ca3af]" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                borderColor: "#e5e7eb",
                color: "#111827",
              }}
              formatter={(value) => [`$${value}`, "Sales"]}
              itemStyle={{ color: "#111827" }}
            />
            <Legend />
            <Bar dataKey="sales" name="Sales ($)" fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default MonthlySalesChart;
