import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  isWithinInterval,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";

export type Shift = {
  id: string;
  date: string;
  shiftType: "lunch" | "dinner" | "double";
  hoursWorked: number;
  tablesServed: number;
  totalSales: number;

  cardTips: number;
  reportedTips: number;
  cashTips: number;

  tipOut: number;
  hourlyWage: number;
};

export type TimeRange =
  | "day"
  | "week"
  | "month"
  | "year";

export type ChartMetric =
  | "earnings"
  | "wages"
  | "tips"
  | "tipPercentage"
  | "sales"
  | "tipsPerHour"
  | "earningsPerHour";

export type ChartPoint = {
  label: string;
  value: number;
};

export function getShiftMetrics(
  shift: Shift,
  includeCashTips: boolean
) {
  /*
   * Reported tips are deliberately NOT included here.
   *
   * Actual tips earned:
   * Card Tips + optional Cash Tips
   *
   * Reported Tips are stored independently for
   * payroll/tax tracking.
   */
  const grossTips = includeCashTips
    ? shift.cardTips + shift.cashTips
    : shift.cardTips;

  const netTips =
    grossTips - shift.tipOut;

  const wageEarnings =
    shift.hoursWorked *
    shift.hourlyWage;

  const totalEarnings =
    wageEarnings + netTips;

  const tipPercentage =
    shift.totalSales > 0
      ? (grossTips /
          shift.totalSales) *
        100
      : 0;

  const tipsPerHour =
    shift.hoursWorked > 0
      ? netTips /
        shift.hoursWorked
      : 0;

  const earningsPerHour =
    shift.hoursWorked > 0
      ? totalEarnings /
        shift.hoursWorked
      : 0;

  return {
    grossTips,
    netTips,
    wageEarnings,
    totalEarnings,
    tipPercentage,
    tipsPerHour,
    earningsPerHour,
  };
}

export function getSummaryMetrics(
  shifts: Shift[],
  includeCashTips: boolean
) {
  const totals = shifts.reduce(
    (acc, shift) => {
      const metrics =
        getShiftMetrics(
          shift,
          includeCashTips
        );

      acc.totalEarnings +=
        metrics.totalEarnings;

      acc.totalNetTips +=
        metrics.netTips;

      acc.totalWages +=
        metrics.wageEarnings;

      acc.totalGrossTips +=
        metrics.grossTips;

      acc.totalReportedTips +=
        shift.reportedTips;

      acc.totalCardTips +=
        shift.cardTips;

      acc.totalCashTips +=
        shift.cashTips;

      acc.totalSales +=
        shift.totalSales;

      acc.totalHours +=
        shift.hoursWorked;

      acc.totalTables +=
        shift.tablesServed;

      return acc;
    },
    {
      totalEarnings: 0,
      totalNetTips: 0,
      totalGrossTips: 0,

      totalWages: 0,

      totalReportedTips: 0,
      totalCardTips: 0,
      totalCashTips: 0,

      totalSales: 0,
      totalHours: 0,
      totalTables: 0,
    }
  );

  return {
    totalEarnings:
      totals.totalEarnings,

    totalWages:
      totals.totalWages,

    totalTips:
      totals.totalNetTips,

    totalGrossTips:
      totals.totalGrossTips,

    totalReportedTips:
      totals.totalReportedTips,

    totalCardTips:
      totals.totalCardTips,

    totalCashTips:
      totals.totalCashTips,

    totalSales:
      totals.totalSales,

    totalHours:
      totals.totalHours,

    totalTables:
      totals.totalTables,

    earningsPerHour:
      totals.totalHours > 0
        ? totals.totalEarnings /
          totals.totalHours
        : 0,

    tipsPerHour:
      totals.totalHours > 0
        ? totals.totalNetTips /
          totals.totalHours
        : 0,

    tipPercentage:
      totals.totalSales > 0
        ? (totals.totalGrossTips /
            totals.totalSales) *
          100
        : 0,
  };
}

export function getPeriodBounds(
  range: TimeRange,
  anchorDate: Date
) {
  switch (range) {
    case "day":
      return {
        start:
          startOfDay(anchorDate),

        end:
          endOfDay(anchorDate),
      };

    case "week":
      return {
        start: startOfWeek(
          anchorDate,
          {
            weekStartsOn: 1,
          }
        ),

        end: endOfWeek(
          anchorDate,
          {
            weekStartsOn: 1,
          }
        ),
      };

    case "month":
      return {
        start:
          startOfMonth(anchorDate),

        end:
          endOfMonth(anchorDate),
      };

    case "year":
      return {
        start:
          startOfYear(anchorDate),

        end:
          endOfYear(anchorDate),
      };
  }
}

