"use client";

import {
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  SlidersHorizontal,
  Trash2,
  X,
} from "lucide-react";

import AnalyticsChart from "@/components/dashboard/AnalyticsChart";

import CashTipsToggle from "@/components/dashboard/CashTipsToggle";
import DailySummary from "@/components/dashboard/DailySummary";
import MetricCards from "@/components/dashboard/MetricCards";
import MonthlyCalendar from "@/components/dashboard/MonthlyCalendar";
import PaycheckEstimate from "@/components/dashboard/PaycheckEstimate";
import ShiftForm from "@/components/dashboard/ShiftForm";
import TimeRangeSelector from "@/components/dashboard/TimeRangeSelector";
import WeeklyOverview from "@/components/dashboard/WeeklyOverview";

import {
  filterShiftsByPeriod,
  getMetricChange,
  getMetricChartData,
  getPeriodLabel,
  getPreviousPeriodDate,
  getShiftMetrics,
  getSummaryMetrics,
  movePeriod,
  type ChartMetric,
  type Shift,
  type TimeRange,
} from "@/lib/analytics";

import {
  getPayPeriod,
  getShiftsForPayPeriod,
  movePayPeriod,
} from "@/lib/paychecks";

import { supabase } from "@/lib/supabase";

type NewShift = Omit<Shift, "id">;

