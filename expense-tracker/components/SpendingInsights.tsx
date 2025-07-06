"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingUp, TrendingDown, Target } from "lucide-react";

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

interface SpendingInsightsProps {
  transactions: Transaction[];
  budgets: Budget[];
  currentMonth: string;
}

export default function SpendingInsights({
  transactions,
  budgets,
  currentMonth,
}: SpendingInsightsProps) {
  const getInsights = () => {
    const categoryTotals: { [key: string]: number } = {};
    const budgetMap: { [key: string]: number } = {};
    const insights: Array<{
      type: "over" | "under" | "warning" | "good";
      category: string;
      message: string;
      amount: number;
      percentage: number;
    }> = [];

    // Calculate actual spending by category
    transactions.forEach((transaction) => {
      const transactionMonth = transaction.date.slice(0, 7);
      if (transactionMonth === currentMonth) {
        const category = transaction.category;
        categoryTotals[category] = (categoryTotals[category] || 0) + transaction.amount;
      }
    });

    // Create budget map
    budgets.forEach((budget) => {
      budgetMap[budget.category] = budget.amount;
    });

    // Generate insights
    Object.keys(budgetMap).forEach((category) => {
      const actual = categoryTotals[category] || 0;
      const budget = budgetMap[category];
      const difference = actual - budget;
      const percentage = (actual / budget) * 100;

      if (percentage > 100) {
        insights.push({
          type: "over",
          category,
          message: `Over budget by $${Math.abs(difference).toFixed(2)}`,
          amount: Math.abs(difference),
          percentage,
        });
      } else if (percentage > 80) {
        insights.push({
          type: "warning",
          category,
          message: `Close to budget limit (${percentage.toFixed(1)}%)`,
          amount: difference,
          percentage,
        });
      } else if (percentage < 50) {
        insights.push({
          type: "good",
          category,
          message: `Well under budget (${percentage.toFixed(1)}%)`,
          amount: difference,
          percentage,
        });
      }
    });

    // Find highest spending category
    const highestSpending = Object.entries(categoryTotals).reduce(
      (max, [category, amount]) => (amount > max.amount ? { category, amount } : max),
      { category: "", amount: 0 }
    );

    if (highestSpending.category) {
      insights.push({
        type: "warning",
        category: highestSpending.category,
        message: `Highest spending category: $${highestSpending.amount.toFixed(2)}`,
        amount: highestSpending.amount,
        percentage: 0,
      });
    }

    return insights;
  };

  const insights = getInsights();

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "over":
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "good":
        return <TrendingDown className="h-4 w-4 text-green-500" />;
      default:
        return <Target className="h-4 w-4 text-blue-500" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case "over":
        return "border-red-200 bg-red-50";
      case "warning":
        return "border-yellow-200 bg-yellow-50";
      case "good":
        return "border-green-200 bg-green-50";
      default:
        return "border-blue-200 bg-blue-50";
    }
  };

  if (insights.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spending Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500">No insights available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-3 border rounded-lg ${getInsightColor(
                insight.type
              )}`}
            >
              <div className="flex items-center gap-3">
                {getInsightIcon(insight.type)}
                <div>
                  <p className="font-medium">{insight.category}</p>
                  <p className="text-sm text-gray-600">{insight.message}</p>
                </div>
              </div>
              <Badge variant="secondary">
                ${insight.amount.toFixed(2)}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 