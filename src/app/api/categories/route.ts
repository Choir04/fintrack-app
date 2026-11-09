import { NextResponse } from 'next/server';
import { getCategories, createCategory } from '@/lib/db-service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await getCategories();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Gagal mengambil kategori', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, type, color, icon } = body;

    if (!name || !type) {
      return NextResponse.json(
        { error: 'Nama dan Tipe Kategori wajib diisi' },
        { status: 400 }
      );
    }

    if (type !== 'INCOME' && type !== 'EXPENSE') {
      return NextResponse.json(
        { error: 'Tipe harus bernilai INCOME atau EXPENSE' },
        { status: 400 }
      );
    }

    const result = await createCategory({ name, type, color, icon });
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Gagal menambahkan kategori', details: (error as Error).message },
      { status: 500 }
    );
  }
}

