import { prisma } from './prisma';
import { Prisma, TransactionType } from '@prisma/client';
import { mockStore, CategoryItem, TransactionItem } from './mock-store';

let dbHealthy: boolean | null = null;
let lastCheckTime = 0;

export async function checkDatabaseHealth(): Promise<boolean> {
  // Cache connection state for 15 seconds to avoid hammering
  const now = Date.now();
  if (dbHealthy !== null && now - lastCheckTime < 15000) {
    return dbHealthy;
  }

  if (!process.env.DATABASE_URL) {
    dbHealthy = false;
    lastCheckTime = now;
    return false;
  }

  try {
    // 3 second timeout test
    await Promise.race([
      prisma.$queryRaw`SELECT 1`,
      new Promise((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 3000)),
    ]);
    dbHealthy = true;
    lastCheckTime = now;
    return true;
  } catch (error) {
    console.warn('Database not reachable, falling back to in-memory store:', (error as Error).message);
    dbHealthy = false;
    lastCheckTime = now;
    return false;
  }
}

export async function getCategories(): Promise<{ categories: CategoryItem[]; isDb: boolean }> {
  const isDb = await checkDatabaseHealth();
  if (isDb) {
    try {
      const cats = await prisma.category.findMany({
        orderBy: { name: 'asc' },
      });
      // If DB is empty, auto-seed default categories
      if (cats.length === 0) {
        await seedDefaultCategories();
        const seededCats = await prisma.category.findMany({
          orderBy: { name: 'asc' },
        });
        return {
          categories: seededCats.map(c => ({
            ...c,
            createdAt: c.createdAt.toISOString(),
          })),
          isDb: true,
        };
      }
      return {
        categories: cats.map(c => ({
          ...c,
          createdAt: c.createdAt.toISOString(),
        })),
        isDb: true,
      };
    } catch (err) {
      console.error('Error fetching categories from DB:', err);
    }
  }

  return {
    categories: mockStore.getCategories(),
    isDb: false,
  };
}

export async function createCategory(data: {
  name: string;
  type: 'INCOME' | 'EXPENSE';
  color?: string;
  icon?: string;
}) {
  const isDb = await checkDatabaseHealth();
  if (isDb) {
    try {
      const cat = await prisma.category.create({
        data: {
          name: data.name,
          type: data.type,
          color: data.color || '#3b82f6',
          icon: data.icon || 'tag',
        },
      });
      return { category: { ...cat, createdAt: cat.createdAt.toISOString() }, isDb: true };
    } catch (err) {
      console.error('Error creating category in DB:', err);
    }
  }

  const cat = mockStore.addCategory({
    name: data.name,
    type: data.type,
    color: data.color || '#3b82f6',
    icon: data.icon || 'tag',
  });
  return { category: cat, isDb: false };
}

export async function getTransactions(filters?: {
  type?: string;
  categoryId?: string;
  search?: string;
}): Promise<{ transactions: TransactionItem[]; isDb: boolean }> {
  const isDb = await checkDatabaseHealth();
  if (isDb) {
    try {
      const where: Prisma.TransactionWhereInput = {};
      if (filters?.type && filters.type !== 'ALL') {
        where.type = filters.type as TransactionType;
      }
      if (filters?.categoryId && filters.categoryId !== 'ALL') {
        where.categoryId = filters.categoryId;
      }
      if (filters?.search && filters.search.trim()) {
        where.OR = [
          { title: { contains: filters.search, mode: 'insensitive' } },
          { notes: { contains: filters.search, mode: 'insensitive' } },
        ];
      }

      const txs = await prisma.transaction.findMany({
        where,
        include: { category: true },
        orderBy: { date: 'desc' },
      });

      return {
        transactions: txs.map(t => ({
          ...t,
          date: t.date.toISOString(),
          createdAt: t.createdAt.toISOString(),
          updatedAt: t.updatedAt.toISOString(),
          category: t.category
            ? {
                ...t.category,
                createdAt: t.category.createdAt.toISOString(),
              }
            : undefined,
        })),
        isDb: true,
      };
    } catch (err) {
      console.error('Error fetching transactions from DB:', err);
    }
  }

  // Fallback to mock store
  let items = mockStore.getTransactions();
  if (filters?.type && filters.type !== 'ALL') {
    items = items.filter(t => t.type === filters.type);
  }
  if (filters?.categoryId && filters.categoryId !== 'ALL') {
    items = items.filter(t => t.categoryId === filters.categoryId);
  }
  if (filters?.search && filters.search.trim()) {
    const q = filters.search.toLowerCase();
    items = items.filter(
      t => t.title.toLowerCase().includes(q) || (t.notes && t.notes.toLowerCase().includes(q))
    );
  }

  return {
    transactions: items,
    isDb: false,
  };
}

