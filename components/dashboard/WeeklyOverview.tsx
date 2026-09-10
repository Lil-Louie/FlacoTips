import {
    addDays,
    format,
    startOfWeek,
  } from "date-fns";
  
  import {
    getShiftMetrics,
    getSummaryMetrics,
    type ChartMetric,
    type Shift,
  } from "@/lib/analytics";
  
  import { formatMetricValue } from "./AnalyticsChart";
  
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
        addDays(monday, index)
    );
  
    return (
      <div className="overflow-x-auto rounded-2xl border border-silver-light bg-white shadow-sm">
        <div className="grid min-w-[700px] grid-cols-7 divide-x divide-silver-light">
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
  
            let value = 0;
  
            switch (metric) {
              case "earnings":
                value =
                  summary.totalEarnings;
                break;
  
              case "wages":
                value =
                  summary.totalWages;
                break;
  
              case "tips":
                value =
                  summary.totalTips;
                break;
  
              case "tipPercentage":
                value =
                  summary.tipPercentage;
                break;
  
              case "sales":
                value =
                  summary.totalSales;
                break;
  
              case "tipsPerHour":
                value =
                  summary.tipsPerHour;
                break;
  
              case "earningsPerHour":
                value =
                  summary.earningsPerHour;
                break;
            }
  
            return (
              <div
                key={key}
                className="min-h-[140px] p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  {format(day, "EEE")}
                </p>
  
                <p className="mt-1 text-sm font-semibold text-navy">
                  {format(day, "MMM d")}
                </p>
  
                <p className="mt-4 text-lg font-bold text-navy">
                  {dayShifts.length
                    ? formatMetricValue(
                        value,
                        metric
                      )
                    : "—"}
                </p>
  
                {dayShifts.length >
                  0 && (
                  <p className="mt-2 text-xs capitalize text-muted">
                    {dayShifts
                      .map(
                        (shift) =>
                          shift.shiftType
                      )
                      .join(", ")}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }