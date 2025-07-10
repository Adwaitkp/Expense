import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import { rateLimit } from "@/lib/rateLimit";

// PUT update transaction
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const rl = rateLimit(request);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: `Too many requests. Try again in ${rl.retryAfter}s.` },
      { status: 429, headers: { 'Retry-After': rl.retryAfter?.toString() || '60' } }
    );
  }

  try {
    const body = await request.json();
    const { amount, date, description, category } = body;

    if (!amount || !date || !description || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const transaction = await Transaction.findByIdAndUpdate(
      params.id,
      {
        amount: parseFloat(amount),
        date: new Date(date),
        description,
        category,
      },
      { new: true }
    );

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(transaction);
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to update transaction" },
      { status: 500 }
    );
  }
}

// DELETE transaction
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const transaction = await Transaction.findByIdAndDelete(params.id);

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Transaction deleted" });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to delete transaction" },
      { status: 500 }
    );
  }
} 