export function filterShiftsByPeriod(
  shifts: Shift[],
  range: TimeRange,
  anchorDate: Date
) {
  const { start, end } =
    getPeriodBounds(
      range,
      anchorDate
    );

  return shifts.filter(
    (shift) => {
      const shiftDate =
        new Date(
          `${shift.date}T12:00:00`
        );

      return isWithinInterval(
        shiftDate,
        {
          start,
          end,
        }
      );
    }
  );
}

export function movePeriod(
  range: TimeRange,
  anchorDate: Date,
  direction: -1 | 1
) {
  switch (range) {
    case "day":
      return addDays(
        anchorDate,
        direction
      );

    case "week":
      return addWeeks(
        anchorDate,
        direction
      );

    case "month":
      return addMonths(
        anchorDate,
        direction
      );

    case "year":
      return addYears(
        anchorDate,
        direction
      );
  }
}

export function getPeriodLabel(
  range: TimeRange,
  anchorDate: Date
) {
  const { start, end } =
    getPeriodBounds(
      range,
      anchorDate
    );

  switch (range) {
    case "day":
      return format(
        anchorDate,
        "EEEE, MMM d"
      );

    case "week":
      return `${format(
        start,
        "MMM d"
      )} - ${format(
        end,
        "MMM d"
      )}`;

    case "month":
      return format(
        anchorDate,
        "MMMM yyyy"
      );

    case "year":
      return format(
        anchorDate,
        "yyyy"
      );
  }
}

export function getMetricChartData(
  shifts: Shift[],
  range: TimeRange,
  metric: ChartMetric,
  includeCashTips: boolean
): ChartPoint[] {
  if (range === "day") {
    return shifts.map(
      (shift, index) => {
        const metrics =
          getShiftMetrics(
            shift,
            includeCashTips
          );

        return {
          label:
            shifts.length > 1
              ? `${capitalize(
                  shift.shiftType
                )} ${index + 1}`
              : capitalize(
                  shift.shiftType
                ),

          value:
            getSingleShiftMetricValue(
              shift,
              metrics,
              metric
            ),
        };
      }
    );
  }

  const groups =
    new Map<
      string,
      Shift[]
    >();

  for (const shift of shifts) {
    const date =
      new Date(
        `${shift.date}T12:00:00`
      );

    const key =
      range === "year"
        ? format(
            date,
            "yyyy-MM"
          )
        : shift.date;

    const existing =
      groups.get(key) ?? [];

    existing.push(shift);

    groups.set(
      key,
      existing
    );
  }

  return Array.from(
    groups.entries()
  )
    .sort(([a], [b]) =>
      a.localeCompare(b)
    )
    .map(
      ([key, group]) => {
        const summary =
          getSummaryMetrics(
            group,
            includeCashTips
          );

        const label =
          range === "year"
            ? format(
                new Date(
                  `${key}-01T12:00:00`
                ),
                "MMM"
              )
            : format(
                new Date(
                  `${key}T12:00:00`
                ),
                range ===
                  "week"
                  ? "EEE"
                  : "MMM d"
              );

        return {
          label,

          value:
            getSummaryMetricValue(
              summary,
              metric
            ),
        };
      }
    );
}

function getSingleShiftMetricValue(
  shift: Shift,
  metrics: ReturnType<
    typeof getShiftMetrics
  >,
  metric: ChartMetric
) {
  switch (metric) {
    case "earnings":
      return metrics.totalEarnings;

    case "wages":
      return metrics.wageEarnings;

    case "tips":
      return metrics.netTips;

    case "tipPercentage":
      return metrics.tipPercentage;

    case "sales":
      return shift.totalSales;

    case "tipsPerHour":
      return metrics.tipsPerHour;

    case "earningsPerHour":
      return metrics.earningsPerHour;
  }
}

function getSummaryMetricValue(
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

export function getPreviousPeriodDate(
  range: TimeRange,
  anchorDate: Date
) {
  return movePeriod(
    range,
    anchorDate,
    -1
  );
}

export function getMetricChange(
  current: number,
  previous: number
) {
  if (previous === 0) {
    return {
      percent:
        current > 0 ? 100 : 0,

      difference:
        current,
    };
  }

  return {
    percent:
      ((current - previous) /
        Math.abs(previous)) *
      100,

    difference:
      current - previous,
  };
}

function capitalize(
  value: string
) {
  return (
    value.charAt(0).toUpperCase() +
    value.slice(1)
  );
}