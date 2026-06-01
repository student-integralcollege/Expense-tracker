export const expenseCategories = [
  "Food",
  "Transport",
  "Housing",
  "Utilities",
  "Healthcare",
  "Shopping",
  "Entertainment",
  "Education",
  "Travel",
  "Other",
];

export const incomeCategories = [
  "Salary",
  "Freelance",
  "Investments",
  "Other",
];

export const categories = [...expenseCategories, ...incomeCategories.filter((cat) => !expenseCategories.includes(cat))];

export const paymentMethods = ["Card", "Cash", "UPI", "Bank Transfer", "Wallet"];
