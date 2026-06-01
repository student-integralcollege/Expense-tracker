import { Budget } from "../models/Budget.js";
import { createHttpError } from "../utils/http.js";

export const listBudgets = async (_req, res, next) => {
  try {
    const budgets = await Budget.find({ user: _req.user._id }).sort({ month: -1, category: 1 });
    res.json(budgets);
  } catch (error) {
    next(error);
  }
};

export const createBudget = async (req, res, next) => {
  try {
    const budget = await Budget.create({
      ...req.validated.body,
      user: req.user._id,
    });
    res.status(201).json(budget);
  } catch (error) {
    if (error.code === 11000) {
      error.statusCode = 409;
      error.message = "Budget for this category and month already exists";
    }
    next(error);
  }
};

export const updateBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { _id: req.validated.params.id, user: req.user._id },
      req.validated.body,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!budget) {
      throw createHttpError(404, "Budget not found");
    }
    res.json(budget);
  } catch (error) {
    next(error);
  }
};

export const deleteBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!budget) {
      throw createHttpError(404, "Budget not found");
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
