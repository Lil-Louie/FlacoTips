"use client";

import {
  Pencil,
  Trash2,
} from "lucide-react";

import {
  getShiftMetrics,
  type ChartMetric,
  type Shift,
} from "@/lib/analytics";

import {
  formatMetricValue,
  getMetricLabel,
} from "./AnalyticsChart";

type Props = {
  shifts: Shift[];
  includeCashTips: boolean;
  metric: ChartMetric;

  onEdit: (shift: Shift) => void;
  onDelete: (shift: Shift) => void;

  deletingShiftId: string | null;
};

export default function DailySummary({
  shifts,
  includeCashTips,
  metric,
  onEdit,
  onDelete,
  deletingShiftId,
}: Props) {
  if (shifts.length === 0) {
    return (
      <div className="rounded-2xl border border-silver-light bg-white p-8 text-center text-muted">
        No shift logged for this day.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {shifts.map((shift) => {
        const metrics =
          getShiftMetrics(
            shift,
            includeCashTips
          );

        let heroValue = 0;

        switch (metric) {
          case "earnings":
            heroValue =
              metrics.totalEarnings;
            break;

          case "wages":
            heroValue =
              metrics.wageEarnings;
            break;

          case "tips":
            heroValue =
              metrics.netTips;
            break;

          case "tipPercentage":
            heroValue =
              metrics.tipPercentage;
            break;

          case "sales":
            heroValue =
              shift.totalSales;
            break;

          case "tipsPerHour":
            heroValue =
              metrics.tipsPerHour;
            break;

          case "earningsPerHour":
            heroValue =
              metrics.earningsPerHour;
            break;
        }

        return (
          <div
            key={shift.id}
            className="rounded-2xl border border-silver-light bg-white p-5 shadow-sm sm:p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                  {shift.shiftType}
                </p>

                <p className="mt-3 text-sm text-muted">
                  {getMetricLabel(metric)}
                </p>

                <p className="mt-1 text-4xl font-bold tracking-tight text-navy">
                  {formatMetricValue(
                    heroValue,
                    metric
                  )}
                </p>
              </div>

              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() =>
                    onEdit(shift)
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-silver-light/50 hover:text-navy"
                >
                  <Pencil size={16} />
                </button>

                <button
                  type="button"
                  disabled={
                    deletingShiftId ===
                    shift.id
                  }
                  onClick={() =>
                    onDelete(shift)
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-red-50 hover:text-accent-red"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Stat
                label="Hours"
                value={shift.hoursWorked.toFixed(
                  2
                )}
              />

              <Stat
                label="Sales"
                value={`$${shift.totalSales.toFixed(
                  2
                )}`}
              />

              <Stat
                label="Tips"
                value={`$${metrics.netTips.toFixed(
                  2
                )}`}
              />

              <Stat
                label="Tip %"
                value={`${metrics.tipPercentage.toFixed(
                  1
                )}%`}
              />

              <Stat
                label="Wages"
                value={`$${metrics.wageEarnings.toFixed(
                  2
                )}`}
              />

              <Stat
                label="Tables"
                value={shift.tablesServed.toString()}
              />

              <Stat
                label="Reported Tips"
                value={`$${shift.reportedTips.toFixed(
                  2
                )}`}
              />

              <Stat
                label="Total Earned"
                value={`$${metrics.totalEarnings.toFixed(
                  2
                )}`}
              />
            </div>
          </div>
        );
      })}
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
    <div>
      <p className="text-xs text-muted">
        {label}
      </p>

      <p className="mt-1 font-semibold text-navy">
        {value}
      </p>
    </div>
  );
}