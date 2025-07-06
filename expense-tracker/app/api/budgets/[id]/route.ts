import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Budget from "@/models/Budget";

// PUT update budget
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
  } catch (error) {
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
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete budget" },
      { status: 500 }
    );
  }
} 