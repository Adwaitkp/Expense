"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CATEGORY_COLORS } from "@/lib/categories";

interface Transaction {
  _id: string;
  amount: number;
  date: string;
  description: string;
  category: string;
}

interface CategoryPieChartProps {
  transactions: Transaction[];
}

export default function CategoryPieChart({
  transactions,
}: CategoryPieChartProps) {
  const getCategoryData = () => {
    const categoryTotals: { [key: string]: number } = {};

    transactions.forEach((transaction) => {
      const category = transaction.category;
      categoryTotals[category] = (categoryTotals[category] || 0) + transaction.amount;
    });

    return Object.entries(categoryTotals).map(([category, amount]) => ({
      name: category,
      value: amount,
    }));
  };

  const data = getCategoryData();

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500">No data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={CATEGORY_COLORS[entry.name as keyof typeof CATEGORY_COLORS]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [`$${value.toFixed(2)}`, "Amount"]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
} 