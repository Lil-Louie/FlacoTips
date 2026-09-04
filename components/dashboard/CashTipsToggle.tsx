type Props = {
    includeCashTips: boolean;
    onChange: (value: boolean) => void;
  };
  
  export default function CashTipsToggle({
    includeCashTips,
    onChange,
  }: Props) {
    return (
      <div className="inline-flex rounded-lg border bg-white p-1">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`rounded-md px-4 py-2 text-sm font-medium transition ${
            includeCashTips
              ? "bg-black text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          All Tips
        </button>
  
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`rounded-md px-4 py-2 text-sm font-medium transition ${
            !includeCashTips
              ? "bg-black text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Card Only
        </button>
      </div>
    );
  }