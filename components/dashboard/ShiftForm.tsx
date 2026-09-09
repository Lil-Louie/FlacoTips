"use client";

import { FormEvent, useState } from "react";

import type { Shift } from "@/lib/analytics";

type ShiftFormData = Omit<Shift, "id">;

type Props = {
  onSave: (shift: ShiftFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: ShiftFormData;
  mode?: "create" | "edit";
};

export default function ShiftForm({
  onSave,
  onCancel,
  initialData,
  mode = "create",
}: Props) {
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    date:
      initialData?.date ??
      new Date().toISOString().slice(0, 10),

    shiftType:
      initialData?.shiftType ?? "lunch",

    hoursWorked:
      initialData?.hoursWorked.toString() ?? "",

    tablesServed:
      initialData?.tablesServed.toString() ?? "",

    totalSales:
      initialData?.totalSales.toString() ?? "",

    creditTips:
      initialData?.creditTips.toString() ?? "",

    cashTips:
      initialData?.cashTips.toString() ?? "",

    tipOut:
      initialData?.tipOut.toString() ?? "",

    hourlyWage:
      initialData?.hourlyWage.toString() ?? "16.90",
  });

  function updateField(
    field: keyof typeof form,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);

    try {
      await onSave({
        date: form.date,

        shiftType: form.shiftType as
          | "lunch"
          | "dinner"
          | "double",

        hoursWorked:
          Number(form.hoursWorked) || 0,

        tablesServed:
          Number(form.tablesServed) || 0,

        totalSales:
          Number(form.totalSales) || 0,

        creditTips:
          Number(form.creditTips) || 0,

        cashTips:
          Number(form.cashTips) || 0,

        tipOut:
          Number(form.tipOut) || 0,

        hourlyWage:
          Number(form.hourlyWage) || 0,
      });
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "mt-1 block w-full min-w-0 max-w-full rounded-xl border border-silver-light bg-white px-3 py-2.5 text-base text-navy outline-none transition focus:border-navy focus:ring-2 focus:ring-navy/10";

  const labelClass =
    "block min-w-0 text-sm font-medium text-navy";

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full min-w-0 max-w-full overflow-x-hidden space-y-5 pb-[env(safe-area-inset-bottom)]"
    >
      <div className="grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          Date

          <input
            type="date"
            required
            value={form.date}
            onChange={(e) =>
              updateField(
                "date",
                e.target.value
              )
            }
            className={`${inputClass} appearance-none`}
          />
        </label>

        <label className={labelClass}>
          Shift

          <select
            value={form.shiftType}
            onChange={(e) =>
              updateField(
                "shiftType",
                e.target.value
              )
            }
            className={`${inputClass} appearance-none`}
          >
            <option value="lunch">
              Lunch
            </option>

            <option value="dinner">
              Dinner
            </option>

            <option value="double">
              Double
            </option>
          </select>
        </label>

        <label className={labelClass}>
          Hours Worked

          <input
            type="number"
            step="0.01"
            min="0"
            required
            placeholder="5.5"
            value={form.hoursWorked}
            onChange={(e) =>
              updateField(
                "hoursWorked",
                e.target.value
              )
            }
            className={inputClass}
          />
        </label>

        <label className={labelClass}>
          Tables Served

          <input
            type="number"
            min="0"
            placeholder="18"
            value={form.tablesServed}
            onChange={(e) =>
              updateField(
                "tablesServed",
                e.target.value
              )
            }
            className={inputClass}
          />
        </label>

        <MoneyInput
          label="Total Sales"
          value={form.totalSales}
          onChange={(value) =>
            updateField(
              "totalSales",
              value
            )
          }
          inputClass={inputClass}
          labelClass={labelClass}
        />

        <MoneyInput
          label="Credit Tips"
          value={form.creditTips}
          onChange={(value) =>
            updateField(
              "creditTips",
              value
            )
          }
          inputClass={inputClass}
          labelClass={labelClass}
        />

        <MoneyInput
          label="Cash Tips"
          value={form.cashTips}
          onChange={(value) =>
            updateField(
              "cashTips",
              value
            )
          }
          inputClass={inputClass}
          labelClass={labelClass}
        />

        <MoneyInput
          label="Tip Out"
          value={form.tipOut}
          onChange={(value) =>
            updateField(
              "tipOut",
              value
            )
          }
          inputClass={inputClass}
          labelClass={labelClass}
        />

        <MoneyInput
          label="Hourly Wage"
          value={form.hourlyWage}
          onChange={(value) =>
            updateField(
              "hourlyWage",
              value
            )
          }
          inputClass={inputClass}
          labelClass={labelClass}
        />
      </div>

      <div className="flex w-full justify-end gap-3 border-t border-silver-light pt-5">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="rounded-xl border border-silver-light px-4 py-2.5 text-sm font-semibold text-navy transition hover:bg-silver-light/30 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-light disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : mode === "edit"
              ? "Save Changes"
              : "Save Shift"}
        </button>
      </div>
    </form>
  );
}

type MoneyInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  inputClass: string;
  labelClass: string;
};

function MoneyInput({
  label,
  value,
  onChange,
  inputClass,
  labelClass,
}: MoneyInputProps) {
  return (
    <label className={labelClass}>
      {label}

      <div className="relative w-full min-w-0">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
          $
        </span>

        <input
          type="number"
          step="0.01"
          min="0"
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          className={`${inputClass} pl-7`}
        />
      </div>
    </label>
  );
}