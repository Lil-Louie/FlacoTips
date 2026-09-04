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
  creditTips: number;
  cashTips: number;
  tipOut: number;
  hourlyWage: number;
};

export type TimeRange = "day" | "week" | "month" | "year";

export function getShiftMetrics(
  shift: Shift,
  includeCashTips: boolean
) {
  const grossTips = includeCashTips
    ? shift.creditTips + shift.cashTips
    : shift.creditTips;

  const netTips = grossTips - shift.tipOut;
  const wageEarnings = shift.hoursWorked * shift.hourlyWage;
  const totalEarnings = wageEarnings + netTips;

  const tipPercentage =
    shift.totalSales > 0
      ? (grossTips / shift.totalSales) * 100
      : 0;

  const tipsPerHour =
    shift.hoursWorked > 0
      ? netTips / shift.hoursWorked
      : 0;

  const earningsPerHour =
    shift.hoursWorked > 0
      ? totalEarnings / shift.hoursWorked
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
      const metrics = getShiftMetrics(
        shift,
        includeCashTips
      );

      acc.totalEarnings += metrics.totalEarnings;
      acc.totalTips += metrics.netTips;
      acc.totalSales += shift.totalSales;
      acc.totalHours += shift.hoursWorked;
      acc.totalTables += shift.tablesServed;

      return acc;
    },
    {
      totalEarnings: 0,
      totalTips: 0,
      totalSales: 0,
      totalHours: 0,
      totalTables: 0,
    }
  );

  return {
    ...totals,

    earningsPerHour:
      totals.totalHours > 0
        ? totals.totalEarnings / totals.totalHours
        : 0,

    tipsPerHour:
      totals.totalHours > 0
        ? totals.totalTips / totals.totalHours
        : 0,

    tipPercentage:
      totals.totalSales > 0
        ? (totals.totalTips / totals.totalSales) * 100
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
        start: startOfDay(anchorDate),
        end: endOfDay(anchorDate),
      };

    case "week":
      return {
        start: startOfWeek(anchorDate, {
          weekStartsOn: 1,
        }),
        end: endOfWeek(anchorDate, {
          weekStartsOn: 1,
        }),
      };

    case "month":
      return {
        start: startOfMonth(anchorDate),
        end: endOfMonth(anchorDate),
      };

    case "year":
      return {
        start: startOfYear(anchorDate),
        end: endOfYear(anchorDate),
      };
  }
}

export function filterShiftsByPeriod(
  shifts: Shift[],
  range: TimeRange,
  anchorDate: Date
) {
  const { start, end } = getPeriodBounds(
    range,
    anchorDate
  );

  return shifts.filter((shift) => {
    const shiftDate = new Date(`${shift.date}T12:00:00`);

    return isWithinInterval(shiftDate, {
      start,
      end,
    });
  });
}

export function movePeriod(
  range: TimeRange,
  anchorDate: Date,
  direction: -1 | 1
) {
  switch (range) {
    case "day":
      return addDays(anchorDate, direction);

    case "week":
      return addWeeks(anchorDate, direction);

    case "month":
      return addMonths(anchorDate, direction);

    case "year":
      return addYears(anchorDate, direction);
  }
}

export function getPeriodLabel(
  range: TimeRange,
  anchorDate: Date
) {
  const { start, end } = getPeriodBounds(
    range,
    anchorDate
  );

  switch (range) {
    case "day":
      return format(anchorDate, "EEEE, MMM d");

    case "week":
      return `${format(start, "MMM d")} - ${format(
        end,
        "MMM d"
      )}`;

    case "month":
      return format(anchorDate, "MMMM yyyy");

    case "year":
      return format(anchorDate, "yyyy");
  }
}