export default function DashboardPage() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);

  const [showShiftForm, setShowShiftForm] =
    useState(false);

  const [showFilters, setShowFilters] =
    useState(false);

  const [showHistory, setShowHistory] =
    useState(false);

  const [showPaycheck, setShowPaycheck] =
    useState(false);

  const [monthView, setMonthView] =
    useState<"graph" | "calendar">("graph");

  const [error, setError] = useState<
    string | null
  >(null);

  const [editingShift, setEditingShift] =
    useState<Shift | null>(null);

  const [deletingShiftId, setDeletingShiftId] =
    useState<string | null>(null);

  const [range, setRange] =
    useState<TimeRange>("week");

  const [anchorDate, setAnchorDate] =
    useState(new Date());

  const [includeCashTips, setIncludeCashTips] =
    useState(true);

  const [chartMetric, setChartMetric] =
    useState<ChartMetric>("earnings");


  const [
    payPeriodAnchor,
    setPayPeriodAnchor,
  ] = useState(new Date());

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

        cardTips: Number(
          shift.card_tips
        ),

        reportedTips: Number(
          shift.reported_tips
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

    const databaseShift = {
      date: shift.date,
      shift_type: shift.shiftType,
      hours_worked: shift.hoursWorked,
      tables_served: shift.tablesServed,
      total_sales: shift.totalSales,
      card_tips: shift.cardTips,
      reported_tips: shift.reportedTips,
      cash_tips: shift.cashTips,
      tip_out: shift.tipOut,
      hourly_wage: shift.hourlyWage,
    };

    let request;

    if (editingShift) {
      request = supabase
        .from("shifts")
        .update(databaseShift)
        .eq("id", editingShift.id);
    } else {
      request = supabase
        .from("shifts")
        .insert(databaseShift);
    }

    const { error } = await request;

    if (error) {
      console.error(error);

      setError(
        editingShift
          ? "Could not update your shift."
          : "Could not save your shift."
      );

      throw error;
    }

    setShowShiftForm(false);
    setEditingShift(null);

    setAnchorDate(
      new Date(
        `${shift.date}T12:00:00`
      )
    );

    await loadShifts();
  }

  async function deleteShift(
    shift: Shift
  ) {
    const confirmed =
      window.confirm(
        `Delete your ${shift.shiftType} shift from ${new Date(
          `${shift.date}T12:00:00`
        ).toLocaleDateString()}?`
      );

    if (!confirmed) {
      return;
    }

    setDeletingShiftId(shift.id);
    setError(null);

    const { error } = await supabase
      .from("shifts")
      .delete()
      .eq("id", shift.id);

    if (error) {
      console.error(error);

      setError(
        "Could not delete your shift."
      );

      setDeletingShiftId(null);
      return;
    }

    await loadShifts();

    setDeletingShiftId(null);
  }

  const filteredShifts =
    useMemo(
      () =>
        filterShiftsByPeriod(
          shifts,
          range,
          anchorDate
        ),
      [
        shifts,
        range,
        anchorDate,
      ]
    );

  const summary =
    useMemo(
      () =>
        getSummaryMetrics(
          filteredShifts,
          includeCashTips
        ),
      [
        filteredShifts,
        includeCashTips,
      ]
    );

  const previousAnchorDate =
    useMemo(
      () =>
        getPreviousPeriodDate(
          range,
          anchorDate
        ),
      [
        range,
        anchorDate,
      ]
    );

  const previousShifts =
    useMemo(
      () =>
        filterShiftsByPeriod(
          shifts,
          range,
          previousAnchorDate
        ),
      [
        shifts,
        range,
        previousAnchorDate,
      ]
    );

  const previousSummary =
    useMemo(
      () =>
        getSummaryMetrics(
          previousShifts,
          includeCashTips
        ),
      [
        previousShifts,
        includeCashTips,
      ]
    );

  const earningsComparison =
    useMemo(
      () =>
        getMetricChange(
          summary.totalEarnings,
          previousSummary.totalEarnings
        ),
      [
        summary.totalEarnings,
        previousSummary.totalEarnings,
      ]
    );

  const earningsPerHourComparison =
    useMemo(
      () =>
        getMetricChange(
          summary.earningsPerHour,
          previousSummary.earningsPerHour
        ),
      [
        summary.earningsPerHour,
        previousSummary.earningsPerHour,
      ]
    );

  const tipComparison =
    useMemo(
      () =>
        getMetricChange(
          summary.tipPercentage,
          previousSummary.tipPercentage
        ),
      [
        summary.tipPercentage,
        previousSummary.tipPercentage,
      ]
    );

  const comparisonLabel =
    range === "day"
      ? "yesterday"
      : range === "week"
        ? "last week"
        : range === "month"
          ? "last month"
          : "last year";

  const chartData =
    useMemo(
      () =>
        getMetricChartData(
          filteredShifts,
          range,
          chartMetric,
          includeCashTips
        ),
      [
        filteredShifts,
        range,
        chartMetric,
        includeCashTips,
      ]
    );

  const payPeriod =
    useMemo(
      () =>
        getPayPeriod(
          payPeriodAnchor
        ),
      [payPeriodAnchor]
    );

  const payPeriodShifts =
    useMemo(
      () =>
        getShiftsForPayPeriod(
          shifts,
          payPeriodAnchor
        ),
      [
        shifts,
        payPeriodAnchor,
      ]
    );

  const paycheckSummary =
    useMemo(
      () =>
        getSummaryMetrics(
          payPeriodShifts,
          false
        ),
      [payPeriodShifts]
    );

  function changeRange(
    newRange: TimeRange
  ) {
    setRange(newRange);
    setAnchorDate(new Date());

    if (newRange !== "month") {
      setMonthView("graph");
    }

    setShowPaycheck(false);
  }

  function openNewShift() {
    setEditingShift(null);
    setShowShiftForm(true);
  }

  function editShift(
    shift: Shift
  ) {
    setEditingShift(shift);
    setShowShiftForm(true);
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl space-y-5 px-4 pb-28 pt-5 sm:px-6 sm:py-8 md:pb-8">

        {/* HEADER */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              Dashboard
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-navy sm:text-3xl">
              Flacco Tips
            </h1>

            <p className="mt-1 text-sm text-muted">
              {getPeriodLabel(
                range,
                anchorDate
              )}
            </p>
          </div>

          {/* MOBILE FILTER BUTTON */}
          <button
            type="button"
            onClick={() =>
              setShowFilters(true)
            }
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-silver-light bg-white text-navy shadow-sm transition hover:bg-silver-light/40 md:hidden"
            aria-label="Dashboard options"
          >
            <SlidersHorizontal
              size={18}
            />
          </button>

          {/* DESKTOP LOG SHIFT */}
          <button
            type="button"
            onClick={openNewShift}
            className="hidden items-center gap-2 rounded-xl bg-navy px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-navy-light md:flex"
          >
            <Plus
              size={17}
              className="text-accent-red"
            />

            Log Shift
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* DESKTOP FILTERS */}
        <div className="hidden items-center justify-between gap-4 md:flex">
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

        {/* DESKTOP PERIOD NAVIGATION */}
        <div className="hidden items-center justify-center gap-3 md:flex">
          <PeriodNavigation
            range={range}
            anchorDate={anchorDate}
            onChange={setAnchorDate}
          />
        </div>

        {/* MOBILE PERIOD NAVIGATION */}
        <div className="flex items-center justify-center gap-3 md:hidden">
          <PeriodNavigation
            range={range}
            anchorDate={anchorDate}
            onChange={setAnchorDate}
            showRangeLabel
          />
        </div>

        {/* DAY */}
        {range === "day" && (
          <>
            {loading ? (
              <SimpleLoading />
            ) : (
              <DailySummary
                shifts={filteredShifts}
                includeCashTips={
                  includeCashTips
                }
                metric={
                  chartMetric
                }
                deletingShiftId={
                  deletingShiftId
                }
                onEdit={
                  editShift
                }
                onDelete={
                  deleteShift
                }
              />
            )}
          </>
        )}

        {/* WEEK */}
        {range === "week" && (
          <>

            <WeeklyOverview
              shifts={
                filteredShifts
              }
              anchorDate={
                anchorDate
              }
              includeCashTips={
                includeCashTips
              }
              metric={
                chartMetric
              }
            />

            <ChartSection
              loading={loading}
              shifts={
                filteredShifts
              }
              chartData={
                chartData
              }
              chartMetric={
                chartMetric
              }
              setChartMetric={
                setChartMetric
              }
            />

            <MetricCards
              totalEarnings={
                summary.totalEarnings
              }
              totalCardTips={
                summary.totalCardTips
              }
              totalCashTips={
                summary.totalCashTips
              }
              totalWages={
                summary.totalWages
              }
              earningsPerHour={
                summary.earningsPerHour
              }
              tipPercentage={
                summary.tipPercentage
              }
              earningsComparison={
                earningsComparison
              }
              earningsPerHourComparison={
                earningsPerHourComparison
              }
              tipComparison={
                tipComparison
              }
              comparisonLabel={
                comparisonLabel
              }
            />

            <PaycheckDropdown
              open={
                showPaycheck
              }
              onToggle={() =>
                setShowPaycheck(
                  (current) =>
                    !current
                )
              }
              label={
                payPeriod.label
              }
            >
              <PaycheckEstimate
                payPeriodLabel={
                  payPeriod.label
                }
                totalHours={
                  paycheckSummary.totalHours
                }
                totalWages={
                  paycheckSummary.totalWages
                }
                estimatedWithholdingRate={
                  0.0895
                }
                onPreviousPeriod={() =>
                  setPayPeriodAnchor(
                    (date) =>
                      movePayPeriod(
                        date,
                        -1
                      )
                  )
                }
                onNextPeriod={() =>
                  setPayPeriodAnchor(
                    (date) =>
                      movePayPeriod(
                        date,
                        1
                      )
                  )
                }
              />
            </PaycheckDropdown>
          </>
        )}

        {/* MONTH */}
        {range === "month" && (
          <>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                  Monthly View
                </p>

                <p className="mt-1 text-sm font-semibold text-navy">
                  {monthView ===
                  "graph"
                    ? "Performance Graph"
                    : "Calendar Overview"}
                </p>
              </div>

              <div className="inline-flex rounded-xl border border-silver-light bg-white p-1 shadow-sm">
                <button
                  type="button"
                  onClick={() =>
                    setMonthView(
                      "graph"
                    )
                  }
                  className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
                    monthView ===
                    "graph"
                      ? "bg-navy text-white"
                      : "text-muted hover:bg-silver-light/40"
                  }`}
                >
                  Graph
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setMonthView(
                      "calendar"
                    )
                  }
                  className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
                    monthView ===
                    "calendar"
                      ? "bg-navy text-white"
                      : "text-muted hover:bg-silver-light/40"
                  }`}
                >
                  Calendar
                </button>
              </div>
            </div>

            {monthView ===
            "graph" ? (
              <ChartSection
                loading={
                  loading
                }
                shifts={
                  filteredShifts
                }
                chartData={
                  chartData
                }
                chartMetric={
                  chartMetric
                }
                setChartMetric={
                  setChartMetric
                }
              />
            ) : loading ? (
              <SimpleLoading />
            ) : (
              <MonthlyCalendar
                shifts={
                  filteredShifts
                }
                anchorDate={
                  anchorDate
                }
                includeCashTips={
                  includeCashTips
                }
                metric={
                  chartMetric
                }
              />
            )}

            <MetricCards
              totalEarnings={
                summary.totalEarnings
              }
              totalCardTips={
                summary.totalCardTips
              }
              totalCashTips={
                summary.totalCashTips
              }
              totalWages={
                summary.totalWages
              }
              earningsPerHour={
                summary.earningsPerHour
              }
              tipPercentage={
                summary.tipPercentage
              }
              earningsComparison={
                earningsComparison
              }
              earningsPerHourComparison={
                earningsPerHourComparison
              }
              tipComparison={
                tipComparison
              }
              comparisonLabel={
                comparisonLabel
              }
            />

            <PaycheckDropdown
              open={
                showPaycheck
              }
              onToggle={() =>
                setShowPaycheck(
                  (current) =>
                    !current
                )
              }
              label="Weekly paycheck estimate"
            >
              <PaycheckEstimate
                payPeriodLabel={
                  payPeriod.label
                }
                totalHours={
                  paycheckSummary.totalHours
                }
                totalWages={
                  paycheckSummary.totalWages
                }
                estimatedWithholdingRate={
                  0.0895
                }
                onPreviousPeriod={() =>
                  setPayPeriodAnchor(
                    (date) =>
                      movePayPeriod(
                        date,
                        -1
                      )
                  )
                }
                onNextPeriod={() =>
                  setPayPeriodAnchor(
                    (date) =>
                      movePayPeriod(
                        date,
                        1
                      )
                  )
                }
              />
            </PaycheckDropdown>
          </>
        )}

        {/* YEAR */}
        {range === "year" && (
          <>
            <ChartSection
              loading={
                loading
              }
              shifts={
                filteredShifts
              }
              chartData={
                chartData
              }
              chartMetric={
                chartMetric
              }
              setChartMetric={
                setChartMetric
              }
            />

            <MetricCards
              totalEarnings={
                summary.totalEarnings
              }
              totalCardTips={
                summary.totalCardTips
              }
              totalCashTips={
                summary.totalCashTips
              }
              totalWages={
                summary.totalWages
              }
              earningsPerHour={
                summary.earningsPerHour
              }
              tipPercentage={
                summary.tipPercentage
              }
              earningsComparison={
                earningsComparison
              }
              earningsPerHourComparison={
                earningsPerHourComparison
              }
              tipComparison={
                tipComparison
              }
              comparisonLabel={
                comparisonLabel
              }
            />

            <YearHistory
              shifts={
                filteredShifts
              }
              includeCashTips={
                includeCashTips
              }
              open={
                showHistory
              }
              onToggle={() =>
                setShowHistory(
                  (current) =>
                    !current
                )
              }
              onEdit={
                editShift
              }
              onDelete={
                deleteShift
              }
              deletingShiftId={
                deletingShiftId
              }
            />
          </>
        )}
      </div>

      {/* MOBILE FLOATING LOG SHIFT */}
      <button
        type="button"
        onClick={
          openNewShift
        }
        className="fixed bottom-5 right-4 z-30 flex items-center gap-1.5 rounded-full bg-navy px-4 py-3 text-sm font-semibold text-white shadow-xl transition active:scale-95 md:hidden"
      >
        <Plus
          size={18}
          className="text-accent-red"
        />

        Log Shift
      </button>

      {/* MOBILE FILTER SHEET */}
      {showFilters && (
        <div
          className="fixed inset-0 z-50 bg-black/40 md:hidden"
          onClick={() =>
            setShowFilters(
              false
            )
          }
        >
          <div
            className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-white p-5 shadow-2xl"
            onClick={(
              event
            ) =>
              event.stopPropagation()
            }
          >
            <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-silver" />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                  Dashboard
                </p>

                <h2 className="mt-1 text-lg font-bold text-navy">
                  Options
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowFilters(
                    false
                  )
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-silver-light/60 text-navy"
                aria-label="Close options"
              >
                <X
                  size={18}
                />
              </button>
            </div>

            <div className="mt-6 space-y-6">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                  Time Period
                </p>

                <TimeRangeSelector
                  range={
                    range
                  }
                  onChange={
                    changeRange
                  }
                />
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                  Tip Data
                </p>

                <CashTipsToggle
                  includeCashTips={
                    includeCashTips
                  }
                  onChange={
                    setIncludeCashTips
                  }
                />
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowFilters(
                    false
                  )
                }
                className="w-full rounded-xl bg-navy py-3 text-sm font-semibold text-white"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOG / EDIT SHIFT MODAL */}
      {showShiftForm && (
        <div className="fixed inset-0 z-50 bg-black/40">
          <div className="absolute inset-x-0 bottom-0 flex max-h-[92dvh] w-full max-w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:max-w-2xl sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl">
            <div className="flex shrink-0 items-start justify-between border-b border-silver-light px-5 py-5 sm:px-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                  {editingShift
                    ? "Update Entry"
                    : "New Entry"}
                </p>

                <h2 className="mt-1 text-xl font-bold text-navy">
                  {editingShift
                    ? "Edit Shift"
                    : "Log Shift"}
                </h2>

                <p className="mt-1 text-sm text-muted">
                  {editingShift
                    ? "Update your shift details."
                    : "Enter your shift details."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowShiftForm(
                    false
                  );

                  setEditingShift(
                    null
                  );
                }}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-silver-light/60 text-navy"
                aria-label="Close"
              >
                <X
                  size={18}
                />
              </button>
            </div>

            <div className="min-h-0 w-full min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
              <ShiftForm
                key={
                  editingShift?.id ??
                  "new-shift"
                }
                mode={
                  editingShift
                    ? "edit"
                    : "create"
                }
                initialData={
                  editingShift
                    ? {
                        date:
                          editingShift.date,

                        shiftType:
                          editingShift.shiftType,

                        hoursWorked:
                          editingShift.hoursWorked,

                        tablesServed:
                          editingShift.tablesServed,

                        totalSales:
                          editingShift.totalSales,

                        cardTips:
                          editingShift.cardTips,

                        reportedTips:
                          editingShift.reportedTips,

                        cashTips:
                          editingShift.cashTips,

                        tipOut:
                          editingShift.tipOut,

                        hourlyWage:
                          editingShift.hourlyWage,
                      }
                    : undefined
                }
                onSave={
                  saveShift
                }
                onCancel={() => {
                  setShowShiftForm(
                    false
                  );

                  setEditingShift(
                    null
                  );
                }}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

