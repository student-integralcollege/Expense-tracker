import React from "react";
import { Clock3, PencilLine, Trash2 } from "lucide-react";
import { formatCurrency, formatDate } from "../../utils/format";

export function ExpenseTable({ expenses, onEdit, onDelete }) {
  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <th className="py-3.5 px-4">Title</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Type</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4">Amount</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-sm font-medium">
            {expenses.map((expense) => {
              const isIncome = expense.type === "income" || expense.type === "Income";
              return (
                <tr
                  key={expense._id}
                  className="hover:bg-slate-50/50 transition-premium group"
                >
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-800 block">
                      {expense.title}
                    </span>
                    <span className="text-xs text-slate-400 font-normal mt-0.5 block">
                      {expense.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-semibold">
                    {expense.category}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${
                        isIncome
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-orange-50 text-orange-700"
                      }`}
                    >
                      {expense.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    {formatDate(expense.date)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`font-bold font-outfit text-base ${
                        isIncome ? "text-emerald-600" : "text-orange-600"
                      }`}
                    >
                      {isIncome ? "+" : "-"} {formatCurrency(expense.amount)}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(expense)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-teal-600 hover:bg-slate-100 px-2.5 py-1.5 rounded-lg transition-colors border border-slate-100"
                      >
                        <PencilLine size={13} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => onDelete(expense._id)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-rose-500 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg transition-colors border border-transparent"
                      >
                        <Trash2 size={13} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {expenses.length === 0 && (
              <tr>
                <td colSpan="6" className="py-8 text-center text-slate-400 font-medium">
                  No transactions found for this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
