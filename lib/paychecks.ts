import {
  addWeeks,
  endOfWeek,
  format,
  isWithinInterval,
  startOfWeek,
} from "date-fns";

import type { Shift } from "@/lib/analytics";

export type TaxBreakdown = {
  federalTax: number;
  stateTax: number;
  socialSecurity: number;
  medicare: number;
  otherDeductions: number;
};

export type Paycheck = {
  id: string;

  payPeriodStart: string;
  payPeriodEnd: string;
  paycheckDate?: string;

  regularHours: number;
  grossWages: number;

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

  const withholdingRate =
    paycheck.grossWages > 0
      ? totalDeductions /
        paycheck.grossWages
      : 0;

  return {
    totalTaxes,
    totalDeductions,
    withholdingRate,
  };
}

export function getAverageTaxRates(
  paychecks: Paycheck[]
) {
  if (paychecks.length === 0) {
    return {
      federalRate: 0,
      stateRate: 0,
      socialSecurityRate: 0,
      medicareRate: 0,
      otherDeductionRate: 0,
    };
  }

  const totals = paychecks.reduce(
    (acc, paycheck) => {
      acc.gross +=
        paycheck.grossWages;

      acc.federal +=
        paycheck.federalTax;

      acc.state +=
        paycheck.stateTax;

      acc.socialSecurity +=
        paycheck.socialSecurity;

      acc.medicare +=
        paycheck.medicare;

      acc.other +=
        paycheck.otherDeductions;

      return acc;
    },
    {
      gross: 0,
      federal: 0,
      state: 0,
      socialSecurity: 0,
      medicare: 0,
      other: 0,
    }
  );

  if (totals.gross === 0) {
    return {
      federalRate: 0,
      stateRate: 0,
      socialSecurityRate: 0,
      medicareRate: 0,
      otherDeductionRate: 0,
    };
  }

  return {
    federalRate:
      totals.federal /
      totals.gross,

    stateRate:
      totals.state /
      totals.gross,

    socialSecurityRate:
      totals.socialSecurity /
      totals.gross,

    medicareRate:
      totals.medicare /
      totals.gross,

    otherDeductionRate:
      totals.other /
      totals.gross,
  };
}

export function estimateTaxes(
  grossWages: number,
  rates: ReturnType<
    typeof getAverageTaxRates
  >
): TaxBreakdown {
  return {
    federalTax:
      grossWages *
      rates.federalRate,

    stateTax:
      grossWages *
      rates.stateRate,

    socialSecurity:
      grossWages *
      rates.socialSecurityRate,

    medicare:
      grossWages *
      rates.medicareRate,

    otherDeductions:
      grossWages *
      rates.otherDeductionRate,
  };
}

export function estimateNetPaycheck(
  grossWages: number,
  taxes: TaxBreakdown
) {
  const deductions =
    taxes.federalTax +
    taxes.stateTax +
    taxes.socialSecurity +
    taxes.medicare +
    taxes.otherDeductions;

  return grossWages - deductions;
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
      const date = new Date(
        `${shift.date}T12:00:00`
      );

      return isWithinInterval(
        date,
        {
          start,
          end,
        }
      );
    }
  );
}