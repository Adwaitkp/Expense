"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export default function TransactionList({
  transactions,
  onEdit,
  onDelete,
}: TransactionListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">No transactions found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div
              key={transaction._id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium">{transaction.description}</p>
                  <Badge
                    variant="secondary"
                    style={{
                      backgroundColor: CATEGORY_COLORS[transaction.category as keyof typeof CATEGORY_COLORS],
                      color: "white",
                    }}
                  >
                    {transaction.category}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">
                  {format(new Date(transaction.date), "MMM dd, yyyy")}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-red-600">
                  -${transaction.amount.toFixed(2)}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(transaction)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(transaction._id)}
                  disabled={deletingId === transaction._id}
                >
                  {deletingId === transaction._id ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 