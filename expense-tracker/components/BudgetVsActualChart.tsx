"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CATEGORY_COLORS } from "@/lib/categories";

interface Transaction {
  _id: string;
  amount: number;
  date: string;
  description: string;
  category: string;
}

interface Budget {
  _id: string;
  category: string;
  amount: number;
  month: string;
}

interface BudgetVsActualChartProps {
  transactions: Transaction[];
  budgets: Budget[];
  currentMonth: string;
}

export default function BudgetVsActualChart({
  transactions,
  budgets,
  currentMonth,
}: BudgetVsActualChartProps) {
  const getBudgetVsActualData = () => {
    const categoryTotals: { [key: string]: number } = {};
    const budgetMap: { [key: string]: number } = {};

    // Calculate actual spending by category
    transactions.forEach((transaction) => {
      const transactionMonth = transaction.date.slice(0, 7); // YYYY-MM format
      if (transactionMonth === currentMonth) {
        const category = transaction.category;
        categoryTotals[category] = (categoryTotals[category] || 0) + transaction.amount;
      }
    });

    // Create budget map
    budgets.forEach((budget) => {
      budgetMap[budget.category] = budget.amount;
    });

    // Combine data
    const allCategories = new Set([
      ...Object.keys(categoryTotals),
      ...Object.keys(budgetMap),
    ]);

    return Array.from(allCategories).map((category) => ({
      category,
      actual: categoryTotals[category] || 0,
      budget: budgetMap[category] || 0,
      difference: (categoryTotals[category] || 0) - (budgetMap[category] || 0),
    }));
  };

  const data = getBudgetVsActualData();

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Budget vs Actual</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500">No budget data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget vs Actual Spending</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip
              formatter={(value: number) => [`$${value.toFixed(2)}`, "Amount"]}
            />
            <Legend />
            <Bar dataKey="budget" fill="#3b82f6" name="Budget" />
            <Bar dataKey="actual" fill="#ef4444" name="Actual" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
} 