export async function createTransaction(data: {
  title: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  categoryId: string;
  date?: string;
  notes?: string;
}) {
  const isDb = await checkDatabaseHealth();
  if (isDb) {
    try {
      const tx = await prisma.transaction.create({
        data: {
          title: data.title,
          amount: data.amount,
          type: data.type,
          categoryId: data.categoryId,
          date: data.date ? new Date(data.date) : new Date(),
          notes: data.notes || null,
        },
        include: { category: true },
      });
      return {
        transaction: {
          ...tx,
          date: tx.date.toISOString(),
          createdAt: tx.createdAt.toISOString(),
          updatedAt: tx.updatedAt.toISOString(),
          category: tx.category
            ? {
                ...tx.category,
                createdAt: tx.category.createdAt.toISOString(),
              }
            : undefined,
        },
        isDb: true,
      };
    } catch (err) {
      console.error('Error creating transaction in DB:', err);
    }
  }

  const tx = mockStore.addTransaction({
    title: data.title,
    amount: data.amount,
    type: data.type,
    categoryId: data.categoryId,
    date: data.date || new Date().toISOString(),
    notes: data.notes || null,
  });

  const cats = mockStore.getCategories();
  const cat = cats.find(c => c.id === data.categoryId);

  return {
    transaction: {
      ...tx,
      category: cat,
    },
    isDb: false,
  };
}

export async function updateTransaction(
  id: string,
  data: {
    title?: string;
    amount?: number;
    type?: 'INCOME' | 'EXPENSE';
    categoryId?: string;
    date?: string;
    notes?: string;
  }
) {
  const isDb = await checkDatabaseHealth();
  if (isDb) {
    try {
      const updateData: Prisma.TransactionUpdateInput = {};
      if (data.title !== undefined) updateData.title = data.title;
      if (data.amount !== undefined) updateData.amount = data.amount;
      if (data.type !== undefined) updateData.type = data.type as TransactionType;
      if (data.categoryId !== undefined) {
        updateData.category = { connect: { id: data.categoryId } };
      }
      if (data.date !== undefined) updateData.date = new Date(data.date);
      if (data.notes !== undefined) updateData.notes = data.notes;

      const tx = await prisma.transaction.update({
        where: { id },
        data: updateData,
        include: { category: true },
      });

      return {
        transaction: {
          ...tx,
          date: tx.date.toISOString(),
          createdAt: tx.createdAt.toISOString(),
          updatedAt: tx.updatedAt.toISOString(),
          category: tx.category
            ? {
                ...tx.category,
                createdAt: tx.category.createdAt.toISOString(),
              }
            : undefined,
        },
        isDb: true,
      };
    } catch (err) {
      console.error('Error updating transaction in DB:', err);
    }
  }

  const updated = mockStore.updateTransaction(id, data);
  const cats = mockStore.getCategories();
  return {
    transaction: updated
      ? {
          ...updated,
          category: cats.find(c => c.id === updated.categoryId),
        }
      : null,
    isDb: false,
  };
}

