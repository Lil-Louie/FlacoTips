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
    <div className="w-full rounded-2xl border border-silver-light bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            Performance
          </p>

          <h2 className="mt-1 text-xl font-bold tracking-tight text-navy">
            Earnings
          </h2>

          <p className="mt-1 text-sm text-muted">
            Earnings over the selected period
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-silver-light bg-silver-light/40 px-3 py-1.5">
          <span className="h-2 w-2 rounded-full bg-accent-red" />
          <span className="text-xs font-semibold text-navy">
            Total Earnings
          </span>
        </div>
      </div>

      <div className="h-[340px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid
              stroke="#E5E7EB"
              strokeDasharray="4 4"
              vertical={false}
            />

            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{
                fill: "#64748B",
                fontSize: 12,
              }}
              dy={8}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{
                fill: "#64748B",
                fontSize: 12,
              }}
              tickFormatter={(value) => `$${value}`}
              width={60}
            />

            <Tooltip
              cursor={{
                stroke: "#B7BDC8",
                strokeDasharray: "4 4",
              }}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #E5E7EB",
                backgroundColor: "#FFFFFF",
                boxShadow:
                  "0 10px 25px rgba(15, 23, 42, 0.08)",
              }}
              labelStyle={{
                color: "#0B1F3A",
                fontWeight: 700,
                marginBottom: "4px",
              }}
              itemStyle={{
                color: "#0B1F3A",
              }}
              formatter={(value) => [
                `$${Number(value).toFixed(2)}`,
                "Earnings",
              ]}
            />

            <Line
              type="monotone"
              dataKey="earnings"
              stroke="#0B1F3A"
              strokeWidth={3}
              dot={{
                r: 4,
                fill: "#C8102E",
                stroke: "#FFFFFF",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 6,
                fill: "#C8102E",
                stroke: "#FFFFFF",
                strokeWidth: 3,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}