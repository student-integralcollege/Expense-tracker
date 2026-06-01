import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  BarChart2,
  BarChart3,
  Calendar,
  Clock3,
  DollarSign,
  Download,
  Filter,
  PencilLine,
  Plus,
  ReceiptText,
  Trash2,
  TrendingDown,
  TrendingUp,
  WalletCards,
  X,
} from "lucide-react";
import {
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Area,
} from "recharts";
import { formatCurrency, formatDate } from "../../utils/format";
import { categories } from "../../constants/index.js";
import { TransactionForm } from "../shared/TransactionForm.jsx";

const getMonthDetails = (month) => {
  const [year, monthIndex] = month.split("-").map(Number);
  const days = new Date(year, monthIndex, 0).getDate();
  return { year, monthIndex, days };
};

const buildDailyExpenseData = (records, month) => {
  const { days } = getMonthDetails(month);
  const data = Array.from({ length: days }, (_, index) => ({
    day: index + 1,
    total: 0,
  }));

  records.forEach((record) => {
    const date = new Date(record.date);
    const day = date.getDate();
    if (day >= 1 && day <= days) {
      data[day - 1].total += Number(record.amount || 0);
    }
  });

  return data;
};

const getPeakExpenseDay = (dailyData) =>
  dailyData.reduce(
    (peak, item) => (item.total > peak.total ? item : peak),
    { day: 1, total: 0 },
  );

