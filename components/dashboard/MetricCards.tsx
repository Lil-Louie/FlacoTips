type Props = {
    totalEarnings: number;
    earningsPerHour: number;
    tipPercentage: number;
    totalTables: number;
  };
  
  export default function MetricCards({
    totalEarnings,
    earningsPerHour,
    tipPercentage,
    totalTables,
  }: Props) {
    const cards = [
      {
        label: "Total Earnings",
        value: `$${totalEarnings.toFixed(2)}`,
      },
      {
        label: "Earnings / Hour",
        value: `$${earningsPerHour.toFixed(2)}`,
      },
      {
        label: "Average Tip",
        value: `${tipPercentage.toFixed(1)}%`,
      },
      {
        label: "Tables Served",
        value: totalTables.toString(),
      },
    ];
  
    return (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-gray-500">
              {card.label}
            </p>
  
            <p className="mt-2 text-2xl font-semibold text-gray-900">
              {card.value}
            </p>
          </div>
        ))}
      </div>
    );
  }