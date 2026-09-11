import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
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

export default function MonthlyCalendar({
  shifts,
  anchorDate,
  includeCashTips,
  metric,
}: Props) {
  const monthStart =
    startOfMonth(anchorDate);

  const monthEnd =
    endOfMonth(anchorDate);

  const calendarStart =
    startOfWeek(monthStart, {
      weekStartsOn: 0,
    });

  const calendarEnd =
    endOfWeek(monthEnd, {
      weekStartsOn: 0,
    });

  const days: Date[] = [];

  let current =
    calendarStart;

  while (current <= calendarEnd) {
    days.push(current);

    current =
      addDays(current, 1);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-silver-light bg-white shadow-sm">
      <div className="grid grid-cols-7 border-b border-silver-light bg-silver-light/20">
        {[
          "Sun",
          "Mon",
          "Tue",
          "Wed",
          "Thu",
          "Fri",
          "Sat",
        ].map((day) => (
          <div
            key={day}
            className="px-1 py-3 text-center text-[10px] font-semibold uppercase tracking-wide text-muted sm:text-xs"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {days.map((day) => {
          const key =
            format(
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

          const isCurrentMonth =
            day.getMonth() ===
              anchorDate.getMonth() &&
            day.getFullYear() ===
              anchorDate.getFullYear();

          const value =
            getMetricValue(
              summary,
              metric
            );

          return (
            <div
              key={key}
              className={`min-h-[72px] border-b border-r border-silver-light p-1.5 sm:min-h-[110px] sm:p-3 ${
                !isCurrentMonth
                  ? "bg-silver-light/10 opacity-40"
                  : ""
              }`}
            >
              <p className="text-[10px] font-semibold text-muted sm:text-xs">
                {format(
                  day,
                  "d"
                )}
              </p>

              {dayShifts.length >
                0 && (
                <p className="mt-2 truncate text-[10px] font-bold text-navy sm:text-sm">
                  {formatMetricValue(
                    value,
                    metric
                  )}
                </p>
              )}
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

function formatMetricValue(
  value: number,
  metric: ChartMetric
) {
  if (
    metric === "tipPercentage"
  ) {
    return `${value.toFixed(1)}%`;
  }

  return `$${value.toFixed(2)}`;
}