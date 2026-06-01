import { Expense } from "../models/Expense.js";
import { generateInsights } from "../services/ai.service.js";
import { getDashboardSummary } from "../services/dashboard.service.js";
import { getCurrentMonthKey, getMonthRange } from "../utils/date.js";

export const getInsights = async (req, res, next) => {
  try {
    const month = req.validated?.body?.month || getCurrentMonthKey();
    const { start, end } = getMonthRange(month);
    const [expenses, summary] = await Promise.all([
      Expense.find({
        user: req.user._id,
        date: { $gte: start, $lte: end },
      })
        .sort({ date: -1 })
        .lean(),
      getDashboardSummary(req.user._id, month),
    ]);

    const insights = await generateInsights({
      expenses,
      summary,
      budgets: summary.budgetStatus,
    });
    res.json(insights);
  } catch (error) {
    next(error);
  }
};
