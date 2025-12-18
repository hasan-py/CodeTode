import type { IDashboardStatistics } from "@packages/definitions";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type propsType = IDashboardStatistics["completionRate"];

function CompletionRateChart({ data }: { data: propsType }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
        Course Completion Rate
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data?.map((item) => ({ ...item, value: +item.value }))}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                typeof percent === "number" && !isNaN(percent)
                  ? `${name}: ${(percent * 100).toFixed(0)}%`
                  : "0%"
              }
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                borderColor: "#e5e7eb",
                color: "#111827",
              }}
              itemStyle={{ color: "#111827" }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default CompletionRateChart;
