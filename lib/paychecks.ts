import {
  addWeeks,
  endOfWeek,
  format,
  isWithinInterval,
  startOfWeek,
} from "date-fns";

import type { Shift } from "@/lib/analytics";

export type Paycheck = {
  id: string;

  payPeriodStart: string;
  payPeriodEnd: string;
  paycheckDate?: string;

  regularHours: number;
  grossWages: number;

  reportedTips: number;

  federalTax: number;
  stateTax: number;
  socialSecurity: number;
  medicare: number;

  otherDeductions: number;

  netPay: number;
};

export type PaycheckInput = Omit<
  Paycheck,
  "id"
>;

export function getPaycheckMetrics(
  paycheck: Paycheck
) {
  const totalTaxes =
    paycheck.federalTax +
    paycheck.stateTax +
    paycheck.socialSecurity +
    paycheck.medicare;

  const totalDeductions =
    totalTaxes +
    paycheck.otherDeductions;

  const taxableGross =
    paycheck.grossWages +
    paycheck.reportedTips;

  const withholdingRate =
    taxableGross > 0
      ? totalDeductions /
        taxableGross
      : 0;

  return {
    totalTaxes,
    totalDeductions,
    taxableGross,
    withholdingRate,
  };
}

export function getAverageWithholdingRate(
  paychecks: Paycheck[]
) {
  if (paychecks.length === 0) {
    return 0;
  }

  let totalTaxableGross = 0;
  let totalDeductions = 0;

  for (const paycheck of paychecks) {
    const metrics =
      getPaycheckMetrics(paycheck);

    totalTaxableGross +=
      metrics.taxableGross;

    totalDeductions +=
      metrics.totalDeductions;
  }

  return totalTaxableGross > 0
    ? totalDeductions /
        totalTaxableGross
    : 0;
}

export function estimateNetPay(
  grossPay: number,
  withholdingRate: number
) {
  return (
    grossPay *
    (1 - withholdingRate)
  );
}

export function getPayPeriod(
  anchorDate: Date
) {
  const start = startOfWeek(
    anchorDate,
    {
      weekStartsOn: 1,
    }
  );

  const end = endOfWeek(
    anchorDate,
    {
      weekStartsOn: 1,
    }
  );

  return {
    start,
    end,

    label: `${format(
      start,
      "MMM d"
    )} - ${format(
      end,
      "MMM d"
    )}`,
  };
}

export function movePayPeriod(
  anchorDate: Date,
  direction: -1 | 1
) {
  return addWeeks(
    anchorDate,
    direction
  );
}

export function getShiftsForPayPeriod(
  shifts: Shift[],
  anchorDate: Date
) {
  const { start, end } =
    getPayPeriod(anchorDate);

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