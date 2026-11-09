'use client';

import React from 'react';
import { X, Database, CheckCircle2, ExternalLink } from 'lucide-react';

interface DbInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  dbStatus: {
    connected: boolean;
    mode: string;
    transactionCount: number;
    categoryCount: number;
    databaseUrlConfigured: boolean;
  } | null;
}

export const DbInfoModal: React.FC<DbInfoModalProps> = ({ isOpen, onClose, dbStatus }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Status & Konfigurasi Database
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Informasi integrasi PostgreSQL & Vercel
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-sm text-slate-700 dark:text-slate-300">
          {/* Status Box */}
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 ${
              dbStatus?.connected
                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              <CheckCircle2
                className={`w-5 h-5 ${
                  dbStatus?.connected ? 'text-emerald-600' : 'text-amber-600'
                }`}
              />
            </div>
            <div className="text-xs space-y-1">
              <div className="font-semibold text-sm">
                Mode Berjalan:{' '}
                <span className="font-bold underline">
                  {dbStatus?.connected ? 'PostgreSQL Terhubung (Live)' : 'Mode Demo (In-Memory)'}
                </span>
              </div>
              <p>
                {dbStatus?.connected
                  ? 'Data Anda tersimpan secara persisten langsung di database PostgreSQL melalui Prisma ORM.'
                  : 'Aplikasi berjalan lancar dengan demo data in-memory fallback. Data akan otomatis beralih ke PostgreSQL ketika variabel DATABASE_URL diisi.'}
              </p>
            </div>
          </div>

          {/* Quick Guide */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Langkah Menghubungkan Cloud Database Gratis (Neon / Supabase):
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0 text-[10px]">
                  1
                </span>
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    Buat Database Gratis di Neon.tech atau Supabase:
                  </span>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                    Kunjungi{' '}
                    <a
                      href="https://neon.tech"
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-600 underline font-medium inline-flex items-center gap-0.5"
                    >
                      neon.tech <ExternalLink className="w-2.5 h-2.5" />
                    </a>{' '}
                    (Serverless Postgres gratis tanpa kartu kredit), buat project baru, dan salin Connection String (`postgresql://...`).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0 text-[10px]">
                  2
                </span>
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    Sinkronisasi Schema Database:
                  </span>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                    Jalankan perintah ini di terminal untuk membuat tabel secara otomatis:
                  </p>
                  <code className="block mt-1.5 p-2 rounded-lg bg-slate-900 text-emerald-400 font-mono text-[11px]">
                    npx prisma db push
                  </code>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0 text-[10px]">
                  3
                </span>
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    Deploy ke Vercel:
                  </span>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                    Di Dashboard Vercel, masuk ke menu <b>Settings &rarr; Environment Variables</b>, lalu tambahkan key <b>DATABASE_URL</b> dengan connection string Postgres Anda!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl hover:opacity-90 transition-opacity"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

