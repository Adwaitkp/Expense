"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { CATEGORY_COLORS } from "@/lib/categories";

interface Transaction {
  _id: string;
  amount: number;
  date: string;
  description: string;
  category: string;
}

interface DashboardSummaryProps {
  transactions: Transaction[];
}

export default function DashboardSummary({
  transactions,
}: DashboardSummaryProps) {
  const totalExpenses = transactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0
  );

  const getCategoryBreakdown = () => {
    const categoryTotals: { [key: string]: number } = {};
    
    transactions.forEach((transaction) => {
      const category = transaction.category;
      categoryTotals[category] = (categoryTotals[category] || 0) + transaction.amount;
    });

    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  };

  const getRecentTransactions = () => {
    return transactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  };

  const categoryBreakdown = getCategoryBreakdown();
  const recentTransactions = getRecentTransactions();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Expenses Card */}
      <Card>
        <CardHeader>
          <CardTitle>Total Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-red-600">
            ${totalExpenses.toFixed(2)}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {transactions.length} transactions
          </p>
        </CardContent>
      </Card>

      {/* Category Breakdown Card */}
      <Card>
        <CardHeader>
          <CardTitle>Top Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {categoryBreakdown.map(({ category, amount }) => (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS],
                    }}
                  />
                  <span className="text-sm">{category}</span>
                </div>
                <span className="text-sm font-medium">
                  ${amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions Card */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentTransactions.map((transaction) => (
              <div key={transaction._id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium truncate max-w-[120px]">
                    {transaction.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    {format(new Date(transaction.date), "MMM dd")}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Badge
                    variant="secondary"
                    className="text-xs"
                    style={{
                      backgroundColor: CATEGORY_COLORS[transaction.category as keyof typeof CATEGORY_COLORS],
                      color: "white",
                    }}
                  >
                    {transaction.category}
                  </Badge>
                  <span className="text-sm font-medium text-red-600">
                    -${transaction.amount.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 