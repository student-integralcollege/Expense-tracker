import { Router } from "express";
import { getInsights } from "../controllers/ai.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { insightsSchema } from "../validators/ai.validator.js";

const router = Router();

router.use(requireAuth);
router.post("/insights", validate(insightsSchema), getInsights);

export default router;
