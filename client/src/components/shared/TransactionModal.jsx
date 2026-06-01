import React from "react";
import { X } from "lucide-react";
import { TransactionForm } from "./TransactionForm.jsx";

export function TransactionModal({ isOpen, onClose, onSubmit, editingExpense, initialType = "expense" }) {
  if (!isOpen) return null;

  const handleFormSubmit = (payload) => {
    onSubmit(payload);
    onClose();
  };

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
            {editingExpense ? "Update Transaction" : `Add Transaction`}
          </h3>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Capture earnings, bills, and everyday revenue with proper monthly tracking.
          </p>
        </div>

        {/* Minimal Divider */}
        <div className="h-[1px] bg-slate-100 mx-8"></div>

        {/* Form Body Wrapper */}
        <div className="flex-1 overflow-y-auto px-8 pb-8 pt-6">
          <TransactionForm
            onSubmit={handleFormSubmit}
            editingExpense={editingExpense}
            forcedType={editingExpense ? undefined : initialType}
            onCancel={onClose}
            showCancelButton={true}
          />
        </div>
      </div>
    </div>
  );
}
