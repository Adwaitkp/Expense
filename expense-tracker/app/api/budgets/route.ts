import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Budget from "@/models/Budget";
import { rateLimit } from "@/lib/rateLimit";

// GET all budgets for current month
export async function GET(request: NextRequest) {
  const rl = rateLimit(request);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: `Too many requests. Try again in ${rl.retryAfter}s.` },
      { status: 429, headers: { 'Retry-After': rl.retryAfter?.toString() || '60' } }
    );
  }
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month") || new Date().toISOString().slice(0, 7);

    await connectToDatabase();
    const budgets = await Budget.find({ month }).sort({ category: 1 });
    return NextResponse.json(budgets);
  } catch (_error) {
    console.error("API /budgets GET error:", _error);
    return NextResponse.json(
      { error: "Failed to fetch budgets" },
      { status: 500 }
    );
  }
}

// POST new budget
export async function POST(request: NextRequest) {
  const rl = rateLimit(request);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: `Too many requests. Try again in ${rl.retryAfter}s.` },
      { status: 429, headers: { 'Retry-After': rl.retryAfter?.toString() || '60' } }
    );
  }
  try {
    const body = await request.json();
    const { category, amount, month } = body;

    if (!category || !amount || !month) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const [year, monthNumber] = month.split("-").map(Number);

    await connectToDatabase();
    
    // Check if budget already exists for this category and month
    const existingBudget = await Budget.findOne({ category, month });
    
    if (existingBudget) {
      // Update existing budget
      existingBudget.amount = parseFloat(amount);
      await existingBudget.save();
      return NextResponse.json(existingBudget);
    } else {
      // Create new budget
      const budget = new Budget({
        category,
        amount: parseFloat(amount),
        month,
        year,
        monthNumber,
      });
      await budget.save();
      return NextResponse.json(budget, { status: 201 });
    }
  } catch (_error) {
    console.error("API /budgets POST error:", _error);
    return NextResponse.json(
      { error: "Failed to create budget" },
      { status: 500 }
    );
  }
} 