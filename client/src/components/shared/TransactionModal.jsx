import React, { useEffect, useState } from "react";
import { ArrowDownRight, ArrowUpRight, X } from "lucide-react";
import { TransactionForm } from "./TransactionForm.jsx";

const transactionTypes = [
  {
    id: "income",
    title: "Income",
    description: "Salary, freelance payments, investments, and other money in.",
    icon: ArrowUpRight,
    activeClass: "border-emerald-200 bg-emerald-50 text-emerald-700 shadow-sm",
    iconClass: "bg-emerald-100 text-emerald-600",
  },
  {
    id: "expense",
    title: "Expense",
    description: "Bills, purchases, subscriptions, and everyday spending.",
    icon: ArrowDownRight,
    activeClass: "border-orange-200 bg-orange-50 text-orange-700 shadow-sm",
    iconClass: "bg-orange-100 text-orange-600",
  },
];

export function TransactionModal({ isOpen, onClose, onSubmit, editingExpense, initialType = null }) {
  const [selectedType, setSelectedType] = useState(initialType || "");

  useEffect(() => {
    if (isOpen) {
      setSelectedType(editingExpense?.type || initialType || "");
    }
  }, [isOpen, editingExpense, initialType]);

  if (!isOpen) return null;

  const handleFormSubmit = async (payload) => {
    const saved = await onSubmit(payload);
    if (saved !== false) {
      onClose();
    }
  };

  const isAddingNewTransaction = !editingExpense;
  const activeType = editingExpense?.type || selectedType;
  const activeTypeLabel = activeType === "income" ? "Income" : activeType === "expense" ? "Expense" : "Transaction";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Card */}
      <div className="relative bg-white rounded-[20px] w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100/50 transform transition-all shrink-0 max-h-[90vh] flex flex-col z-10">
        
        {/* Header Close Button */}
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 transition-colors absolute top-6 right-6 z-20"
        >
          <X size={18} />
        </button>

        {/* Header Info */}
        <div className="flex flex-col px-8 pt-8 pb-4">
          <span className="inline-flex items-center gap-1 text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full text-xs font-semibold self-start">
            Transaction
          </span>
          <h3 className="text-2xl font-bold font-outfit text-slate-900 tracking-tight mt-2">
            {editingExpense ? `Update ${activeTypeLabel}` : selectedType ? `Add ${activeTypeLabel}` : "Add Transaction"}
          </h3>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Select a transaction type first, then fill in the matching form.
          </p>
        </div>

        {/* Minimal Divider */}
        <div className="h-[1px] bg-slate-100 mx-8"></div>

        {/* Form Body Wrapper */}
        <div className="flex-1 overflow-y-auto px-8 pb-8 pt-6">
          {isAddingNewTransaction && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {transactionTypes.map((option) => {
                const Icon = option.icon;
                const isSelected = selectedType === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelectedType(option.id)}
                    className={`text-left p-4 rounded-[16px] border transition-premium active:scale-[0.98] ${
                      isSelected
                        ? option.activeClass
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                    aria-pressed={isSelected}
                  >
                    <span className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${isSelected ? option.iconClass : "bg-slate-100 text-slate-400"}`}>
                      <Icon size={18} />
                    </span>
                    <span className="block text-sm font-bold">{option.title}</span>
                    <span className="block text-xs leading-relaxed mt-1 opacity-75">
                      {option.description}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {activeType ? (
            <TransactionForm
              onSubmit={handleFormSubmit}
              editingExpense={editingExpense}
              forcedType={isAddingNewTransaction ? activeType : undefined}
              onCancel={onClose}
              showCancelButton={true}
            />
          ) : (
            <div className="rounded-[16px] border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center">
              <p className="text-sm font-semibold text-slate-600">
                Choose Income or Expense to continue.
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Only the selected form will be shown.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
