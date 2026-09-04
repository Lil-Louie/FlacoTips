import type { TimeRange } from "@/lib/analytics";

type Props = {
  range: TimeRange;
  onChange: (range: TimeRange) => void;
};

const ranges: TimeRange[] = [
  "day",
  "week",
  "month",
  "year",
];

export default function TimeRangeSelector({
  range,
  onChange,
}: Props) {
  return (
    <div className="inline-flex rounded-lg border bg-white p-1">
      {ranges.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onChange(item)}
          className={`rounded-md px-4 py-2 text-sm font-medium capitalize transition ${
            range === item
              ? "bg-black text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}