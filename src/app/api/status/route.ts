import { NextResponse } from 'next/server';
import { checkDatabaseHealth } from '@/lib/db-service';
import { prisma } from '@/lib/prisma';
import { mockStore } from '@/lib/mock-store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const isDb = await checkDatabaseHealth();
  let transactionCount = 0;
  let categoryCount = 0;

  if (isDb) {
    try {
      [transactionCount, categoryCount] = await Promise.all([
        prisma.transaction.count(),
        prisma.category.count(),
      ]);
    } catch {
      // If error occurs, ignore
    }
  } else {
    transactionCount = mockStore.getTransactions().length;
    categoryCount = mockStore.getCategories().length;
  }

  return NextResponse.json({
    connected: isDb,
    mode: isDb ? 'PostgreSQL (Prisma)' : 'Demo / In-Memory Mode',
    transactionCount,
    categoryCount,
    databaseUrlConfigured: Boolean(process.env.DATABASE_URL),
  });
}

