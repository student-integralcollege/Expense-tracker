import React from "react";
import { Wallet, ArrowDownRight, PiggyBank, TrendingUp, TrendingDown } from "lucide-react";
import { formatCurrency } from "../../utils/format";

export function MiniSummaryCards({ balance, expenses, savings, income, isDemoMode }) {
  const displayIncome = income !== undefined ? income : (isDemoMode ? 50000 : 0);

  const getCardPercentageVal = (title) => {
    if (isDemoMode) {
      if (title === "Total Balance") return 81;
      if (title === "This Month Expenses") return 19;
      return 81; // Savings rate is 81%
    }
    if (displayIncome <= 0) return 0;
    if (title === "Total Balance") return Math.min(Math.round((balance / displayIncome) * 100), 100);
    if (title === "This Month Expenses") return Math.min(Math.round((expenses / displayIncome) * 100), 100);
    return Math.min(Math.round((savings / displayIncome) * 100), 100);
  };

  const cards = [
    {
      title: "Total Balance",
      value: balance,
      percentage: isDemoMode ? "+4.2%" : "0%",
      isPositive: true,
      color: "teal",
      icon: Wallet,
      footerText: isDemoMode ? "Healthy balance buffer" : "Current balance buffer",
      footerColor: "bg-teal-500",
      percentVal: getCardPercentageVal("Total Balance"),
    },
    {
      title: "This Month Expenses",
      value: expenses,
      percentage: isDemoMode ? "-2.4%" : "0%",
      isPositive: false,
      color: "orange",
      icon: ArrowDownRight,
      footerText: isDemoMode ? "Within monthly budget limit" : "Of monthly income spent",
      footerColor: "bg-orange-500",
      percentVal: getCardPercentageVal("This Month Expenses"),
    },
    {
      title: "This Month Savings",
      value: savings,
      percentage: isDemoMode ? "+15.8%" : "0%",
      isPositive: true,
      color: "blue",
      icon: PiggyBank,
      footerText: isDemoMode ? "Savings goal tracking high" : "Net savings rate",
      footerColor: "bg-blue-500",
      percentVal: getCardPercentageVal("This Month Savings"),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        const colorMap = {
          teal: {
            bg: "bg-teal-50",
            iconBg: "bg-teal-100 text-teal-600",
            border: "border-teal-100",
            text: "text-teal-600",
            chip: "bg-teal-50 text-teal-700 border-teal-200",
          },
          orange: {
            bg: "bg-orange-50/50",
            iconBg: "bg-orange-100 text-orange-600",
            border: "border-orange-100",
            text: "text-orange-600",
            chip: "bg-orange-50 text-orange-700 border-orange-200",
          },
          blue: {
            bg: "bg-blue-50/50",
            iconBg: "bg-blue-100 text-blue-600",
            border: "border-blue-100",
            text: "text-blue-600",
            chip: "bg-blue-50 text-blue-700 border-blue-200",
          },
        };
        const style = colorMap[card.color];

        return (
          <div
            key={idx}
            className={`rounded-[16px] bg-white p-6 border border-slate-100 shadow-premium hover:shadow-premium-hover hover:-translate-y-0.5 transition-premium flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${style.iconBg} transition-transform hover:scale-110 duration-200`}>
                  <Icon size={20} />
                </div>
                <span
                  className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${
                    card.isPositive ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"
                  }`}
                >
                  {card.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {card.percentage}
                </span>
              </div>

              <span className="text-slate-400 text-xs font-medium uppercase tracking-wider block mb-1">
                {card.title}
              </span>
              <h4 className="text-2xl md:text-3xl font-bold font-outfit text-slate-800 tracking-tight">
                {formatCurrency(card.value)}
              </h4>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{card.footerText}</span>
                <span className={`font-semibold ${style.text}`}>{card.percentVal}%</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${card.footerColor}`} style={{ width: `${card.percentVal}%` }}></div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
