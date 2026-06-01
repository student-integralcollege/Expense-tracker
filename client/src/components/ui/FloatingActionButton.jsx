import React, { useState, useRef, useEffect } from "react";
import { Menu, X, PiggyBank, ReceiptText, Sparkles } from "lucide-react";

export function FloatingActionButton({ onAddIncome, onAddExpense, onToggleDemo, isDemoMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={menuRef} className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Expanded Menu Options */}
      {isOpen && (
        <div className="flex flex-col gap-2.5 items-end mb-1 transition-all duration-300 transform translate-y-0 origin-bottom">
          {/* Add Income Option */}
          <button
            onClick={() => {
              onAddIncome();
              setIsOpen(false);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 hover:text-emerald-600 rounded-xl shadow-lg border border-slate-100 hover:bg-slate-50 transition-premium font-semibold text-xs animate-float shrink-0"
            style={{ animationDelay: "0ms" }}
          >
            <PiggyBank size={14} className="text-emerald-500" />
            <span>Add Income</span>
          </button>

          {/* Add Expense Option */}
          <button
            onClick={() => {
              onAddExpense();
              setIsOpen(false);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 hover:text-orange-600 rounded-xl shadow-lg border border-slate-100 hover:bg-slate-50 transition-premium font-semibold text-xs animate-float shrink-0"
            style={{ animationDelay: "150ms" }}
          >
            <ReceiptText size={14} className="text-orange-500" />
            <span>Add Expense</span>
          </button>

          {/* Toggle Demo Mode Option */}
          <button
            onClick={() => {
              onToggleDemo();
              setIsOpen(false);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 hover:text-teal-600 rounded-xl shadow-lg border border-slate-100 hover:bg-slate-50 transition-premium font-semibold text-xs animate-float shrink-0"
            style={{ animationDelay: "300ms" }}
          >
            <Sparkles size={14} className="text-teal-500" />
            <span>{isDemoMode ? "Enable Live Mode" : "Enable Demo Mode"}</span>
          </button>
        </div>
      )}

      {/* Main Hamburger FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-teal-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-teal-600 active:scale-95 transition-premium group relative border border-teal-400/20"
        aria-label="Toggle menu"
      >
        <span className="absolute -inset-1 rounded-full bg-teal-500/20 animate-ping opacity-75 group-hover:opacity-100 duration-1000"></span>
        <div className="relative z-10">
          {isOpen ? (
            <X size={24} className="transition-transform duration-300 rotate-90" />
          ) : (
            <Menu size={24} className="transition-transform duration-300 hover:scale-110" />
          )}
        </div>
      </button>
    </div>
  );
}
