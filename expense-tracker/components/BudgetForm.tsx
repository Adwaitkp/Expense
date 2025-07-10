"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES } from "@/lib/categories";

interface BudgetFormProps {
  onSubmit: (data: { category: string; amount: string; month: string }) => void;
  initialData?: { category: string; amount: string; month: string };
  isEditing?: boolean;
}

export default function BudgetForm({
  onSubmit,
  initialData = { category: "", amount: "", month: "" },
  isEditing = false,
}: BudgetFormProps) {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    if (!formData.month) {
      newErrors.month = "Month is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      if (!isEditing) {
        setFormData({ category: "", amount: "", month: "" });
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditing ? "Edit Budget" : "Set Monthly Budget"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-1">
              Category
            </label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category}</p>
            )}
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium mb-1">
              Budget Amount
            </label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className={errors.amount ? "border-red-500" : ""}
            />
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
            )}
          </div>

          <div>
            <label htmlFor="month" className="block text-sm font-medium mb-1">
              Month
            </label>
            <Input
              id="month"
              type="month"
              value={formData.month}
              onChange={(e) =>
                setFormData({ ...formData, month: e.target.value })
              }
              className={errors.month ? "border-red-500" : ""}
            />
            {errors.month && (
              <p className="text-red-500 text-sm mt-1">{errors.month}</p>
            )}
          </div>

          <Button type="submit" className="w-full">
            {isEditing ? "Update Budget" : "Set Budget"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 