import React from "react";
import { Plus } from "lucide-react";

export function HeroCard({ onAddTransactionClick, activeTimeline, onTimelineChange }) {
  const timelines = ["Daily", "Weekly", "Monthly"];

  return (
    <div className="relative overflow-hidden rounded-[16px] bg-gradient-to-r from-teal-500 to-emerald-600 p-6 md:p-8 text-white shadow-premium transition-premium hover:shadow-premium-hover">
      {/* Decorative background shapes */}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-xl"></div>
      <div className="absolute -bottom-10 right-20 h-32 w-32 rounded-full bg-emerald-400/20 blur-lg"></div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-medium tracking-wide uppercase mb-3 backdrop-blur-sm">
            Finance Dashboard
          </span>
          <h3 className="text-2xl md:text-3xl font-bold font-outfit tracking-tight">
            Track your income and expenses
          </h3>
          <p className="mt-2 text-teal-50 text-sm md:text-base max-w-xl leading-relaxed">
            Monitor your cash flow, analyze spending patterns, and get AI-driven coach recommendations to optimize your financial goals.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 self-start md:self-center shrink-0">
          <button
            onClick={onAddTransactionClick}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-teal-700 font-semibold text-sm shadow-md hover:bg-teal-50 active:scale-95 transition-premium group"
          >
            <Plus size={18} className="text-teal-600 transition-transform group-hover:rotate-90 duration-200" />
            Add Transaction
          </button>
        </div>
      </div>

      <div className="relative z-10 flex justify-end mt-6 md:mt-8">
        <div className="flex bg-black/10 backdrop-blur-md p-1 rounded-lg border border-white/10">
          {timelines.map((time) => (
            <button
              key={time}
              onClick={() => onTimelineChange(time)}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-premium ${
                activeTimeline === time
                  ? "bg-white text-teal-800 shadow-sm"
                  : "text-white/80 hover:text-white hover:bg-white/5"
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
