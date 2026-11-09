export interface CategoryItem {
  id: string;
  name: string;
  type: 'INCOME' | 'EXPENSE';
  color: string;
  icon: string;
  createdAt: string;
}

export interface TransactionItem {
  id: string;
  title: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  date: string;
  notes?: string | null;
  categoryId: string;
  category?: CategoryItem;
  createdAt: string;
  updatedAt: string;
}

const initialCategories: CategoryItem[] = [
  { id: 'cat-1', name: 'Gaji & Pendapatan', type: 'INCOME', color: '#10b981', icon: 'wallet', createdAt: new Date().toISOString() },
  { id: 'cat-2', name: 'Freelance & Bisnis', type: 'INCOME', color: '#06b6d4', icon: 'briefcase', createdAt: new Date().toISOString() },
  { id: 'cat-3', name: 'Investasi & Dividen', type: 'INCOME', color: '#8b5cf6', icon: 'trending-up', createdAt: new Date().toISOString() },
  { id: 'cat-4', name: 'Makanan & Minuman', type: 'EXPENSE', color: '#f59e0b', icon: 'utensils', createdAt: new Date().toISOString() },
  { id: 'cat-5', name: 'Transportasi', type: 'EXPENSE', color: '#3b82f6', icon: 'car', createdAt: new Date().toISOString() },
  { id: 'cat-6', name: 'Belanja & Kebutuhan', type: 'EXPENSE', color: '#ec4899', icon: 'shopping-bag', createdAt: new Date().toISOString() },
  { id: 'cat-7', name: 'Tagihan & Utilitas', type: 'EXPENSE', color: '#ef4444', icon: 'receipt', createdAt: new Date().toISOString() },
  { id: 'cat-8', name: 'Hiburan & Liburan', type: 'EXPENSE', color: '#a855f7', icon: 'film', createdAt: new Date().toISOString() },
  { id: 'cat-9', name: 'Kesehatan & Medis', type: 'EXPENSE', color: '#14b8a6', icon: 'activity', createdAt: new Date().toISOString() },
  { id: 'cat-10', name: 'Pendidikan & Kursus', type: 'EXPENSE', color: '#6366f1', icon: 'book-open', createdAt: new Date().toISOString() },
];

const getPastDate = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
};

const initialTransactions: TransactionItem[] = [
  {
    id: 'tx-1',
    title: 'Gaji Bulanan Utama',
    amount: 12500000,
    type: 'INCOME',
    categoryId: 'cat-1',
    notes: 'Transfer gaji bulan berjalan',
    date: getPastDate(12),
    createdAt: getPastDate(12),
    updatedAt: getPastDate(12),
  },
  {
    id: 'tx-2',
    title: 'Proyek Desain Web Klien',
    amount: 4500000,
    type: 'INCOME',
    categoryId: 'cat-2',
    notes: 'Pembayaran termin 1 redesign website',
    date: getPastDate(8),
    createdAt: getPastDate(8),
    updatedAt: getPastDate(8),
  },
  {
    id: 'tx-3',
    title: 'Belanja Bulanan Supermarket',
    amount: 1450000,
    type: 'EXPENSE',
    categoryId: 'cat-6',
    notes: 'Bahan pokok makanan dan rumah tangga',
    date: getPastDate(7),
    createdAt: getPastDate(7),
    updatedAt: getPastDate(7),
  },
  {
    id: 'tx-4',
    title: 'Bensin & Saldo E-Toll',
    amount: 350000,
    type: 'EXPENSE',
    categoryId: 'cat-5',
    notes: 'Isi BBM kendaraan pribadi',
    date: getPastDate(5),
    createdAt: getPastDate(5),
    updatedAt: getPastDate(5),
  },
  {
    id: 'tx-5',
    title: 'Makan Malam Restoran Bareng Keluarga',
    amount: 480000,
    type: 'EXPENSE',
    categoryId: 'cat-4',
    notes: 'Acara akhir pekan',
    date: getPastDate(3),
    createdAt: getPastDate(3),
    updatedAt: getPastDate(3),
  },
  {
    id: 'tx-6',
    title: 'Tagihan Listrik PLN & Internet',
    amount: 820000,
    type: 'EXPENSE',
    categoryId: 'cat-7',
    notes: 'Tagihan utilitas rumah',
    date: getPastDate(2),
    createdAt: getPastDate(2),
    updatedAt: getPastDate(2),
  },
  {
    id: 'tx-7',
    title: 'Dividen Reksadana Saham',
    amount: 680000,
    type: 'INCOME',
    categoryId: 'cat-3',
    notes: 'Yield bulanan investasi',
    date: getPastDate(1),
    createdAt: getPastDate(1),
    updatedAt: getPastDate(1),
  },
  {
    id: 'tx-8',
    title: 'Langganan Streaming & Game',
    amount: 235000,
    type: 'EXPENSE',
    categoryId: 'cat-8',
    notes: 'Netflix dan Spotify Family',
    date: getPastDate(0),
    createdAt: getPastDate(0),
    updatedAt: getPastDate(0),
  },
];

// Global in-memory cache for fallback mode
const globalStore = globalThis as unknown as {
  mockCategories?: CategoryItem[];
  mockTransactions?: TransactionItem[];
};

if (!globalStore.mockCategories) {
  globalStore.mockCategories = [...initialCategories];
}

if (!globalStore.mockTransactions) {
  globalStore.mockTransactions = [...initialTransactions];
}

export const mockStore = {
  getCategories: () => globalStore.mockCategories || initialCategories,
  getTransactions: () => {
    const cats = globalStore.mockCategories || initialCategories;
    const catMap = new Map(cats.map(c => [c.id, c]));
    return (globalStore.mockTransactions || initialTransactions).map(tx => ({
      ...tx,
      category: catMap.get(tx.categoryId),
    }));
  },
  addCategory: (item: Omit<CategoryItem, 'id' | 'createdAt'>) => {
    const newCat: CategoryItem = {
      ...item,
      id: `cat-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    globalStore.mockCategories?.push(newCat);
    return newCat;
  },
  addTransaction: (item: Omit<TransactionItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTx: TransactionItem = {
      ...item,
      id: `tx-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    globalStore.mockTransactions?.unshift(newTx);
    return newTx;
  },
  updateTransaction: (id: string, item: Partial<TransactionItem>) => {
    const idx = globalStore.mockTransactions?.findIndex(t => t.id === id);
    if (idx !== undefined && idx >= 0 && globalStore.mockTransactions) {
      globalStore.mockTransactions[idx] = {
        ...globalStore.mockTransactions[idx],
        ...item,
        updatedAt: new Date().toISOString(),
      };
      return globalStore.mockTransactions[idx];
    }
    return null;
  },
  deleteTransaction: (id: string) => {
    if (globalStore.mockTransactions) {
      globalStore.mockTransactions = globalStore.mockTransactions.filter(t => t.id !== id);
      return true;
    }
    return false;
  },
  resetSampleData: () => {
    globalStore.mockCategories = [...initialCategories];
    globalStore.mockTransactions = [...initialTransactions];
    return true;
  }
};

