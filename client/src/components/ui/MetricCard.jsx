import React from "react";
import { ArrowDownRight, ArrowUpRight, PiggyBank, Wallet } from "lucide-react";
import { formatCurrency } from "../../utils/format";

export function MetricCard({ label, value, tone = "default", format = "currency", trendText, trendValue, statusLabel }) {
  const displayValue = format === "currency" ? formatCurrency(value) : value;

  // Select icons based on label
  const getIconAndBadges = () => {
    switch (label) {
      case "Total Balance":
        return {
          icon: Wallet,
          badgeBg: "bg-teal-100 text-teal-600",
          trendColor: "text-emerald-600",
          subContent: trendText || "+$2,150 this week",
        };
      case "Monthly Income":
        return {
          icon: ArrowUpRight,
          badgeBg: "bg-emerald-100 text-emerald-600",
          trendColor: "text-emerald-600",
          subContent: trendValue ? `+${trendValue}% vs last month` : "+12.4% vs last month",
        };
      case "Monthly Expenses":
        return {
          icon: ArrowDownRight,
          badgeBg: "bg-orange-100 text-orange-600",
          trendColor: "text-orange-600",
          subContent: trendValue ? `+${trendValue}% vs last month` : "+8.2% vs last month",
        };
      case "Savings Rate":
        return {
          icon: PiggyBank,
          badgeBg: "bg-blue-100 text-blue-600",
          trendColor: "text-blue-600",
          subContent: statusLabel || "Excellent",
        };
      default:
        return {
          icon: Wallet,
          badgeBg: "bg-slate-100 text-slate-600",
          trendColor: "text-slate-500",
          subContent: "Monthly data",
        };
    }
  };

  const { icon: Icon, badgeBg, trendColor, subContent } = getIconAndBadges();

  return (
    <article className="bg-white rounded-[16px] border border-slate-100 p-5 shadow-premium hover:shadow-premium-hover transition-premium hover:-translate-y-0.5 flex flex-col justify-between h-36">
      <div className="flex items-center justify-between">
        <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
          {label}
        </span>
        <span className={`p-2.5 rounded-xl ${badgeBg} transition-transform hover:rotate-12 duration-200`}>
          <Icon size={18} />
        </span>
      </div>

      <div className="mt-3">
        <strong className="text-2xl font-bold font-outfit text-slate-800 tracking-tight block">
          {displayValue}
        </strong>
        <p className={`text-xs font-medium mt-1 ${trendColor}`}>
          {subContent}
        </p>
      </div>
    </article>
  );
}