type PeriodNavigationProps = {
  range: TimeRange;
  anchorDate: Date;
  onChange: (
    date: Date
  ) => void;
  showRangeLabel?: boolean;
};

function PeriodNavigation({
  range,
  anchorDate,
  onChange,
  showRangeLabel = false,
}: PeriodNavigationProps) {
  return (
    <>
      <button
        type="button"
        onClick={() =>
          onChange(
            movePeriod(
              range,
              anchorDate,
              -1
            )
          )
        }
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-silver-light bg-white text-navy shadow-sm transition hover:bg-silver-light/40 active:scale-95"
        aria-label="Previous period"
      >
        <ChevronLeft
          size={18}
        />
      </button>

      <div className="min-w-[155px] text-center">
        <p className="text-sm font-semibold text-navy">
          {getPeriodLabel(
            range,
            anchorDate
          )}
        </p>

        {showRangeLabel && (
          <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
            {range}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() =>
          onChange(
            movePeriod(
              range,
              anchorDate,
              1
            )
          )
        }
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-silver-light bg-white text-navy shadow-sm transition hover:bg-silver-light/40 active:scale-95"
        aria-label="Next period"
      >
        <ChevronRight
          size={18}
        />
      </button>
    </>
  );
}

type ChartSectionProps = {
  loading: boolean;
  shifts: Shift[];
  chartData: ReturnType<
    typeof getMetricChartData
  >;
  chartMetric: ChartMetric;
  setChartMetric: (
    metric: ChartMetric
  ) => void;
};

function ChartSection({
  loading,
  shifts,
  chartData,
  chartMetric,
  setChartMetric,
}: ChartSectionProps) {
  if (loading) {
    return (
      <SimpleLoading />
    );
  }

  if (
    shifts.length === 0
  ) {
    return (
      <div className="flex h-[360px] items-center justify-center rounded-2xl border border-silver-light bg-white">
        <p className="text-muted">
          No shifts logged for this period.
        </p>
      </div>
    );
  }

  return (
    <AnalyticsChart
      data={chartData}
      metric={chartMetric}
      onMetricChange={
        setChartMetric
      }
    />
  );
}

function SimpleLoading() {
  return (
    <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-silver-light bg-white">
      <p className="text-muted">
        Loading shifts...
      </p>
    </div>
  );
}

type PaycheckDropdownProps = {
  open: boolean;
  onToggle: () => void;
  label: string;
  children: ReactNode;
};

function PaycheckDropdown({
  open,
  onToggle,
  label,
  children,
}: PaycheckDropdownProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-silver-light bg-white shadow-sm">
      <button
        type="button"
        onClick={
          onToggle
        }
        className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-silver-light/20"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            Paycheck
          </p>

          <h2 className="mt-1 font-semibold text-navy">
            Estimate
          </h2>

          <p className="mt-1 text-xs text-muted">
            {label}
          </p>
        </div>

        <ChevronDown
          size={19}
          className={`text-navy transition-transform duration-200 ${
            open
              ? "rotate-180"
              : ""
          }`}
        />
      </button>

      {open && (
        <div className="border-t border-silver-light p-3 sm:p-4">
          {children}
        </div>
      )}
    </div>
  );
}

