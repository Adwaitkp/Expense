"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface Budget {
  _id: string;
  category: string;
  amount: number;
  month: string;
}

interface BudgetListProps {
  budgets: Budget[];
  onEdit: (budget: Budget) => void;
  onDelete: (id: string) => void;
}

export default function BudgetList({
  budgets,
  onEdit,
  onDelete,
}: BudgetListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  if (budgets.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">No budgets set for this month.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Budgets</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {budgets.map((budget) => (
            <div
              key={budget._id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium">{budget.category}</p>
                  <Badge variant="outline">
                    {format(new Date(budget.month + "-01"), "MMM yyyy")}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-blue-600">
                  ${budget.amount.toFixed(2)}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(budget)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(budget._id)}
                  disabled={deletingId === budget._id}
                >
                  {deletingId === budget._id ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 