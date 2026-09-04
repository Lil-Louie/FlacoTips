"use client";

import { FormEvent, useState } from "react";

type ShiftFormData = {
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

type Props = {
  onSave: (shift: ShiftFormData) => Promise<void>;
  onCancel: () => void;
};

export default function ShiftForm({
  onSave,
  onCancel,
}: Props) {
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    shiftType: "lunch" as
      | "lunch"
      | "dinner"
      | "double",
    hoursWorked: "",
    tablesServed: "",
    totalSales: "",
    creditTips: "",
    cashTips: "",
    tipOut: "",
    hourlyWage: "16.90",
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

        shiftType: form.shiftType,

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
    "mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none transition focus:border-black";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium">
          Date

          <input
            type="date"
            required
            value={form.date}
            onChange={(e) =>
              updateField("date", e.target.value)
            }
            className={inputClass}
          />
        </label>

        <label className="text-sm font-medium">
          Shift

          <select
            value={form.shiftType}
            onChange={(e) =>
              updateField(
                "shiftType",
                e.target.value
              )
            }
            className={inputClass}
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

        <label className="text-sm font-medium">
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

        <label className="text-sm font-medium">
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

        <label className="text-sm font-medium">
          Total Sales

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              $
            </span>

            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="850.00"
              value={form.totalSales}
              onChange={(e) =>
                updateField(
                  "totalSales",
                  e.target.value
                )
              }
              className={`${inputClass} pl-7`}
            />
          </div>
        </label>

        <label className="text-sm font-medium">
          Credit Tips

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              $
            </span>

            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="150.00"
              value={form.creditTips}
              onChange={(e) =>
                updateField(
                  "creditTips",
                  e.target.value
                )
              }
              className={`${inputClass} pl-7`}
            />
          </div>
        </label>

        <label className="text-sm font-medium">
          Cash Tips

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              $
            </span>

            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="35.00"
              value={form.cashTips}
              onChange={(e) =>
                updateField(
                  "cashTips",
                  e.target.value
                )
              }
              className={`${inputClass} pl-7`}
            />
          </div>
        </label>

        <label className="text-sm font-medium">
          Tip Out

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              $
            </span>

            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="20.00"
              value={form.tipOut}
              onChange={(e) =>
                updateField(
                  "tipOut",
                  e.target.value
                )
              }
              className={`${inputClass} pl-7`}
            />
          </div>
        </label>

        <label className="text-sm font-medium">
          Hourly Wage

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              $
            </span>

            <input
              type="number"
              step="0.01"
              min="0"
              value={form.hourlyWage}
              onChange={(e) =>
                updateField(
                  "hourlyWage",
                  e.target.value
                )
              }
              className={`${inputClass} pl-7`}
            />
          </div>
        </label>
      </div>

      <div className="flex justify-end gap-3 border-t pt-5">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : "Save Shift"}
        </button>
      </div>
    </form>
  );
}