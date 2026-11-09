import { NextResponse } from 'next/server';
import { seedDemoData } from '@/lib/db-service';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const result = await seedDemoData();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Gagal melakukan seed database', details: (error as Error).message },
      { status: 500 }
    );
  }
}

