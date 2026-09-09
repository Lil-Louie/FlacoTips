import {
  ArrowDownRight,
  ArrowUpRight,
  Minus,
} from "lucide-react";

type Comparison = {
  percent: number;
  difference: number;
};

type Props = {
  totalEarnings: number;
  earningsPerHour: number;
  tipPercentage: number;
  totalTables: number;

  earningsComparison?: Comparison;
  earningsPerHourComparison?: Comparison;
  tipComparison?: Comparison;
  tablesComparison?: Comparison;

  comparisonLabel?: string;
};

export default function MetricCards({
  totalEarnings,
  earningsPerHour,
  tipPercentage,
  totalTables,

  earningsComparison,
  earningsPerHourComparison,
  tipComparison,
  tablesComparison,

  comparisonLabel = "previous period",
}: Props) {
  const cards = [
    {
      label: "Total Earnings",
      value: `$${totalEarnings.toFixed(2)}`,
      comparison: earningsComparison,
      comparisonType: "percent" as const,
    },
    {
      label: "Earnings / Hour",
      value: `$${earningsPerHour.toFixed(2)}`,
      comparison:
        earningsPerHourComparison,
      comparisonType: "percent" as const,
    },
    {
      label: "Average Tip",
      value: `${tipPercentage.toFixed(1)}%`,
      comparison: tipComparison,
      comparisonType: "difference" as const,
    },
    {
      label: "Tables Served",
      value: totalTables.toString(),
      comparison: tablesComparison,
      comparisonType: "difference" as const,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {cards.map((card, index) => (
        <div
          key={card.label}
          className="group relative overflow-hidden rounded-2xl border border-silver-light bg-card p-4 transition duration-200 hover:-translate-y-0.5 hover:border-silver hover:shadow-md sm:p-5"
        >
          <div className="absolute left-0 top-0 h-full w-1 bg-navy" />

          {index === 0 && (
            <div className="absolute right-4 top-4 h-2 w-2 rounded-full bg-accent-red" />
          )}

          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted sm:text-xs sm:tracking-[0.14em]">
            {card.label}
          </p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-navy sm:mt-3 sm:text-3xl">
            {card.value}
          </p>

          {card.comparison && (
            <ComparisonText
              comparison={
                card.comparison
              }
              type={
                card.comparisonType
              }
              label={
                comparisonLabel
              }
            />
          )}
        </div>
      ))}
    </div>
  );
}

function ComparisonText({
  comparison,
  type,
  label,
}: {
  comparison: Comparison;
  type:
    | "percent"
    | "difference";
  label: string;
}) {
  const positive =
    comparison.difference > 0;

  const negative =
    comparison.difference < 0;

  const neutral =
    comparison.difference === 0;

  let text = "";

  if (type === "percent") {
    text = `${Math.abs(
      comparison.percent
    ).toFixed(1)}%`;
  } else {
    text = `${Math.abs(
      comparison.difference
    ).toFixed(1)}`;
  }

  return (
    <div className="mt-3 flex items-center gap-1.5">
      {positive && (
        <ArrowUpRight
          size={14}
          className="text-navy"
        />
      )}

      {negative && (
        <ArrowDownRight
          size={14}
          className="text-accent-red"
        />
      )}

      {neutral && (
        <Minus
          size={14}
          className="text-muted"
        />
      )}

      <p
        className={`text-[11px] font-semibold sm:text-xs ${
          negative
            ? "text-accent-red"
            : positive
              ? "text-navy"
              : "text-muted"
        }`}
      >
        {text}
        <span className="ml-1 font-normal text-muted">
          vs {label}
        </span>
      </p>
    </div>
  );
}