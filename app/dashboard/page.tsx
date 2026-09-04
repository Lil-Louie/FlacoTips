"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import AnalyticsChart from "@/components/dashboard/AnalyticsChart";
import CashTipsToggle from "@/components/dashboard/CashTipsToggle";
import MetricCards from "@/components/dashboard/MetricCards";
import ShiftForm from "@/components/dashboard/ShiftForm";
import TimeRangeSelector from "@/components/dashboard/TimeRangeSelector";

import {
  filterShiftsByPeriod,
  getPeriodLabel,
  getShiftMetrics,
  getSummaryMetrics,
  movePeriod,
  type Shift,
  type TimeRange,
} from "@/lib/analytics";

import { supabase } from "@/lib/supabase";

type NewShift = Omit<Shift, "id">;

export default function DashboardPage() {
  const [shifts, setShifts] = useState<Shift[]>(
    []
  );

  const [loading, setLoading] = useState(true);

  const [showShiftForm, setShowShiftForm] =
    useState(false);

  const [error, setError] = useState<
    string | null
  >(null);

  const [range, setRange] =
    useState<TimeRange>("week");

  const [anchorDate, setAnchorDate] =
    useState(new Date());

  const [includeCashTips, setIncludeCashTips] =
    useState(true);

  async function loadShifts() {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("shifts")
      .select("*")
      .order("date", {
        ascending: true,
      });

    if (error) {
      console.error(error);

      setError(
        "Could not load your shifts."
      );

      setLoading(false);

      return;
    }

    const formattedShifts: Shift[] =
      (data ?? []).map((shift) => ({
        id: shift.id,

        date: shift.date,

        shiftType: shift.shift_type,

        hoursWorked: Number(
          shift.hours_worked
        ),

        tablesServed: Number(
          shift.tables_served
        ),

        totalSales: Number(
          shift.total_sales
        ),

        creditTips: Number(
          shift.credit_tips
        ),

        cashTips: Number(
          shift.cash_tips
        ),

        tipOut: Number(
          shift.tip_out
        ),

        hourlyWage: Number(
          shift.hourly_wage
        ),
      }));

    setShifts(formattedShifts);

    setLoading(false);
  }

  useEffect(() => {
    loadShifts();
  }, []);

  async function saveShift(
    shift: NewShift
  ) {
    setError(null);

    const { error } = await supabase
      .from("shifts")
      .insert({
        date: shift.date,

        shift_type: shift.shiftType,

        hours_worked:
          shift.hoursWorked,

        tables_served:
          shift.tablesServed,

        total_sales:
          shift.totalSales,

        credit_tips:
          shift.creditTips,

        cash_tips:
          shift.cashTips,

        tip_out:
          shift.tipOut,

        hourly_wage:
          shift.hourlyWage,
      });

    if (error) {
      console.error(error);

      setError(
        "Could not save your shift."
      );

      throw error;
    }

    setShowShiftForm(false);

    setAnchorDate(
      new Date(`${shift.date}T12:00:00`)
    );

    await loadShifts();
  }

  const filteredShifts = useMemo(
    () =>
      filterShiftsByPeriod(
        shifts,
        range,
        anchorDate
      ),
    [shifts, range, anchorDate]
  );

  const summary = useMemo(
    () =>
      getSummaryMetrics(
        filteredShifts,
        includeCashTips
      ),
    [filteredShifts, includeCashTips]
  );

  const chartData = useMemo(
    () =>
      filteredShifts.map((shift) => {
        const metrics =
          getShiftMetrics(
            shift,
            includeCashTips
          );

        return {
          label: new Date(
            `${shift.date}T12:00:00`
          ).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),

          earnings:
            metrics.totalEarnings,
        };
      }),
    [
      filteredShifts,
      includeCashTips,
    ]
  );

  function changeRange(
    newRange: TimeRange
  ) {
    setRange(newRange);
    setAnchorDate(new Date());
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl space-y-6 px-6 py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Tip Tracker
            </h1>

            <p className="mt-1 text-gray-500">
              Track your shifts, tips,
              sales, and earnings.
            </p>
          </div>

          <button
            onClick={() =>
              setShowShiftForm(true)
            }
            className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            + Log Shift
          </button>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <TimeRangeSelector
            range={range}
            onChange={changeRange}
          />

          <CashTipsToggle
            includeCashTips={
              includeCashTips
            }
            onChange={
              setIncludeCashTips
            }
          />
        </div>

        <div className="flex items-center justify-between rounded-xl border bg-white px-5 py-3">
          <button
            onClick={() =>
              setAnchorDate((date) =>
                movePeriod(
                  range,
                  date,
                  -1
                )
              )
            }
            className="rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-100"
          >
            ← Previous
          </button>

          <p className="font-semibold">
            {getPeriodLabel(
              range,
              anchorDate
            )}
          </p>

          <button
            onClick={() =>
              setAnchorDate((date) =>
                movePeriod(
                  range,
                  date,
                  1
                )
              )
            }
            className="rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-100"
          >
            Next →
          </button>
        </div>

        <MetricCards
          totalEarnings={
            summary.totalEarnings
          }
          earningsPerHour={
            summary.earningsPerHour
          }
          tipPercentage={
            summary.tipPercentage
          }
          totalTables={
            summary.totalTables
          }
        />

        {loading ? (
          <div className="flex h-[360px] items-center justify-center rounded-xl border bg-white">
            <p className="text-gray-500">
              Loading shifts...
            </p>
          </div>
        ) : filteredShifts.length >
          0 ? (
          <AnalyticsChart
            data={chartData}
          />
        ) : (
          <div className="flex h-[360px] items-center justify-center rounded-xl border bg-white">
            <p className="text-gray-500">
              No shifts logged for this
              period.
            </p>
          </div>
        )}

        <div className="rounded-xl border bg-white shadow-sm">
          <div className="border-b px-5 py-4">
            <h2 className="font-semibold">
              Shifts
            </h2>
          </div>

          {filteredShifts.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No shifts for this period.
            </div>
          ) : (
            <div className="divide-y">
              {[...filteredShifts]
                .reverse()
                .map((shift) => {
                  const metrics =
                    getShiftMetrics(
                      shift,
                      includeCashTips
                    );

                  return (
                    <div
                      key={shift.id}
                      className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-medium capitalize">
                          {
                            shift.shiftType
                          }
                        </p>

                        <p className="text-sm text-gray-500">
                          {new Date(
                            `${shift.date}T12:00:00`
                          ).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-8 text-sm">
                        <div>
                          <p className="text-gray-500">
                            Hours
                          </p>

                          <p className="font-medium">
                            {
                              shift.hoursWorked
                            }
                          </p>
                        </div>

                        <div>
                          <p className="text-gray-500">
                            Sales
                          </p>

                          <p className="font-medium">
                            $
                            {shift.totalSales.toFixed(
                              2
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-gray-500">
                            Tips
                          </p>

                          <p className="font-medium">
                            $
                            {metrics.netTips.toFixed(
                              2
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-gray-500">
                            Earnings
                          </p>

                          <p className="font-medium">
                            $
                            {metrics.totalEarnings.toFixed(
                              2
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>

      {showShiftForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  Log Shift
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Enter your shift
                  details.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowShiftForm(
                    false
                  )
                }
                className="rounded-lg px-3 py-1 text-xl text-gray-400 hover:bg-gray-100 hover:text-black"
              >
                ×
              </button>
            </div>

            <ShiftForm
              onSave={saveShift}
              onCancel={() =>
                setShowShiftForm(false)
              }
            />
          </div>
        </div>
      )}
    </main>
  );
}