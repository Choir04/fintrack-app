'use client';

import React from 'react';
import {
  Wallet,
  PlusCircle,
  Database,
  Sparkles,
  Info,
  FolderPlus,
} from 'lucide-react';

interface HeaderProps {
  dbStatus: {
    connected: boolean;
    mode: string;
    transactionCount: number;
  } | null;
  onOpenTransactionModal: () => void;
  onOpenCategoryModal: () => void;
  onOpenDbModal: () => void;
  onSeedDemo: () => void;
  isSeeding: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  dbStatus,
  onOpenTransactionModal,
  onOpenCategoryModal,
  onOpenDbModal,
  onSeedDemo,
  isSeeding,
}) => {
  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                FinTrack
              </h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                v1.0
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Database-backed Finance & Expense Manager
            </p>
          </div>
        </div>

        {/* Database Status & Actions */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Status Badge */}
          <button
            onClick={onOpenDbModal}
            className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
              dbStatus?.connected
                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
                : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 hover:bg-amber-100'
            }`}
            title="Klik untuk melihat panduan setup database Vercel & Neon"
          >
            <Database className="w-3.5 h-3.5" />
            <span className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  dbStatus?.connected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
              />
              {dbStatus?.connected ? 'PostgreSQL Live' : 'Mode Demo (In-Memory)'}
            </span>
            <Info className="w-3 h-3 opacity-60 ml-0.5" />
          </button>

          {/* Seed Button */}
          <button
            onClick={onSeedDemo}
            disabled={isSeeding}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-all disabled:opacity-50"
            title="Isi database dengan transaksi dan kategori sampel"
          >
            <Sparkles className={`w-3.5 h-3.5 text-amber-500 ${isSeeding ? 'animate-spin' : ''}`} />
            <span>{isSeeding ? 'Memuat...' : 'Seed Data'}</span>
          </button>

          {/* New Category Button */}
          <button
            onClick={onOpenCategoryModal}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-all"
          >
            <FolderPlus className="w-3.5 h-3.5 text-blue-500" />
            <span className="hidden sm:inline">Kategori</span>
          </button>

          {/* Add Transaction Primary CTA */}
          <button
            onClick={onOpenTransactionModal}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold px-3.5 py-1.5 sm:py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white shadow-sm shadow-emerald-600/30 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tambah Transaksi</span>
          </button>
        </div>
      </div>
    </header>
  );
};

