import React from "react";
import { formatCurrency } from "../../utils/format";

export function SpendingCategoryCard({ categories, totalIncome, totalExpenses, isDemoMode }) {
  const displayIncome = totalIncome !== undefined ? totalIncome : (isDemoMode ? 50000 : 0);
  const displayExpenses = totalExpenses !== undefined ? totalExpenses : (isDemoMode ? 9595 : 0);

  // If demo mode or no categories, render Food -> $9595 in Demo, or empty list in Live Mode
  const catItems = isDemoMode
    ? ((!categories || categories.length === 0)
        ? [
            {
              category: "Food",
              total: 9595,
              color: "bg-orange-500",
              percent: 100,
            },
          ]
        : categories.map((cat, idx) => {
            const colors = ["bg-orange-500", "bg-teal-500", "bg-blue-500", "bg-violet-500", "bg-pink-500"];
            const maxExpense = Math.max(...categories.map(c => c.total), 1);
            return {
              category: cat.category,
              total: cat.total,
              color: colors[idx % colors.length],
              percent: Math.round((cat.total / maxExpense) * 100),
            };
          }))
    : ((!categories || categories.length === 0)
        ? []
        : categories.map((cat, idx) => {
            const colors = ["bg-orange-500", "bg-teal-500", "bg-blue-500", "bg-violet-500", "bg-pink-500"];
            const maxExpense = Math.max(...categories.map(c => c.total), 1);
            return {
              category: cat.category,
              total: cat.total,
              color: colors[idx % colors.length],
              percent: Math.round((cat.total / maxExpense) * 100),
            };
          }));

  return (
    <div className="flex flex-col gap-6">
      {/* Spending by Category Card */}
      <section className="bg-white rounded-[16px] border border-slate-100 p-6 shadow-premium hover:shadow-premium-hover transition-premium">
        <h4 className="text-lg font-bold font-outfit text-slate-800 mb-5">
          Spending by Category
        </h4>

        <div className="flex flex-col gap-4">
          {catItems.length === 0 ? (
            <p className="text-xs text-slate-400 font-semibold py-6 text-center">
              No categories yet. Add an expense transaction.
            </p>
          ) : (
            catItems.map((item, idx) => (
              <div key={idx} className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-slate-700">{item.category}</span>
                  <span className="font-bold font-outfit text-slate-800">
                    {formatCurrency(item.total)}
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                    style={{ width: `${item.percent}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>Usage rate</span>
                  <span>{item.percent}%</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Bottom Comparison Cards */}
      <section className="grid grid-cols-2 gap-4">
        {/* Total Income Card */}
        <div className="bg-white border border-slate-100 p-5 rounded-[16px] shadow-premium hover:shadow-premium-hover transition-premium flex flex-col justify-between min-h-[110px]">
          <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">
            Total Income
          </span>
          <strong className="text-xl md:text-2xl font-bold font-outfit text-emerald-600 mt-2 block tracking-tight">
            {formatCurrency(displayIncome)}
          </strong>
        </div>

        {/* Total Expenses Card */}
        <div className="bg-white border border-slate-100 p-5 rounded-[16px] shadow-premium hover:shadow-premium-hover transition-premium flex flex-col justify-between min-h-[110px]">
          <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">
            Total Expenses
          </span>
          <strong className="text-xl md:text-2xl font-bold font-outfit text-orange-600 mt-2 block tracking-tight">
            {formatCurrency(displayExpenses)}
          </strong>
        </div>
      </section>
    </div>
  );
}
