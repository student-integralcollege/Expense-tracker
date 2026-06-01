import { Expense } from "../models/Expense.js";
import { getMonthRange } from "../utils/date.js";
import { createHttpError } from "../utils/http.js";

export const listExpenses = async (req, res, next) => {
  try {
    const { category, type, month, search } = req.validated.query || {};
    const query = { user: req.user._id };

    if (category) query.category = category;
    if (type) query.type = type;
    if (month) {
      const { start, end } = getMonthRange(month);
      query.date = { $gte: start, $lte: end };
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { notes: { $regex: search, $options: "i" } },
      ];
    }

    const expenses = await Expense.find(query).sort({ date: -1, createdAt: -1 });
    res.json(expenses);
  } catch (error) {
    next(error);
  }
};

export const createExpense = async (req, res, next) => {
  try {
    const expense = await Expense.create({
      ...req.validated.body,
      user: req.user._id,
    });
    res.status(201).json(expense);
  } catch (error) {
    next(error);
  }
};

export const updateExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.validated.params.id, user: req.user._id },
      req.validated.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!expense) {
      throw createHttpError(404, "Expense not found");
    }

    res.json(expense);
  } catch (error) {
    next(error);
  }
};

export const deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!expense) {
      throw createHttpError(404, "Expense not found");
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
