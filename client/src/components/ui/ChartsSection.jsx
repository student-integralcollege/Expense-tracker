import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { formatCurrency } from "../../utils/format";

// Custom Gauge component using PieChart
function SemicircleGauge({ value, percent = 100, color, label }) {
  // Recharts Pie for gauge background and active segment
  const data = [
    { value: percent },
    { value: 100 - percent }
  ];

  return (
    <article className="bg-white rounded-[16px] border border-slate-100 p-6 shadow-premium hover:shadow-premium-hover transition-premium hover:-translate-y-0.5 flex flex-col items-center justify-between text-center min-h-[260px]">
      <div className="w-full">
        <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-2">
          {label}
        </span>
      </div>

      <div className="relative w-full h-[120px] flex items-center justify-center overflow-hidden">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <Pie
              data={data}
              cx="50%"
              cy="70%"
              startAngle={180}
              endAngle={0}
              innerRadius="65%"
              outerRadius="85%"
              dataKey="value"
              stroke="none"
              isAnimationActive={true}
            >
              <Cell fill={color} />
              <Cell fill="#f1f5f9" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Floating text inside the semicircle */}
        <div className="absolute top-[50%] flex flex-col items-center">
          <span className="text-2xl font-bold font-outfit text-slate-800">
            {formatCurrency(value)}
          </span>
          <span className="text-sm font-semibold text-slate-500 mt-0.5">
            {percent}%
          </span>
        </div>
      </div>

      <div className="mt-4 border-t border-slate-100 pt-3 w-full text-xs text-slate-400 font-medium">
        This Month data
      </div>
    </article>
  );
}

export function ChartsSection({ summary, isDemoMode }) {
  // If demo mode or no custom categories, show Food: 100% in Demo, or empty in Live Mode
  const hasCategories = summary.categoryBreakdown && summary.categoryBreakdown.length > 0;
  
  const donutData = isDemoMode
    ? (hasCategories ? summary.categoryBreakdown : [{ category: "Food", total: 9595 }])
    : (hasCategories ? summary.categoryBreakdown : []);

  // Let's use a beautiful mint/emerald green or customize colors
  const donutColors = ["#10b981", "#3b82f6", "#f59e0b", "#ec4899", "#8b5cf6", "#ef4444"];

  const totalIncome = isDemoMode ? (summary.totalIncome || 50000) : (summary.totalIncome || 0);
  const totalExpenses = isDemoMode ? (summary.totalExpenses || 9595) : (summary.totalExpenses || 0);
  const totalSavings = Math.max(totalIncome - totalExpenses, 0);

  // Percentages for Gauges
  const incomePercent = totalIncome > 0 ? 100 : 0;
  const spentPercent = totalIncome > 0 ? Math.min(Math.round((totalExpenses / totalIncome) * 100), 100) : 0;
  const savingsPercent = totalIncome > 0 ? Math.min(Math.round((totalSavings / totalIncome) * 100), 100) : 0;

  return (
    <div className="flex flex-col gap-8">
      {/* Semicircle Gauges Row */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SemicircleGauge
          label="Income"
          value={totalIncome}
          percent={incomePercent}
          color="#14b8a6" // Teal primary accent
        />
        <SemicircleGauge
          label="Spent"
          value={totalExpenses}
          percent={spentPercent}
          color="#f97316" // Orange expense accent
        />
        <SemicircleGauge
          label="Savings"
          value={totalSavings}
          percent={savingsPercent}
          color="#3b82f6" // Blue savings accent
        />
      </section>

      {/* Expense Distribution Section */}
      <section className="bg-white rounded-[16px] border border-slate-100 p-6 md:p-8 shadow-premium hover:shadow-premium-hover transition-premium">
        <h4 className="text-lg font-bold font-outfit text-slate-800 mb-6">
          Expense Distribution
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Label left */}
          <div className="md:col-span-3 flex flex-col justify-center text-left">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-2">
              Primary Category
            </span>
            {donutData.length === 0 ? (
              <p className="text-xs text-slate-400 font-semibold py-2">
                No expense transactions yet.
              </p>
            ) : (
              donutData.map((item, idx) => (
                <div key={idx} className="mb-1">
                  <span className="text-xl md:text-2xl font-bold font-outfit text-slate-800">
                    {item.category}: {isDemoMode ? 100 : (totalExpenses > 0 ? Math.round((item.total / totalExpenses) * 100) : 0)}%
                  </span>
                  <span className="text-xs text-slate-400 block mt-0.5">
                    {formatCurrency(item.total)} spent
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Large Donut Chart Centered */}
          <div className="md:col-span-6 flex justify-center relative">
            <div className="w-[220px] h-[220px] relative flex items-center justify-center">
              {donutData.length === 0 ? (
                <div className="w-full h-full rounded-full border-4 border-dashed border-slate-200 flex items-center justify-center">
                  <span className="text-xs text-slate-400 font-bold">No Expenses</span>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donutData}
                      cx="50%"
                      cy="50%"
                      innerRadius="65%"
                      outerRadius="85%"
                      dataKey="total"
                      nameKey="category"
                      stroke="none"
                      isAnimationActive={true}
                    >
                      {donutData.map((entry, idx) => (
                        <Cell key={idx} fill={donutColors[idx % donutColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              )}

              {/* Centered text in donut */}
              <div className="absolute text-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                  Total Spent
                </span>
                <span className="text-xl font-bold font-outfit text-slate-800 mt-1 block">
                  {formatCurrency(totalExpenses)}
                </span>
              </div>
            </div>
          </div>

          {/* Legend right */}
          <div className="md:col-span-3 flex flex-col gap-3 justify-center md:items-end">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-1 md:text-right">
              Legend
            </span>
            {donutData.length === 0 ? (
              <p className="text-xs text-slate-400 font-semibold md:text-right">
                None
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {donutData.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 md:justify-end">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: donutColors[idx % donutColors.length] }}
                    ></span>
                    <span className="text-sm font-semibold text-slate-600">
                      {item.category}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
