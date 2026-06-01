import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["expense", "income"],
      default: "expense",
    },
    paymentMethod: {
      type: String,
      trim: true,
      default: "Card",
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    tags: {
      type: [String],
      default: [],
    },
    date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

expenseSchema.index({ user: 1, date: -1, category: 1, type: 1 });

export const Expense = mongoose.model("Expense", expenseSchema);
