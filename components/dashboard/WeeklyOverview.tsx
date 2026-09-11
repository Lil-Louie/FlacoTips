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
  const monday =
    startOfWeek(
      anchorDate,
      {
        weekStartsOn: 1,
      }
    );

  const days =
    Array.from(
      {
        length: 7,
      },
      (_, index) =>
        addDays(
          monday,
          index
        )
    );

  return (
    <div className="rounded-2xl border border-silver-light bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
          Weekly Overview
        </p>

        <h2 className="mt-1 font-semibold text-navy">
          Daily Breakdown
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {days.map(
          (day) => {
            const key =
              format(
                day,
                "yyyy-MM-dd"
              );

            const dayShifts =
              shifts.filter(
                (shift) =>
                  shift.date ===
                  key
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
              dayShifts.length >
              0;

            return (
              <div
                key={key}
                className="rounded-xl border border-silver-light bg-background p-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                      {format(
                        day,
                        "EEE"
                      )}
                    </p>

                    <p className="mt-0.5 text-sm font-semibold text-navy">
                      {format(
                        day,
                        "MMM d"
                      )}
                    </p>
                  </div>

                  {hasShift && (
                    <span className="mt-1 h-2 w-2 rounded-full bg-accent-red" />
                  )}
                </div>

                <p className="mt-4 text-lg font-bold text-navy">
                  {hasShift
                    ? formatMetric(
                        value,
                        metric
                      )
                    : "—"}
                </p>

                <p className="mt-1 text-[11px] capitalize text-muted">
                  {hasShift
                    ? dayShifts
                        .map(
                          (
                            shift
                          ) =>
                            shift.shiftType
                        )
                        .join(
                          ", "
                        )
                    : "No shift"}
                </p>
              </div>
            );
          }
        )}
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