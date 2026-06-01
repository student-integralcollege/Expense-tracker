import { Router } from "express";
import {
  createBudget,
  deleteBudget,
  listBudgets,
  updateBudget,
} from "../controllers/budget.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createBudgetSchema, updateBudgetSchema } from "../validators/budget.validator.js";

const router = Router();

router.use(requireAuth);
router.get("/", listBudgets);
router.post("/", validate(createBudgetSchema), createBudget);
router.put("/:id", validate(updateBudgetSchema), updateBudget);
router.delete("/:id", deleteBudget);

export default router;