export function FinancialOverviewSection({
  type = "expense",
  month,
  summary = {},
  expenses = [],
  recentTransactions = [],
  editingExpense,
  onSubmit,
  onCancel,
  onEdit,
  onDelete,
}) {
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const isIncome = type === "income";

  const filteredExpenses = activeCategory === "All"
    ? expenses
    : expenses.filter((e) => e.category === activeCategory);

  const dailyData = buildDailyExpenseData(filteredExpenses, month);
  const peakDay = getPeakExpenseDay(dailyData);
  const monthLabel = new Date(`${month}-01T00:00:00`).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  
  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
  const averageAmount = filteredExpenses.length > 0 ? totalAmount / filteredExpenses.length : 0;
  const transactionCount = filteredExpenses.length;

  const sortedRecentTransactions = [...recentTransactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  useEffect(() => {
    if (editingExpense?._id) {
      setShowExpenseForm(true);
    }
  }, [editingExpense]);

  const handleFormSubmit = async (payload) => {
    const saved = await onSubmit(payload);
    if (saved !== false) {
      setShowExpenseForm(false);
    }
  };

  const handleCancel = () => {
    onCancel();
    setShowExpenseForm(false);
  };

  return (
    <section className="space-y-8">
      {/* Header Intro Title & Subtitle */}
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-extrabold font-outfit text-slate-800 tracking-tight capitalize flex items-center gap-2">
          {type}s Management
        </h2>
        <p className="text-slate-400 text-sm font-medium">
          Detailed {type} records and performance metrics
        </p>
      </div>

      {/* Stats Mini Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white rounded-[16px] border border-slate-100 p-5 shadow-premium hover:shadow-premium-hover transition-premium hover:-translate-y-0.5 flex flex-col justify-between h-32">
          <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Balance</span>
          <div className="mt-2 flex items-center justify-between">
            <strong className="text-2xl font-bold font-outfit text-slate-800 tracking-tight">
              {formatCurrency(summary?.netBalance || 0)}
            </strong>
            <span className="p-2.5 rounded-xl bg-teal-50 text-teal-600">
              <DollarSign size={16} />
            </span>
          </div>
        </div>

        <div className="bg-white rounded-[16px] border border-slate-100 p-5 shadow-premium hover:shadow-premium-hover transition-premium hover:-translate-y-0.5 flex flex-col justify-between h-32">
          <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Monthly Income</span>
          <div className="mt-2 flex items-center justify-between">
            <strong className="text-2xl font-bold font-outfit text-slate-800 tracking-tight">
              {formatCurrency(summary?.totalIncome || 0)}
            </strong>
            <span className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp size={16} />
            </span>
          </div>
        </div>

        <div className="bg-white rounded-[16px] border border-slate-100 p-5 shadow-premium hover:shadow-premium-hover transition-premium hover:-translate-y-0.5 flex flex-col justify-between h-32">
          <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Monthly Expenses</span>
          <div className="mt-2 flex items-center justify-between">
            <strong className="text-2xl font-bold font-outfit text-slate-800 tracking-tight">
              {formatCurrency(summary?.totalExpenses || 0)}
            </strong>
            <span className="p-2.5 rounded-xl bg-orange-50 text-orange-600">
              <TrendingDown size={16} />
            </span>
          </div>
        </div>

        <div className="bg-white rounded-[16px] border border-slate-100 p-5 shadow-premium hover:shadow-premium-hover transition-premium hover:-translate-y-0.5 flex flex-col justify-between h-32">
          <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Savings Rate</span>
          <div className="mt-2 flex items-center justify-between">
            <strong className="text-2xl font-bold font-outfit text-slate-800 tracking-tight">
              {summary?.totalIncome > 0 
                ? Math.round(((summary.totalIncome - (summary.totalExpenses || 0)) / summary.totalIncome) * 100) 
                : 0}%
            </strong>
            <span className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <WalletCards size={16} />
            </span>
          </div>
        </div>
      </section>

      {/* Main Financial Overview section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mt-4">
          <h3 className="text-xl font-bold font-outfit text-slate-800 flex items-center gap-2">
            <TrendingUp size={20} className="text-teal-500" />
            <span>Financial Overview ({monthLabel})</span>
          </h3>
          
          {/* Category Filter Dropdown */}
          <div className="relative">
            <button 
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-premium ${
                activeCategory !== "All"
                  ? "bg-teal-50 border-teal-200 text-teal-700 shadow-sm"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <Filter size={14} />
              <span>{activeCategory === "All" ? "Filter Category" : activeCategory}</span>
            </button>
            {filterOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-slate-100 shadow-2xl overflow-hidden py-1 z-30 max-h-60 overflow-y-auto">
                <div className="flex justify-between items-center px-4 py-2 bg-slate-50 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-700">Categories</span>
                  <button 
                    onClick={() => { setActiveCategory("All"); setFilterOpen(false); }}
                    className="text-[10px] text-teal-600 font-bold hover:underline"
                  >
                    Reset
                  </button>
                </div>
                <div className="py-1">
                  <button 
                    className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-slate-50 ${activeCategory === "All" ? "text-teal-600 bg-teal-50/50" : "text-slate-600"}`}
                    onClick={() => { setActiveCategory("All"); setFilterOpen(false); }}
                  >
                    All Transactions
                  </button>
                  {categories.map(cat => (
                    <button 
                      key={cat}
                      className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-slate-50 ${activeCategory === cat ? "text-teal-600 bg-teal-50/50" : "text-slate-600"}`}
                      onClick={() => { setActiveCategory(cat); setFilterOpen(false); }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Large Hero Call-to-action Card */}
        <div className={`relative overflow-hidden rounded-[16px] p-6 md:p-8 text-white shadow-premium transition-premium hover:shadow-premium-hover bg-gradient-to-r ${isIncome ? "from-teal-500 to-emerald-600" : "from-orange-500 to-amber-600"}`}>
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-xl"></div>
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h4 className="text-2xl font-bold font-outfit tracking-tight">
                {isIncome ? "Income" : "Expense"} Overview
              </h4>
              <p className="mt-2 text-white/90 text-sm max-w-lg leading-relaxed">
                Track and manage your {isIncome ? "income sources" : "monthly spending patterns"} in one interactive snapshot view.
              </p>
            </div>
            <button 
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-slate-800 font-semibold text-sm shadow-md hover:bg-slate-50 active:scale-95 transition-premium shrink-0 self-start sm:self-center"
              onClick={() => setShowExpenseForm(true)}
            >
              <Plus size={18} className={isIncome ? "text-teal-600" : "text-orange-600"} />
              <span>Add {isIncome ? "Income" : "Expense"}</span>
            </button>
          </div>
        </div>

        {/* 3 Summary cards specific to Category */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-100 p-6 rounded-[16px] shadow-premium hover:shadow-premium-hover transition-premium flex flex-col justify-between min-h-[120px]">
            <div>
              <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <div className={`p-2 rounded-lg ${isIncome ? "bg-teal-50 text-teal-600" : "bg-orange-50 text-orange-600"}`}>
                  <DollarSign size={14} />
                </div>
                <span>Total {isIncome ? "Income" : "Expenses"}</span>
              </div>
              <strong className="text-2xl font-bold font-outfit text-slate-800 tracking-tight block">
                {formatCurrency(totalAmount)}
              </strong>
            </div>
            <span className="text-[10px] text-slate-400 font-semibold mt-3 flex items-center gap-1.5">
              <Calendar size={12} />
              <span>{isIncome ? "Total inflow" : "This Month"}</span>
            </span>
          </div>

          <div className="bg-white border border-slate-100 p-6 rounded-[16px] shadow-premium hover:shadow-premium-hover transition-premium flex flex-col justify-between min-h-[120px]">
            <div>
              <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <BarChart2 size={14} />
                </div>
                <span>Average Value</span>
              </div>
              <strong className="text-2xl font-bold font-outfit text-slate-800 tracking-tight block">
                {formatCurrency(averageAmount)}
              </strong>
            </div>
            <span className="text-[10px] text-slate-400 font-semibold mt-3 flex items-center gap-1.5">
              <BarChart3 size={12} />
              <span>{filteredExpenses.length} transactions</span>
            </span>
          </div>

          <div className="bg-white border border-slate-100 p-6 rounded-[16px] shadow-premium hover:shadow-premium-hover transition-premium flex flex-col justify-between min-h-[120px]">
            <div>
              <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <div className="p-2 rounded-lg bg-violet-50 text-violet-600">
                  <ReceiptText size={14} />
                </div>
                <span>Total Transactions</span>
              </div>
              <strong className="text-2xl font-bold font-outfit text-slate-800 tracking-tight block">
                {filteredExpenses.length}
              </strong>
            </div>
            <span className="text-[10px] text-slate-400 font-semibold mt-3 flex items-center gap-1.5">
              <Calendar size={12} />
              <span>All records filtered</span>
            </span>
          </div>
        </div>
      </section>

      {/* Daily Trends Area Chart */}
      <section className="bg-white rounded-[16px] border border-slate-100 p-6 md:p-8 shadow-premium hover:shadow-premium-hover transition-premium">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h4 className="text-lg font-bold font-outfit text-slate-800 flex items-center gap-2">
              <BarChart3 size={18} className="text-teal-500" />
              <span>Daily {isIncome ? "Income" : "Expense"} Trends</span>
            </h4>
            <span className="text-xs text-slate-400 font-medium">({monthLabel})</span>
          </div>
          <button className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 active:scale-95 transition-premium shrink-0">
            <Download size={14} />
            <span>Export Data</span>
          </button>
        </div>

        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isIncome ? "#10b981" : "#f97316"} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={isIncome ? "#10b981" : "#f97316"} stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#f8fafc" vertical={false} />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 10 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => formatCurrency(value)}
                tick={{ fill: "#94a3b8", fontSize: 10 }}
              />
              <Tooltip 
                formatter={(value) => [formatCurrency(value), isIncome ? "Income" : "Expense"]} 
                labelFormatter={(label) => `Day ${label}`} 
              />
              {peakDay.total > 0 && (
                <ReferenceLine x={peakDay.day} stroke={isIncome ? "#10b981" : "#f97316"} strokeDasharray="3 3" />
              )}
              <Area
                type="monotone"
                dataKey="total"
                stroke={isIncome ? "#10b981" : "#f97316"}
                strokeWidth={3}
                fill="url(#trendFill)"
                dot={false}
                activeDot={{ r: 5, stroke: "#ffffff", strokeWidth: 2, fill: isIncome ? "#10b981" : "#f97316" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Styled Transaction Form Modal (For Inline Actions) */}
      {showExpenseForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={handleCancel} />
          
          {/* Modal Card */}
          <div className="relative bg-white rounded-[20px] w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100/50 transform transition-all shrink-0 max-h-[90vh] flex flex-col z-10">
            
            {/* Header Close Button */}
            <button 
              onClick={handleCancel} 
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
                {editingExpense ? `Update ${isIncome ? "Income" : "Expense"}` : `Add ${isIncome ? "Income" : "Expense"}`}
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Capture {isIncome ? "earnings" : "purchases"}, bills, and everyday {isIncome ? "revenue" : "spending"} with proper monthly tracking.
              </p>
            </div>

            {/* Minimal Divider */}
            <div className="h-[1px] bg-slate-100 mx-8"></div>

            {/* Form Body Wrapper */}
            <div className="flex-1 overflow-y-auto px-8 pb-8 pt-6">
              <TransactionForm
                onSubmit={handleFormSubmit}
                editingExpense={editingExpense}
                onCancel={handleCancel}
                forcedType={type}
                showCancelButton={true}
              />
            </div>
          </div>
        </div>
      )}



      {/* Styled Ledger Transaction list */}
      <section className="bg-white rounded-[16px] border border-slate-100 p-6 md:p-8 shadow-premium">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-2">
            {isIncome ? <DollarSign size={18} className="text-teal-500" /> : <ReceiptText size={18} className="text-orange-500" />}
            <h4 className="text-lg font-bold font-outfit text-slate-800">
              {isIncome ? "Income" : "Expense"} Transactions
            </h4>
            <span className="text-xs text-slate-400 font-medium">({monthLabel})</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-premium">
              All Transactions
            </button>
            <button className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-premium">
              <Download size={13} />
              <span>Export</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {filteredExpenses.length ? (
            filteredExpenses.map((expense) => {
              const isSalary = expense.category === "Salary";
              return (
                <article 
                  className={`flex items-center justify-between p-4 rounded-xl border border-slate-50 hover:bg-slate-50/50 transition-premium ${isSalary ? "bg-emerald-50/10 border-emerald-100/50" : ""}`} 
                  key={expense._id}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${isSalary ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                      {isSalary ? <TrendingUp size={16} /> : (expense.category?.slice(0, 2) || (isIncome ? "In" : "Ex"))}
                    </span>
                    <div>
                      <strong className="font-semibold text-slate-800 text-sm block">{expense.title}</strong>
                      <span className="text-xs text-slate-400 font-medium">{formatDate(expense.date)} • {expense.category}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className={`font-bold font-outfit text-base ${isIncome ? "text-emerald-600" : "text-orange-600"}`}>
                      {isIncome ? "+" : "-"}{formatCurrency(expense.amount)}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button 
                        onClick={() => onEdit(expense)}
                        className="text-slate-400 hover:text-teal-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                        aria-label={`Edit ${expense.title}`}
                      >
                        <PencilLine size={14} />
                      </button>
                      <button 
                        onClick={() => onDelete(expense._id)}
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                        aria-label={`Delete ${expense.title}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="py-8 text-center text-slate-400 font-medium text-sm">
              No {isIncome ? "income" : "expense"} transactions match this filter.
            </div>
          )}
        </div>
      </section>

      {/* Recent stacked activity log */}
      <section className="bg-white rounded-[16px] border border-slate-100 p-6 md:p-8 shadow-premium">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2">
            <Clock3 size={18} className="text-teal-500" />
            <h4 className="text-lg font-bold font-outfit text-slate-800">
              Recent Activity Logs
            </h4>
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Stacked chronological order
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {sortedRecentTransactions.length ? (
            sortedRecentTransactions.map((transaction) => {
              const isTxIncome = transaction.type === "income";
              return (
                <article 
                  className="flex items-center justify-between p-3.5 border-b border-slate-50 last:border-b-0 hover:bg-slate-50/30 transition-premium" 
                  key={transaction._id}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isTxIncome ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"}`}>
                      {isTxIncome ? <ArrowUpRight size={14} /> : <ReceiptText size={14} />}
                    </span>
                    <div>
                      <strong className="font-semibold text-slate-800 text-xs block">{transaction.title}</strong>
                      <span className="text-[10px] text-slate-400 font-semibold">{formatDate(transaction.date)} &nbsp; {transaction.category}</span>
                    </div>
                  </div>
                  <span className={`font-bold font-outfit text-sm ${isTxIncome ? "text-emerald-600" : "text-orange-600"}`}>
                    {isTxIncome ? "+" : "-"}{formatCurrency(transaction.amount)}
                  </span>
                </article>
              );
            })
          ) : (
            <div className="py-6 text-center text-slate-400 font-medium text-xs">
              No recent transactions logs recorded.
            </div>
          )}
        </div>
      </section>
    </section>
  );
}
