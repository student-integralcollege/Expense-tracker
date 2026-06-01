import React from "react";
import { ArrowUpRight, ArrowDownRight, ArrowRight } from "lucide-react";
import { formatCurrency } from "../../utils/format";

export function RecentTransactionsList({ transactions, onViewAllClick, isDemoMode }) {
  // If demo mode or no transactions, render the clone data in Demo, or empty list in Live Mode
  const listItems = isDemoMode
    ? ((!transactions || transactions.length === 0)
        ? [
            {
              id: "t1",
              title: "Salary",
              category: "Income",
              amount: 50000,
              type: "income",
              date: "25/04/2026",
            },
            {
              id: "t2",
              title: "Dhdj",
              category: "Food",
              amount: 9595,
              type: "expense",
              date: "25/04/2026",
            },
          ]
        : transactions.slice(0, 5))
    : ((!transactions || transactions.length === 0)
        ? []
        : transactions.slice(0, 5));

  return (
    <section className="bg-white rounded-[16px] border border-slate-100 p-6 shadow-premium hover:shadow-premium-hover transition-premium flex flex-col justify-between">
      <div>
        <h4 className="text-lg font-bold font-outfit text-slate-800 mb-5">
          Recent Transactions
        </h4>

        <div className="flex flex-col gap-3">
          {listItems.length === 0 ? (
            <p className="text-xs text-slate-400 font-semibold py-8 text-center">
              No transactions recorded yet.
            </p>
          ) : (
            listItems.map((tx) => {
              const isIncome = tx.type === "income" || tx.type === "Income";
              return (
                <div
                  key={tx.id || tx._id}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-50 hover:bg-slate-50 transition-premium"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2.5 rounded-xl shrink-0 ${
                        isIncome ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"
                      }`}
                    >
                      {isIncome ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                    </div>
                    <div>
                      <h5 className="font-semibold text-sm text-slate-800">
                        {tx.title}
                      </h5>
                      <span className="text-xs font-medium text-slate-400">
                        {tx.category} • {tx.date || new Date(tx.createdAt || tx.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`font-bold font-outfit text-base ${
                      isIncome ? "text-emerald-600" : "text-orange-600"
                    }`}
                  >
                    {isIncome ? "+" : "-"} {formatCurrency(tx.amount)}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-center border-t border-slate-50 pt-4">
        <button
          onClick={onViewAllClick}
          className="flex items-center gap-1.5 text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors py-1 px-3 rounded-lg hover:bg-teal-50/50"
        >
          <span>View All Transactions ({listItems.length})</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </section>
  );
}
