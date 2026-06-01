import React, { useState, useEffect } from "react";
import { CircleDollarSign, CreditCard, Calendar, Tag, FileText } from "lucide-react";
import { expenseCategories, incomeCategories, paymentMethods } from "../../constants/index.js";

const initialState = {
  title: "",
  amount: "",
  category: "Food",
  type: "expense",
  paymentMethod: "Card",
  notes: "",
  tags: "",
  date: new Date().toISOString().slice(0, 10),
};

export function TransactionForm({
  onSubmit,
  editingExpense,
  onCancel,
  forcedType,
  showCancelButton = false,
}) {
  const [type, setType] = useState(forcedType || editingExpense?.type || "expense");

  // Sync state if editingExpense or forcedType changes
  useEffect(() => {
    if (editingExpense) {
      setType(editingExpense.type || "expense");
    } else if (forcedType) {
      setType(forcedType);
    }
  }, [editingExpense, forcedType]);

  const availableCategories = type === "income" ? incomeCategories : expenseCategories;

  const current = editingExpense
    ? {
        ...editingExpense,
        date: editingExpense.date ? new Date(editingExpense.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
        tags: editingExpense.tags?.join(", ") || "",
      }
    : {
        ...initialState,
        type: forcedType || initialState.type,
        category: forcedType === "income" ? "Salary" : "Food",
      };
  const selectedCategory = availableCategories.includes(current.category)
    ? current.category
    : availableCategories[0];

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    payload.amount = Number(payload.amount);
    payload.type = type;
    payload.tags = payload.tags
      ? payload.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [];

    onSubmit(payload);
    event.currentTarget.reset();
  };

  return (
    <form
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
      onSubmit={handleSubmit}
      key={`${editingExpense?._id || "new"}-${type}`}
    >
      {/* Type Toggle Pills (Only if not forced) */}
      {!forcedType && (
        <div className="flex bg-slate-50 p-1 rounded-xl w-full border border-slate-100 col-span-1 md:col-span-2">
          <button
            type="button"
            onClick={() => setType("expense")}
            className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all ${
              type === "expense"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => setType("income")}
            className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all ${
              type === "income"
                ? "bg-teal-500 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Income
          </button>
        </div>
      )}

      {/* Title Field */}
      <label className="col-span-1 md:col-span-2 flex flex-col gap-1.5">
        <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Title
        </span>
        <input
          name="title"
          type="text"
          defaultValue={current.title}
          minLength="2"
          maxLength="120"
          placeholder={type === "income" ? "e.g., Salary payout, Client fee" : "e.g., Grocery shopping, Utilities"}
          className="w-full px-4 py-2.5 rounded-[14px] border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm bg-white text-slate-700"
          required
        />
      </label>

      {/* Amount Field */}
      <label className="col-span-1 flex flex-col gap-1.5">
        <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Amount
        </span>
        <div className="relative flex items-center">
          <CircleDollarSign size={16} className="absolute left-3.5 text-slate-400 pointer-events-none" />
          <input
            name="amount"
            type="number"
            min="0.01"
            step="0.01"
            defaultValue={current.amount}
            placeholder="0.00"
            className="w-full pl-10 pr-4 py-2.5 rounded-[14px] border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm bg-white text-slate-700"
            required
          />
        </div>
      </label>

      {/* Date Field */}
      <label className="col-span-1 flex flex-col gap-1.5">
        <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Date
        </span>
        <div className="relative flex items-center">
          <Calendar size={16} className="absolute left-3.5 text-slate-400 pointer-events-none" />
          <input
            name="date"
            type="date"
            defaultValue={current.date}
            className="w-full pl-10 pr-4 py-2.5 rounded-[14px] border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm bg-white text-slate-700"
            required
          />
        </div>
      </label>

      {/* Category Field */}
      <label className="col-span-1 flex flex-col gap-1.5">
        <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Category
        </span>
        <select
          name="category"
          defaultValue={selectedCategory}
          className="w-full px-4 py-2.5 rounded-[14px] border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm bg-white text-slate-700 cursor-pointer"
          required
        >
          {availableCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </label>

      {/* Payment Method Field */}
      <label className={`${forcedType ? "col-span-1" : "col-span-1 md:col-span-2"} flex flex-col gap-1.5`}>
        <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Payment Method
        </span>
        <div className="relative flex items-center">
          <CreditCard size={16} className="absolute left-3.5 text-slate-400 pointer-events-none" />
          <select
            name="paymentMethod"
            defaultValue={current.paymentMethod}
            className="w-full pl-10 pr-4 py-2.5 rounded-[14px] border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm bg-white text-slate-700 cursor-pointer"
            required
          >
            {paymentMethods.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </div>
      </label>

      {/* Tags Field */}
      <label className="col-span-1 md:col-span-2 flex flex-col gap-1.5">
        <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Tags (comma separated)
        </span>
        <div className="relative flex items-center">
          <Tag size={16} className="absolute left-3.5 text-slate-400 pointer-events-none" />
          <input
            name="tags"
            type="text"
            defaultValue={current.tags}
            maxLength="180"
            placeholder="e.g., weekly, essentials, bills"
            className="w-full pl-10 pr-4 py-2.5 rounded-[14px] border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm bg-white text-slate-700"
          />
        </div>
      </label>

      {/* Notes Field */}
      <label className="col-span-1 md:col-span-2 flex flex-col gap-1.5">
        <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Notes
        </span>
        <div className="relative">
          <FileText size={16} className="absolute top-3.5 left-3.5 text-slate-400 pointer-events-none" />
          <textarea
            name="notes"
            rows="3"
            defaultValue={current.notes}
            maxLength="300"
            placeholder="Optional details or description..."
            className="w-full pl-10 pr-4 py-2.5 rounded-[14px] border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm bg-white text-slate-700"
          />
        </div>
      </label>

      {/* Actions */}
      <div className="col-span-1 md:col-span-2 flex gap-3 mt-3">
        {showCancelButton && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-[14px] font-semibold text-sm transition-all active:scale-[0.98] focus:outline-none"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="flex-[2] py-3.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-[14px] font-semibold text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-teal-500/20"
        >
          {editingExpense ? "Save changes" : "Add transaction"}
        </button>
      </div>
    </form>
  );
}
