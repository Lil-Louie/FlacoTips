"use client";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type Props = {
  payPeriodLabel: string;

  totalHours: number;
  totalWages: number;

  estimatedWithholdingRate: number;

  onPreviousPeriod: () => void;
  onNextPeriod: () => void;
};

export default function PaycheckEstimate({
  payPeriodLabel,
  totalHours,
  totalWages,
  estimatedWithholdingRate,
  onPreviousPeriod,
  onNextPeriod,
}: Props) {
  const estimatedGross = totalWages;

  const estimatedDeductions =
    estimatedGross * estimatedWithholdingRate;

  const estimatedNet =
    estimatedGross - estimatedDeductions;

  return (
    <div className="rounded-2xl border border-silver-light bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            Paycheck
          </p>

          <h2 className="mt-1 text-xl font-bold text-navy">
            Estimate
          </h2>

          <p className="mt-1 text-sm text-muted">
            Monday - Sunday pay period
          </p>
        </div>

        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={onPreviousPeriod}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-silver-light text-navy transition hover:bg-silver-light/40"
            aria-label="Previous pay period"
          >
            <ChevronLeft size={17} />
          </button>

          <div className="min-w-[135px] text-center">
            <p className="text-sm font-semibold text-navy">
              {payPeriodLabel}
            </p>
          </div>

          <button
            type="button"
            onClick={onNextPeriod}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-silver-light text-navy transition hover:bg-silver-light/40"
            aria-label="Next pay period"
          >
            <ChevronRight size={17} />
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Stat
          label="Hours Worked"
          value={totalHours.toFixed(2)}
        />

        <Stat
          label="Wages Earned"
          value={`$${totalWages.toFixed(2)}`}
        />
      </div>

      <div className="mt-6 space-y-4 border-t border-silver-light pt-5">
        <Row
          label="Estimated Gross Paycheck"
          value={`$${estimatedGross.toFixed(2)}`}
        />

        <Row
          label="Estimated Deductions"
          value={`-$${estimatedDeductions.toFixed(2)}`}
          danger
        />

        <div className="border-t border-silver-light pt-4">
          <Row
            label="Estimated Paycheck"
            value={`$${estimatedNet.toFixed(2)}`}
            strong
          />
        </div>
      </div>

      {estimatedWithholdingRate === 0 && (
        <p className="mt-5 rounded-xl bg-silver-light/40 px-4 py-3 text-xs leading-5 text-muted">
          Add an actual paycheck to calibrate your estimated deductions.
        </p>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-silver-light bg-background p-4">
      <p className="text-xs font-medium text-muted">
        {label}
      </p>

      <p className="mt-1 text-lg font-bold text-navy">
        {value}
      </p>
    </div>
  );
}

function Row({
  label,
  value,
  danger = false,
  strong = false,
}: {
  label: string;
  value: string;
  danger?: boolean;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span
        className={
          strong
            ? "font-semibold text-navy"
            : "text-sm text-muted"
        }
      >
        {label}
      </span>

      <span
        className={`${
          strong
            ? "text-xl font-bold"
            : "font-semibold"
        } ${
          danger
            ? "text-accent-red"
            : "text-navy"
        }`}
      >
        {value}
      </span>
    </div>
  );
}