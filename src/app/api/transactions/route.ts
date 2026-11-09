import { NextResponse } from 'next/server';
import { getTransactions, createTransaction } from '@/lib/db-service';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || undefined;
    const categoryId = searchParams.get('categoryId') || undefined;
    const search = searchParams.get('search') || undefined;

    const result = await getTransactions({ type, categoryId, search });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Gagal mengambil transaksi', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, amount, type, categoryId, date, notes } = body;

    if (!title || amount === undefined || !type || !categoryId) {
      return NextResponse.json(
        { error: 'Field judul, jumlah nominal, tipe, dan kategori wajib diisi' },
        { status: 400 }
      );
    }

    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json(
        { error: 'Nominal harus berupa angka lebih dari 0' },
        { status: 400 }
      );
    }

    const result = await createTransaction({
      title,
      amount: parsedAmount,
      type,
      categoryId,
      date,
      notes,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Gagal menyimpan transaksi', details: (error as Error).message },
      { status: 500 }
    );
  }
}

