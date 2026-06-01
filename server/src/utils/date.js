export const getMonthRange = (month) => {
  const [year, rawMonth] = month.split("-").map(Number);
  const start = new Date(Date.UTC(year, rawMonth - 1, 1, 0, 0, 0, 0));
  const end = new Date(Date.UTC(year, rawMonth, 0, 23, 59, 59, 999));
  return { start, end };
};

export const getCurrentMonthKey = () => new Date().toISOString().slice(0, 7);
