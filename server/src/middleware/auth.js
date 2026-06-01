import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/auth.js";
import { User } from "../models/User.js";
import { createHttpError } from "../utils/http.js";

export const requireAuth = async (req, _res, next) => {
  try {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      throw createHttpError(401, "Authentication required");
    }

    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.userId).select("-password");

    if (!user) {
      throw createHttpError(401, "Invalid session");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error.statusCode ? error : createHttpError(401, "Invalid or expired token"));
  }
};
