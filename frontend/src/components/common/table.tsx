import React from "react";

export interface ITableHeader<TData> {
  label: string;
  key: keyof TData;
  render?: (rowData: TData, cellValue: TData[keyof TData]) => React.ReactNode;
  headerClass?: string;
  cellClass?: string;
}

export interface ITableProps<TData> {
  headers: ITableHeader<TData>[];
  data: TData[];
  tableClass?: string;
  headerRowClass?: string;
  bodyRowClass?: string;
  emptyMessage?: string;
}

const Table = <TData,>({
  headers,
  data,
  tableClass = "min-w-full",
  headerRowClass = "bg-gray-100 dark:bg-gray-700/50",
  bodyRowClass = "hover:bg-gray-50 dark:hover:bg-gray-700/30",
  emptyMessage = "No data available",
}: ITableProps<TData>) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className={`table ${tableClass}`}>
        <thead>
          <tr className={headerRowClass}>
            {headers.map((header, index) => (
              <th
                key={String(header.key) || index}
                className={`px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase ${
                  header.headerClass || ""
                }`}
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((rowData, rowIndex) => (
            <tr key={rowIndex} className={bodyRowClass}>
              {headers.map((header, cellIndex) => (
                <td
                  key={String(header.key) || cellIndex}
                  className={`px-6 py-4 text-gray-700 dark:text-gray-300 ${
                    header.cellClass || ""
                  }`}
                >
                  {header.render
                    ? header.render(rowData, rowData[header.key])
                    : String(rowData[header.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
