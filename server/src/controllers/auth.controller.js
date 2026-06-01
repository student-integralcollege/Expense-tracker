import { User } from "../models/User.js";
import { comparePassword, hashPassword, signToken } from "../utils/auth.js";
import { createHttpError } from "../utils/http.js";

const sendAuthResponse = (user, res, statusCode = 200) => {
  const token = signToken(user._id.toString());

  res.status(statusCode).json({
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
  });
};

export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.validated.body;
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      throw createHttpError(409, "An account with this email already exists");
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: await hashPassword(password),
    });

    sendAuthResponse(user, res, 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.validated.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || !(await comparePassword(password, user.password))) {
      throw createHttpError(401, "Invalid email or password");
    }

    sendAuthResponse(user, res);
  } catch (error) {
    next(error);
  }
};

export const me = async (req, res) => {
  res.json({
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    },
  });
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.validated.body;
    const normalizedEmail = email.toLowerCase();
    const existingUser = await User.findOne({
      email: normalizedEmail,
      _id: { $ne: req.user._id },
    });

    if (existingUser) {
      throw createHttpError(409, "An account with this email already exists");
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email: normalizedEmail },
      { new: true, runValidators: true },
    ).select("-password");

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.validated.body;
    const user = await User.findById(req.user._id);

    if (!user || !(await comparePassword(currentPassword, user.password))) {
      throw createHttpError(401, "Current password is incorrect");
    }

    user.password = await hashPassword(newPassword);
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    next(error);
  }
};
