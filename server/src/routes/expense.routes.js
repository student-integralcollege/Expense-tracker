import { Router } from "express";
import {
  createExpense,
  deleteExpense,
  listExpenses,
  updateExpense,
} from "../controllers/expense.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  createExpenseSchema,
  expenseQuerySchema,
  updateExpenseSchema,
} from "../validators/expense.validator.js";

const router = Router();

router.use(requireAuth);
router.get("/", validate(expenseQuerySchema), listExpenses);
router.post("/", validate(createExpenseSchema), createExpense);
router.put("/:id", validate(updateExpenseSchema), updateExpense);
router.delete("/:id", deleteExpense);

export default router;
