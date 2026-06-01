import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { createHttpError } from "../utils/http.js";

export const requireAuth = async (req, _res, next) => {
  try {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      throw createHttpError(401, "Authentication required");
    }

    const payload = jwt.verify(token, env.JWT_SECRET);
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
