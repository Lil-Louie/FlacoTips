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
  totalCardTips: number;
  totalCashTips: number;
  totalWages: number;
  earningsPerHour: number;
  tipPercentage: number;

  earningsComparison?: Comparison;
  earningsPerHourComparison?: Comparison;
  tipComparison?: Comparison;

  comparisonLabel?: string;
};

export default function MetricCards({
  totalEarnings,
  totalCardTips,
  totalCashTips,
  totalWages,
  earningsPerHour,
  tipPercentage,

  earningsComparison,
  earningsPerHourComparison,
  tipComparison,

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
      label: "Card Tips",
      value: `$${totalCardTips.toFixed(2)}`,
    },
    {
      label: "Cash Tips",
      value: `$${totalCashTips.toFixed(2)}`,
    },
    {
      label: "Wages",
      value: `$${totalWages.toFixed(2)}`,
    },
    {
      label: "Earnings / Hour",
      value: `$${earningsPerHour.toFixed(2)}`,
      comparison: earningsPerHourComparison,
      comparisonType: "percent" as const,
    },
    {
      label: "Tip Percentage",
      value: `${tipPercentage.toFixed(1)}%`,
      comparison: tipComparison,
      comparisonType: "difference" as const,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {cards.map((card, index) => (
        <div
          key={card.label}
          className="group relative overflow-hidden rounded-2xl border border-silver-light bg-card p-4 transition duration-200 hover:-translate-y-0.5 hover:border-silver hover:shadow-md"
        >

          {index === 0 && (
            <div className="absolute right-4 top-4 h-2 w-2 rounded-full bg-accent-red" />
          )}

          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted sm:text-xs">
            {card.label}
          </p>

          <p className="mt-2 text-xl font-bold tracking-tight text-navy sm:text-2xl">
            {card.value}
          </p>

          {card.comparison && (
            <ComparisonText
              comparison={card.comparison}
              type={card.comparisonType}
              label={comparisonLabel}
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
  type: "percent" | "difference";
  label: string;
}) {
  const positive =
    comparison.difference > 0;

  const negative =
    comparison.difference < 0;

  const neutral =
    comparison.difference === 0;

  const text =
    type === "percent"
      ? `${Math.abs(
          comparison.percent
        ).toFixed(1)}%`
      : `${Math.abs(
          comparison.difference
        ).toFixed(1)} pts`;

  return (
    <div className="mt-3 flex items-center gap-1">
      {positive && (
        <ArrowUpRight
          size={13}
          className="text-navy"
        />
      )}

      {negative && (
        <ArrowDownRight
          size={13}
          className="text-accent-red"
        />
      )}

      {neutral && (
        <Minus
          size={13}
          className="text-muted"
        />
      )}

      <p
        className={`text-[10px] font-semibold sm:text-[11px] ${
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