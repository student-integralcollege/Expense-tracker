export const buildFallbackInsights = ({ expenses, summary, budgets }) => {
  const warnings = budgets
    .filter((budget) => budget.spent > budget.limit)
    .map((budget) => `${budget.category} is over budget by INR ${(budget.spent - budget.limit).toFixed(2)}`);

  const topCategory = summary.categoryBreakdown[0];
  const trendDirection = summary.monthlyTrend.length >= 2
    ? summary.monthlyTrend.at(-1).total - summary.monthlyTrend.at(-2).total
    : 0;

  return {
    overview: `Analyzed ${expenses.length} transactions. Net balance is INR ${summary.netBalance.toFixed(2)} this period.`,
    recommendations: [
      topCategory
        ? `Your biggest spending area is ${topCategory.category}. Try setting a tighter cap there next month.`
        : "Start logging more transactions to unlock stronger recommendations.",
      trendDirection > 0
        ? "Spending increased versus the previous month. Review subscriptions and variable costs."
        : "Spending is flat or lower than last month. Keep reviewing large purchases weekly.",
      warnings[0] || "All tracked budgets are currently within limits.",
    ],
    warnings,
  };
};
