import mongoose, { Schema, Document } from "mongoose";

export interface IBudget extends Document {
  category: string;
  amount: number;
  month: string; // Format: "YYYY-MM"
  year: number;
  monthNumber: number;
}

const BudgetSchema = new Schema<IBudget>({
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  month: { type: String, required: true },
  year: { type: Number, required: true },
  monthNumber: { type: Number, required: true },
});

// Compound index to ensure unique budget per category per month
BudgetSchema.index({ category: 1, month: 1 }, { unique: true });

export default mongoose.models.Budget ||
  mongoose.model<IBudget>("Budget", BudgetSchema); 