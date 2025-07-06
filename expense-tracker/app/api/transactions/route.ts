import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Transaction from "@/models/Transaction";

// GET all transactions
export async function GET() {
  try {
    await connectToDatabase();
    const transactions = await Transaction.find({}).sort({ date: -1 });
    return NextResponse.json(transactions);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

// POST new transaction
export async function POST(request: NextRequest) {
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
    const transaction = new Transaction({
      amount: parseFloat(amount),
      date: new Date(date),
      description,
      category,
    });

    await transaction.save();
    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
} 