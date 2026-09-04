"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ChartPoint = {
  label: string;
  earnings: number;
};

type Props = {
  data: ChartPoint[];
};

export default function AnalyticsChart({
  data,
}: Props) {
  return (
    <div className="h-[360px] w-full rounded-xl border bg-white p-5 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">
          Earnings
        </h2>

        <p className="text-sm text-gray-500">
          Earnings over the selected period
        </p>
      </div>

      <div className="h-[270px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />

            <Tooltip
              formatter={(value) => [
                `$${Number(value).toFixed(2)}`,
                "Earnings",
              ]}
            />

            <Line
              type="monotone"
              dataKey="earnings"
              stroke="currentColor"
              strokeWidth={2}
              dot
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}