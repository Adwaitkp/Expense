import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Expense Tracker',
  description: 'Track your expenses, budgets, and insights.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
} 