export async function deleteTransaction(id: string) {
  const isDb = await checkDatabaseHealth();
  if (isDb) {
    try {
      await prisma.transaction.delete({
        where: { id },
      });
      return { success: true, isDb: true };
    } catch (err) {
      console.error('Error deleting transaction in DB:', err);
    }
  }

  const success = mockStore.deleteTransaction(id);
  return { success, isDb: false };
}

export async function seedDefaultCategories() {
  const defaultCats = [
    { name: 'Gaji & Pendapatan', type: 'INCOME' as const, color: '#10b981', icon: 'wallet' },
    { name: 'Freelance & Bisnis', type: 'INCOME' as const, color: '#06b6d4', icon: 'briefcase' },
    { name: 'Investasi & Dividen', type: 'INCOME' as const, color: '#8b5cf6', icon: 'trending-up' },
    { name: 'Makanan & Minuman', type: 'EXPENSE' as const, color: '#f59e0b', icon: 'utensils' },
    { name: 'Transportasi', type: 'EXPENSE' as const, color: '#3b82f6', icon: 'car' },
    { name: 'Belanja & Kebutuhan', type: 'EXPENSE' as const, color: '#ec4899', icon: 'shopping-bag' },
    { name: 'Tagihan & Utilitas', type: 'EXPENSE' as const, color: '#ef4444', icon: 'receipt' },
    { name: 'Hiburan & Liburan', type: 'EXPENSE' as const, color: '#a855f7', icon: 'film' },
    { name: 'Kesehatan & Medis', type: 'EXPENSE' as const, color: '#14b8a6', icon: 'activity' },
    { name: 'Pendidikan & Kursus', type: 'EXPENSE' as const, color: '#6366f1', icon: 'book-open' },
  ];

  for (const cat of defaultCats) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: { type: cat.type, color: cat.color, icon: cat.icon },
      create: cat,
    });
  }
}

export async function seedDemoData() {
  const isDb = await checkDatabaseHealth();
  if (isDb) {
    await seedDefaultCategories();
    const categories = await prisma.category.findMany();
    const catMap = new Map(categories.map(c => [c.name, c.id]));

    const samples = [
      { title: 'Gaji Bulanan', amount: 12500000, type: 'INCOME' as const, cat: 'Gaji & Pendapatan', days: -10, notes: 'Gaji pokok' },
      { title: 'Bonus Project Web', amount: 3500000, type: 'INCOME' as const, cat: 'Freelance & Bisnis', days: -6, notes: 'Bonus kilat' },
      { title: 'Belanja Bulanan Mart', amount: 1250000, type: 'EXPENSE' as const, cat: 'Belanja & Kebutuhan', days: -8, notes: 'Keperluan rumah' },
      { title: 'Bensin & Cuci Mobil', amount: 320000, type: 'EXPENSE' as const, cat: 'Transportasi', days: -5, notes: 'Pertamax turbo' },
      { title: 'Makan Bareng Rekan Kerja', amount: 210000, type: 'EXPENSE' as const, cat: 'Makanan & Minuman', days: -3, notes: 'Makan siang' },
      { title: 'Listrik & WiFi Rumah', amount: 780000, type: 'EXPENSE' as const, cat: 'Tagihan & Utilitas', days: -2, notes: 'Listrik PLN' },
      { title: 'Beli Buku Tech', amount: 195000, type: 'EXPENSE' as const, cat: 'Pendidikan & Kursus', days: -1, notes: 'Buku arsitektur cloud' },
    ];

    for (const item of samples) {
      const categoryId = catMap.get(item.cat);
      if (categoryId) {
        const d = new Date();
        d.setDate(d.getDate() + item.days);
        await prisma.transaction.create({
          data: {
            title: item.title,
            amount: item.amount,
            type: item.type,
            notes: item.notes,
            date: d,
            categoryId,
          },
        });
      }
    }
    return { success: true, count: samples.length, isDb: true };
  }

  mockStore.resetSampleData();
  return { success: true, count: 8, isDb: false };
}

