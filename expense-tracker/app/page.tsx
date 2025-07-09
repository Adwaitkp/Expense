"use client";

import { useState, useEffect } from "react";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import MonthlyExpensesChart from "@/components/MonthlyExpensesChart";
import CategoryPieChart from "@/components/CategoryPieChart";
import DashboardSummary from "@/components/DashboardSummary";
import BudgetForm from "@/components/BudgetForm";
import BudgetList from "@/components/BudgetList";
import BudgetVsActualChart from "@/components/BudgetVsActualChart";
import SpendingInsights from "@/components/SpendingInsights";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { debounce } from "@/lib/utils";

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

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const fetchTransactions = async () => {
    try {
      const response = await fetch("/api/transactions");
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    }
  };

  const fetchBudgets = async () => {
    try {
      const response = await fetch(`/api/budgets?month=${currentMonth}`);
      const data = await response.json();
      setBudgets(data);
    } catch (error) {
      console.error("Failed to fetch budgets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchBudgets();
  }, [currentMonth]);

  const handleAddTransaction = async (formData: {
    amount: string;
    date: string;
    description: string;
    category: string;
  }) => {
    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchTransactions();
      }
    } catch (error) {
      console.error("Failed to add transaction:", error);
    }
  };

  const handleEditTransaction = async (formData: {
    amount: string;
    date: string;
    description: string;
    category: string;
  }) => {
    if (!editingTransaction) return;

    try {
      const response = await fetch(`/api/transactions/${editingTransaction._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchTransactions();
        setEditingTransaction(null);
      }
    } catch (error) {
      console.error("Failed to update transaction:", error);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchTransactions();
      }
    } catch (error) {
      console.error("Failed to delete transaction:", error);
    }
  };

  const handleAddBudget = async (formData: {
    category: string;
    amount: string;
    month: string;
  }) => {
    try {
      const response = await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchBudgets();
      }
    } catch (error) {
      console.error("Failed to add budget:", error);
    }
  };

  const handleEditBudget = async (formData: {
    category: string;
    amount: string;
    month: string;
  }) => {
    if (!editingBudget) return;

    try {
      const response = await fetch(`/api/budgets/${editingBudget._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: formData.amount }),
      });

      if (response.ok) {
        await fetchBudgets();
        setEditingBudget(null);
      }
    } catch (error) {
      console.error("Failed to update budget:", error);
    }
  };

  const handleDeleteBudget = async (id: string) => {
    try {
      const response = await fetch(`/api/budgets/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchBudgets();
      }
    } catch (error) {
      console.error("Failed to delete budget:", error);
    }
  };

  const debouncedAddTransaction = debounce(handleAddTransaction, 1000);
  const debouncedAddBudget = debounce(handleAddBudget, 1000);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center">Expense Tracker</h1>
      
      {/* Month Selector */}
      <div className="flex justify-center">
        <input
          type="month"
          value={currentMonth}
          onChange={(e) => setCurrentMonth(e.target.value)}
          className="border rounded-lg px-3 py-2"
        />
      </div>
      
      {/* Dashboard Summary */}
      <DashboardSummary transactions={transactions} />
      
      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="budgets">Budgets</TabsTrigger>
        </TabsList>
        
        <TabsContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <TransactionForm
                onSubmit={editingTransaction ? handleEditTransaction : debouncedAddTransaction}
                initialData={
                  editingTransaction
                    ? {
                        amount: editingTransaction.amount.toString(),
                        date: editingTransaction.date.split("T")[0],
                        description: editingTransaction.description,
                        category: editingTransaction.category,
                      }
                    : undefined
                }
                isEditing={!!editingTransaction}
              />
              
              {editingTransaction && (
                <Button
                  variant="outline"
                  onClick={() => setEditingTransaction(null)}
                  className="mt-4 w-full"
                >
                  Cancel Edit
                </Button>
              )}
            </div>
            
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MonthlyExpensesChart transactions={transactions} />
                <CategoryPieChart transactions={transactions} />
              </div>
              
              <TransactionList
                transactions={transactions}
                onEdit={setEditingTransaction}
                onDelete={handleDeleteTransaction}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <BudgetForm
                onSubmit={editingBudget ? handleEditBudget : debouncedAddBudget}
                initialData={
                  editingBudget
                    ? {
                        category: editingBudget.category,
                        amount: editingBudget.amount.toString(),
                        month: editingBudget.month,
                      }
                    : undefined
                }
                isEditing={!!editingBudget}
              />
              
              {editingBudget && (
                <Button
                  variant="outline"
                  onClick={() => setEditingBudget(null)}
                  className="mt-4 w-full"
                >
                  Cancel Edit
                </Button>
              )}
              
              <BudgetList
                budgets={budgets}
                onEdit={setEditingBudget}
                onDelete={handleDeleteBudget}
              />
            </div>
            
            <div className="lg:col-span-2 space-y-6">
              <BudgetVsActualChart
                transactions={transactions}
                budgets={budgets}
                currentMonth={currentMonth}
              />
              
              <SpendingInsights
                transactions={transactions}
                budgets={budgets}
                currentMonth={currentMonth}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 