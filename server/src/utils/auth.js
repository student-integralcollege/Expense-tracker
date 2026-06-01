import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/auth.js";

export const hashPassword = async (password) => bcrypt.hash(password, 10);
export const comparePassword = async (password, hash) => bcrypt.compare(password, hash);
export const signToken = (userId) => jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
