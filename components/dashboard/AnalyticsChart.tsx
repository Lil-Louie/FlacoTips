"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type {
  ChartMetric,
  ChartPoint,
} from "@/lib/analytics";

export type ChartStyle = "line" | "bar";

type Props = {
  data: ChartPoint[];
  metric: ChartMetric;
  onMetricChange: (metric: ChartMetric) => void;
  chartStyle: ChartStyle;
  onChartStyleChange: (style: ChartStyle) => void;
};

const metricOptions: {
  value: ChartMetric;
  label: string;
}[] = [
  { value: "earnings", label: "Earnings" },
  { value: "wages", label: "Wages" },
  { value: "tips", label: "Tips" },
  { value: "tipPercentage", label: "Tip %" },
  { value: "sales", label: "Sales" },
  { value: "tipsPerHour", label: "Tips / Hour" },
  {
    value: "earningsPerHour",
    label: "Earnings / Hour",
  },
];

export function getMetricLabel(
  metric: ChartMetric
) {
  return (
    metricOptions.find(
      (option) => option.value === metric
    )?.label ?? "Earnings"
  );
}

export function formatMetricValue(
  value: number,
  metric: ChartMetric
) {
  if (metric === "tipPercentage") {
    return `${value.toFixed(1)}%`;
  }

  return `$${value.toFixed(2)}`;
}

export default function AnalyticsChart({
  data,
  metric,
  onMetricChange,
  chartStyle,
  onChartStyleChange,
}: Props) {
  const metricLabel =
    getMetricLabel(metric);

  const commonElements = (
    <>
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
        width={65}
        tick={{
          fill: "#64748B",
          fontSize: 12,
        }}
        tickFormatter={(value) =>
          metric === "tipPercentage"
            ? `${value}%`
            : `$${value}`
        }
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
        }}
        formatter={(value) => [
          formatMetricValue(
            Number(value),
            metric
          ),
          metricLabel,
        ]}
      />
    </>
  );

  return (
    <div className="w-full rounded-2xl border border-silver-light bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            Performance
          </p>

          <h2 className="mt-1 text-xl font-bold text-navy">
            {metricLabel}
          </h2>

          <p className="mt-1 text-sm text-muted">
            {metricLabel} over the selected period
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="inline-flex rounded-xl border border-silver-light bg-white p-1">
            <button
              type="button"
              onClick={() =>
                onChartStyleChange("line")
              }
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                chartStyle === "line"
                  ? "bg-navy text-white"
                  : "text-muted hover:bg-silver-light/40"
              }`}
            >
              Line
            </button>

            <button
              type="button"
              onClick={() =>
                onChartStyleChange("bar")
              }
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                chartStyle === "bar"
                  ? "bg-navy text-white"
                  : "text-muted hover:bg-silver-light/40"
              }`}
            >
              Bar
            </button>
          </div>

          <select
            value={metric}
            onChange={(event) =>
              onMetricChange(
                event.target.value as ChartMetric
              )
            }
            className="rounded-xl border border-silver-light bg-white px-3 py-2 text-sm font-semibold text-navy outline-none"
          >
            {metricOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="h-[320px] w-full sm:h-[340px]">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          {chartStyle === "line" ? (
            <LineChart data={data}>
              {commonElements}

              <Line
                type="monotone"
                dataKey="value"
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
          ) : (
            <BarChart data={data}>
              {commonElements}

              <Bar
                dataKey="value"
                fill="#0B1F3A"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}