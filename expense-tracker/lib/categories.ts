export const CATEGORIES = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Healthcare",
  "Utilities",
  "Housing",
  "Education",
  "Travel",
  "Other",
] as const;

export type Category = typeof CATEGORIES[number];

export const CATEGORY_COLORS: Record<Category, string> = {
  "Food & Dining": "#ef4444",
  "Transportation": "#3b82f6",
  "Shopping": "#8b5cf6",
  "Entertainment": "#f59e0b",
  "Healthcare": "#10b981",
  "Utilities": "#6b7280",
  "Housing": "#84cc16",
  "Education": "#06b6d4",
  "Travel": "#f97316",
  "Other": "#a855f7",
}; 