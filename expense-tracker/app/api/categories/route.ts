import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Category from "@/models/Category";
import { rateLimit } from "@/lib/rateLimit";

// GET all categories
export async function GET(request: NextRequest) {
  const rl = rateLimit(request);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: `Too many requests. Try again in ${rl.retryAfter}s.` },
      { status: 429, headers: { 'Retry-After': rl.retryAfter?.toString() || '60' } }
    );
  }
  try {
    await connectToDatabase();
    const categories = await Category.find({}).sort({ name: 1 });
    return NextResponse.json(categories);
  } catch (_error) {
    console.error("API /categories GET error:", _error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST new category
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
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Missing required field: name" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const category = new Category({ name });
    await category.save();
    return NextResponse.json(category, { status: 201 });
  } catch (_error) {
    console.error("API /categories POST error:", _error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
} 