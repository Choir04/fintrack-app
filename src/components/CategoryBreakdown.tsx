'use client';

import React from 'react';
import { PieChart } from 'lucide-react';
import { TransactionItem } from '@/lib/mock-store';
import { formatCurrency } from '@/lib/utils';

interface CategoryBreakdownProps {
  transactions: TransactionItem[];
}

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ transactions }) => {
  const expenseTransactions = transactions.filter(t => t.type === 'EXPENSE');
  const totalExpense = expenseTransactions.reduce((acc, curr) => acc + curr.amount, 0);

  // Group by category
  const categoryMap: {
    [key: string]: { name: string; color: string; amount: number; count: number };
  } = {};

  expenseTransactions.forEach(t => {
    const catName = t.category?.name || 'Lainnya';
    const catColor = t.category?.color || '#94a3b8';

    if (!categoryMap[catName]) {
      categoryMap[catName] = {
        name: catName,
        color: catColor,
        amount: 0,
        count: 0,
      };
    }
    categoryMap[catName].amount += t.amount;
    categoryMap[catName].count += 1;
  });

  const categoryList = Object.values(categoryMap).sort((a, b) => b.amount - a.amount);

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <PieChart className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Distribusi Pengeluaran
          </h3>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Total: {formatCurrency(totalExpense)}
        </span>
      </div>

      <div className="mt-4 space-y-3">
        {categoryList.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-400 dark:text-slate-500">
            Belum ada transaksi pengeluaran tercatat
          </div>
        ) : (
          categoryList.slice(0, 5).map(cat => {
            const percentage =
              totalExpense > 0 ? Math.round((cat.amount / totalExpense) * 100) : 0;
            return (
              <div key={cat.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block"
                      style={{ backgroundColor: cat.color }}
                    />
                    {cat.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 dark:text-slate-400">
                      {formatCurrency(cat.amount)}
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 w-9 text-right">
                      {percentage}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

