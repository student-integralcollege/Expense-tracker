import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const hashPassword = async (password) => bcrypt.hash(password, 10);
export const comparePassword = async (password, hash) => bcrypt.compare(password, hash);
export const signToken = (userId) => jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: "7d" });