type YearHistoryProps = {
  shifts: Shift[];
  includeCashTips: boolean;
  open: boolean;
  onToggle: () => void;
  onEdit: (
    shift: Shift
  ) => void;
  onDelete: (
    shift: Shift
  ) => void;
  deletingShiftId:
    | string
    | null;
};

function YearHistory({
  shifts,
  includeCashTips,
  open,
  onToggle,
  onEdit,
  onDelete,
  deletingShiftId,
}: YearHistoryProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-silver-light bg-white shadow-sm">
      <button
        type="button"
        onClick={
          onToggle
        }
        className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-silver-light/20"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            History
          </p>

          <h2 className="mt-1 font-semibold text-navy">
            Recent Shifts
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-muted">
            {shifts.length}{" "}
            {shifts.length ===
            1
              ? "shift"
              : "shifts"}
          </span>

          <ChevronDown
            size={19}
            className={`text-navy transition-transform duration-200 ${
              open
                ? "rotate-180"
                : ""
            }`}
          />
        </div>
      </button>

      {open && (
        <div className="border-t border-silver-light">
          {shifts.length ===
          0 ? (
            <div className="p-8 text-center text-muted">
              No shifts for this period.
            </div>
          ) : (
            <div className="divide-y divide-silver-light">
              {[...shifts]
                .reverse()
                .map(
                  (
                    shift
                  ) => {
                    const metrics =
                      getShiftMetrics(
                        shift,
                        includeCashTips
                      );

                    return (
                      <div
                        key={
                          shift.id
                        }
                        className="px-5 py-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-semibold capitalize text-navy">
                              {
                                shift.shiftType
                              }
                            </p>

                            <p className="mt-0.5 text-xs text-muted">
                              {new Date(
                                `${shift.date}T12:00:00`
                              ).toLocaleDateString()}
                            </p>
                          </div>

                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={() =>
                                onEdit(
                                  shift
                                )
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition hover:bg-silver-light/50 hover:text-navy"
                              aria-label="Edit shift"
                            >
                              <Pencil
                                size={
                                  15
                                }
                              />
                            </button>

                            <button
                              type="button"
                              disabled={
                                deletingShiftId ===
                                shift.id
                              }
                              onClick={() =>
                                onDelete(
                                  shift
                                )
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition hover:bg-red-50 hover:text-accent-red disabled:opacity-40"
                              aria-label="Delete shift"
                            >
                              <Trash2
                                size={
                                  15
                                }
                              />
                            </button>
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                          <HistoryStat
                            label="Hours"
                            value={shift.hoursWorked.toFixed(
                              2
                            )}
                          />

                          <HistoryStat
                            label="Sales"
                            value={`$${shift.totalSales.toFixed(
                              2
                            )}`}
                          />

                          <HistoryStat
                            label="Tips"
                            value={`$${metrics.netTips.toFixed(
                              2
                            )}`}
                          />

                          <HistoryStat
                            label="Earnings"
                            value={`$${metrics.totalEarnings.toFixed(
                              2
                            )}`}
                          />
                        </div>
                      </div>
                    );
                  }
                )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function HistoryStat({
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