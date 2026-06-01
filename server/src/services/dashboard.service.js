import { Budget } from "../models/Budget.js";
import { Expense } from "../models/Expense.js";
import { getCurrentMonthKey, getMonthRange } from "../utils/date.js";

export const getDashboardSummary = async (userId, month = getCurrentMonthKey()) => {
  const { start, end } = getMonthRange(month);

  const expenses = await Expense.find({
    user: userId,
    date: {
      $gte: start,
      $lte: end,
    },
  }).sort({ date: -1 });

  const totalExpenses = expenses
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + item.amount, 0);

  const totalIncome = expenses
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + item.amount, 0);

  const categoryBreakdown = Object.values(
    expenses
      .filter((item) => item.type === "expense")
      .reduce((acc, item) => {
        acc[item.category] ??= { category: item.category, total: 0 };
        acc[item.category].total += item.amount;
        return acc;
      }, {}),
  ).sort((a, b) => b.total - a.total);

  const budgets = await Budget.find({ user: userId, month }).lean();
  const budgetStatus = budgets.map((budget) => ({
    ...budget,
    spent: categoryBreakdown.find((item) => item.category === budget.category)?.total || 0,
  }));

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);

  const monthlyExpenses = await Expense.aggregate([
    {
      $match: {
        type: "expense",
        user: userId,
        date: { $gte: sixMonthsAgo },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" },
        },
        total: { $sum: "$amount" },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  const monthlyTrend = monthlyExpenses.map((item) => ({
    month: `${item._id.year}-${String(item._id.month).padStart(2, "0")}`,
    total: item.total,
  }));

  return {
    month,
    totalExpenses,
    totalIncome,
    netBalance: totalIncome - totalExpenses,
    transactionCount: expenses.length,
    categoryBreakdown,
    monthlyTrend,
    budgetStatus,
    recentTransactions: expenses.slice(0, 5),
  };
};
