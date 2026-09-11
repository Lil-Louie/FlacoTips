import {
  addDays,
  format,
  startOfWeek,
} from "date-fns";

import {
  getSummaryMetrics,
  type ChartMetric,
  type Shift,
} from "@/lib/analytics";

type Props = {
  shifts: Shift[];
  anchorDate: Date;
  includeCashTips: boolean;
  metric: ChartMetric;
};

export default function WeeklyOverview({
  shifts,
  anchorDate,
  includeCashTips,
  metric,
}: Props) {
  const monday = startOfWeek(
    anchorDate,
    {
      weekStartsOn: 1,
    }
  );

  const days = Array.from(
    { length: 7 },
    (_, index) =>
      addDays(
        monday,
        index
      )
  );

  return (
    <div className="rounded-2xl border border-silver-light bg-white p-3 shadow-sm sm:p-5">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
          Weekly Overview
        </p>
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {days.map((day) => {
          const key = format(
            day,
            "yyyy-MM-dd"
          );

          const dayShifts =
            shifts.filter(
              (shift) =>
                shift.date === key
            );

          const summary =
            getSummaryMetrics(
              dayShifts,
              includeCashTips
            );

          const value =
            getMetricValue(
              summary,
              metric
            );

          const hasShift =
            dayShifts.length > 0;

          return (
            <div
              key={key}
              className="min-w-0 text-center"
            >
              {/* DAY */}
              <p className="text-[9px] font-semibold uppercase tracking-wide text-muted sm:text-xs">
                {format(day, "EEE")}
              </p>

              {/* DATE CIRCLE */}
              <div
                className={`mx-auto mt-1 flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold sm:h-10 sm:w-10 sm:text-sm ${
                  hasShift
                    ? "bg-navy text-white"
                    : "bg-silver-light/50 text-muted"
                }`}
              >
                {format(day, "d")}
              </div>

              {/* TIME */}
              <div className="mt-2 flex min-h-[28px] items-center justify-center rounded-md border border-silver-light bg-background px-0.5">
                <span className="truncate text-[8px] font-medium text-muted sm:text-[10px]">
                  {hasShift
                    ? formatHours(
                        summary.totalHours
                      )
                    : "—"}
                </span>
              </div>

              {/* METRIC */}
              <div className="mt-1 flex min-h-[28px] items-center justify-center rounded-md border border-silver-light bg-background px-0.5">
                <span className="truncate text-[8px] font-bold text-navy sm:text-[10px]">
                  {hasShift
                    ? formatMetric(
                        value,
                        metric
                      )
                    : "—"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getMetricValue(
  summary: ReturnType<
    typeof getSummaryMetrics
  >,
  metric: ChartMetric
) {
  switch (metric) {
    case "earnings":
      return summary.totalEarnings;

    case "wages":
      return summary.totalWages;

    case "tips":
      return summary.totalTips;

    case "tipPercentage":
      return summary.tipPercentage;

    case "sales":
      return summary.totalSales;

    case "tipsPerHour":
      return summary.tipsPerHour;

    case "earningsPerHour":
      return summary.earningsPerHour;
  }
}

function formatMetric(
  value: number,
  metric: ChartMetric
) {
  if (
    metric === "tipPercentage"
  ) {
    return `${value.toFixed(1)}%`;
  }

  if (
    metric === "tipsPerHour" ||
    metric === "earningsPerHour"
  ) {
    return `$${value.toFixed(0)}/h`;
  }

  return `$${value.toFixed(0)}`;
}

function formatHours(
  hours: number
) {
  const wholeHours =
    Math.floor(hours);

  const minutes =
    Math.round(
      (hours - wholeHours) *
        60
    );

  if (wholeHours === 0) {
    return `${minutes}m`;
  }

  if (minutes === 0) {
    return `${wholeHours}h`;
  }

  return `${wholeHours}h ${minutes}m`;
}