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

import type {
  ChartMetric,
  ChartPoint,
} from "@/lib/analytics";

type Props = {
  data: ChartPoint[];
  metric: ChartMetric;
  onMetricChange: (
    metric: ChartMetric
  ) => void;
};

const metricOptions: {
  value: ChartMetric;
  label: string;
}[] = [
  {
    value: "earnings",
    label: "Earnings",
  },
  {
    value: "wages",
    label: "Wages",
  },
  {
    value: "tips",
    label: "Tips",
  },
  {
    value: "tipPercentage",
    label: "Tip %",
  },
  {
    value: "sales",
    label: "Sales",
  },
  {
    value: "tipsPerHour",
    label: "Tips / Hour",
  },
  {
    value: "earningsPerHour",
    label: "Earnings / Hour",
  },
];

function getMetricLabel(
  metric: ChartMetric
) {
  return (
    metricOptions.find(
      (option) =>
        option.value === metric
    )?.label ?? "Earnings"
  );
}

function formatValue(
  value: number,
  metric: ChartMetric
) {
  if (
    metric ===
    "tipPercentage"
  ) {
    return `${value.toFixed(
      1
    )}%`;
  }

  return `$${value.toFixed(
    2
  )}`;
}

export default function AnalyticsChart({
  data,
  metric,
  onMetricChange,
}: Props) {
  const metricLabel =
    getMetricLabel(metric);

  return (
    <div className="w-full rounded-2xl border border-silver-light bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
          {metricLabel}
          </p>
        </div>

        <select
          value={metric}
          onChange={(
            event
          ) =>
            onMetricChange(
              event.target
                .value as ChartMetric
            )
          }
          className="w-full rounded-xl border border-silver-light bg-white px-3 py-2 text-sm font-semibold text-navy outline-none transition focus:border-navy sm:w-auto"
        >
          {metricOptions.map(
            (option) => (
              <option
                key={
                  option.value
                }
                value={
                  option.value
                }
              >
                {
                  option.label
                }
              </option>
            )
          )}
        </select>
      </div>

      <div className="h-[300px] w-full sm:h-[340px]">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: -10,
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
                fill:
                  "#64748B",
                fontSize: 11,
              }}
              dy={8}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              width={58}
              tick={{
                fill:
                  "#64748B",
                fontSize: 11,
              }}
              tickFormatter={(
                value
              ) =>
                metric ===
                "tipPercentage"
                  ? `${value}%`
                  : `$${value}`
              }
            />

            <Tooltip
              cursor={{
                stroke:
                  "#B7BDC8",
                strokeDasharray:
                  "4 4",
              }}
              contentStyle={{
                borderRadius:
                  "12px",

                border:
                  "1px solid #E5E7EB",

                backgroundColor:
                  "#FFFFFF",
              }}
              formatter={(
                value
              ) => [
                formatValue(
                  Number(value),
                  metric
                ),
                metricLabel,
              ]}
            />

            <Line
              type="monotone"
              dataKey="value"
              stroke="#0B1F3A"
              strokeWidth={3}
              dot={{
                r: 4,
                fill:
                  "#C8102E",
                stroke:
                  "#FFFFFF",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 6,
                fill:
                  "#C8102E",
                stroke:
                  "#FFFFFF",
                strokeWidth: 3,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}