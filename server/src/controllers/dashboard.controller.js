import { getDashboardSummary } from "../services/dashboard.service.js";

export const getSummary = async (req, res, next) => {
  try {
    const summary = await getDashboardSummary(req.user._id, req.query.month);
    res.json(summary);
  } catch (error) {
    next(error);
  }
};
