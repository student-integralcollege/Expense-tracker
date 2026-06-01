import { Router } from "express";
import { changePassword, login, me, signup, updateProfile } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  changePasswordSchema,
  loginSchema,
  signupSchema,
  updateProfileSchema,
} from "../validators/auth.validator.js";

const router = Router();

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);
router.get("/me", requireAuth, me);
router.put("/profile", requireAuth, validate(updateProfileSchema), updateProfile);
router.put("/password", requireAuth, validate(changePasswordSchema), changePassword);

export default router;
