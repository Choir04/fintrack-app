'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { StatsCards } from '@/components/StatsCards';
import { CategoryBreakdown } from '@/components/CategoryBreakdown';
import { TransactionList } from '@/components/TransactionList';
import { TransactionModal } from '@/components/TransactionModal';
import { CategoryModal } from '@/components/CategoryModal';
import { DbInfoModal } from '@/components/DbInfoModal';
import { TransactionItem, CategoryItem } from '@/lib/mock-store';
import { Database, ArrowRight, ShieldCheck } from 'lucide-react';

export default function HomePage() {
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [dbStatus, setDbStatus] = useState<{
    connected: boolean;
    mode: string;
    transactionCount: number;
    categoryCount: number;
    databaseUrlConfigured: boolean;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<TransactionItem | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  // Fetch initial data
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [statusRes, catRes, txRes] = await Promise.all([
        fetch('/api/status'),
        fetch('/api/categories'),
        fetch('/api/transactions'),
      ]);

      if (statusRes.ok) {
        const s = await statusRes.json();
        setDbStatus(s);
      }
      if (catRes.ok) {
        const c = await catRes.json();
        setCategories(c.categories || []);
      }
      if (txRes.ok) {
        const t = await txRes.json();
        setTransactions(t.transactions || []);
      }
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle Save Transaction (Create or Update)
  const handleSaveTransaction = async (data: {
    id?: string;
    title: string;
    amount: number;
    type: 'INCOME' | 'EXPENSE';
    categoryId: string;
    date: string;
    notes?: string;
  }) => {
    if (data.id) {
      // Update
      const res = await fetch(`/api/transactions/${data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Gagal memperbarui transaksi');
      }
      const updated = await res.json();
      setTransactions(prev =>
        prev.map(t => (t.id === data.id ? updated.transaction : t))
      );
    } else {
      // Create
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Gagal menambahkan transaksi');
      }
      const created = await res.json();
      setTransactions(prev => [created.transaction, ...prev]);
    }
  };

  // Handle Delete Transaction
  const handleDeleteTransaction = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus catatan transaksi ini?')) {
      return;
    }

    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setTransactions(prev => prev.filter(t => t.id !== id));
      } else {
        alert('Gagal menghapus transaksi.');
      }
    } catch (err) {
      console.error('Error deleting transaction:', err);
      alert('Terjadi kesalahan saat menghapus.');
    }
  };

  // Handle Save Category
  const handleSaveCategory = async (data: {
    name: string;
    type: 'INCOME' | 'EXPENSE';
    color: string;
  }) => {
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Gagal membuat kategori');
    }
    const created = await res.json();
    setCategories(prev => [...prev, created.category]);
  };

  // Handle Seed Demo Data
  const handleSeedDemo = async () => {
    try {
      setIsSeeding(true);
      const res = await fetch('/api/seed', { method: 'POST' });
      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error('Error seeding data:', err);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-emerald-500 selection:text-white">
      {/* Header Bar */}
      <Header
        dbStatus={dbStatus}
        onOpenTransactionModal={() => {
          setEditingTransaction(null);
          setIsTransactionModalOpen(true);
        }}
        onOpenCategoryModal={() => setIsCategoryModalOpen(true)}
        onOpenDbModal={() => setIsDbModalOpen(true)}
        onSeedDemo={handleSeedDemo}
        isSeeding={isSeeding}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Informative Notification Banner */}
        {!bannerDismissed && !dbStatus?.connected && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900/10 via-teal-900/10 to-indigo-900/10 dark:from-emerald-950/40 dark:via-teal-950/40 dark:to-indigo-950/40 border border-emerald-500/20 backdrop-blur-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Database className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <span className="font-semibold text-slate-900 dark:text-white">
                  Siap Diupload ke GitHub & Dihosting di Vercel!
                </span>{' '}
                <span className="text-slate-600 dark:text-slate-400">
                  Aplikasi ini terkonfigurasi dengan Prisma ORM & PostgreSQL (Neon/Supabase). Saat ini berjalan dengan data demo interaktif.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <button
                onClick={() => setIsDbModalOpen(true)}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 transition-all"
              >
                <span>Lihat Panduan DB</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setBannerDismissed(true)}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-2 py-1.5"
              >
                Tutup
              </button>
            </div>
          </div>
        )}

        {/* Financial Overview Stats */}
        <StatsCards transactions={transactions} />

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Transactions List (Left 8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            <TransactionList
              transactions={transactions}
              categories={categories}
              isLoading={isLoading}
              onEdit={tx => {
                setEditingTransaction(tx);
                setIsTransactionModalOpen(true);
              }}
              onDelete={handleDeleteTransaction}
              onOpenCreateModal={() => {
                setEditingTransaction(null);
                setIsTransactionModalOpen(true);
              }}
            />
          </div>

          {/* Sidebar Widgets (Right 4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Category Breakdown Progress */}
            <CategoryBreakdown transactions={transactions} />

            {/* GitHub & Vercel Quick Card */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Fitur Deployment Cloud
                </h3>
              </div>
              <ul className="text-xs space-y-2 text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>
                    <b>Next.js 15 App Router</b>: Arsitektur modern performa tinggi siap serverless Vercel.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>
                    <b>Prisma ORM & PostgreSQL</b>: Kompatibel dengan Neon, Supabase, & Vercel Postgres.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>
                    <b>Build Hook Otomatis</b>: Sudah menyertakan <code className="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-1 rounded">postinstall</code> untuk Prisma Client.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>
                    <b>Fallback Mode Aman</b>: Tidak akan crash saat pertama kali di-deploy.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => {
          setIsTransactionModalOpen(false);
          setEditingTransaction(null);
        }}
        categories={categories}
        editingTransaction={editingTransaction}
        onSave={handleSaveTransaction}
      />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleSaveCategory}
      />

      <DbInfoModal
        isOpen={isDbModalOpen}
        onClose={() => setIsDbModalOpen(false)}
        dbStatus={dbStatus}
      />
    </div>
  );
}
