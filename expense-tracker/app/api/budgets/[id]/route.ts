import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Budget from "@/models/Budget";
import { rateLimit } from "@/lib/rateLimit";

// PUT update budget
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rl = rateLimit(request);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: `Too many requests. Try again in ${rl.retryAfter}s.` },
      { status: 429, headers: { 'Retry-After': rl.retryAfter?.toString() || '60' } }
    );
  }
  const { id } = await params;
  try {
    const body = await request.json();
    const { amount } = body;

    if (!amount) {
      return NextResponse.json(
        { error: "Amount is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const budget = await Budget.findByIdAndUpdate(
      id,
      { amount: parseFloat(amount) },
      { new: true }
    );

    if (!budget) {
      return NextResponse.json(
        { error: "Budget not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(budget);
  } catch {
    return NextResponse.json(
      { error: "Failed to update budget" },
      { status: 500 }
    );
  }
}

// DELETE budget
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await connectToDatabase();
    const budget = await Budget.findByIdAndDelete(id);

    if (!budget) {
      return NextResponse.json(
        { error: "Budget not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Budget deleted" });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete budget" },
      { status: 500 }
    );
  }
} 