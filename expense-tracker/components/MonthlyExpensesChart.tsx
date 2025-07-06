"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";

interface Transaction {
  _id: string;
  amount: number;
  date: string;
  description: string;
  category: string;
}

interface MonthlyExpensesChartProps {
  transactions: Transaction[];
}

export default function MonthlyExpensesChart({
  transactions,
}: MonthlyExpensesChartProps) {
  const getMonthlyData = () => {
    const currentDate = new Date();
    const startDate = startOfMonth(currentDate);
    const endDate = endOfMonth(currentDate);
    
    const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate });
    
    return daysInMonth.map((day) => {
      const dayTransactions = transactions.filter(
        (transaction) =>
          format(new Date(transaction.date), "yyyy-MM-dd") ===
          format(day, "yyyy-MM-dd")
      );
      
      const totalAmount = dayTransactions.reduce(
        (sum, transaction) => sum + transaction.amount,
        0
      );
      
      return {
        date: format(day, "MMM dd"),
        amount: totalAmount,
      };
    });
  };

  const data = getMonthlyData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip
              formatter={(value: number) => [`$${value.toFixed(2)}`, "Amount"]}
            />
            <Bar dataKey="amount" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
} 