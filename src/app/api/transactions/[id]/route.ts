import { NextResponse } from 'next/server';
import { updateTransaction, deleteTransaction } from '@/lib/db-service';

export const dynamic = 'force-dynamic';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const result = await updateTransaction(id, {
      ...body,
      amount: body.amount !== undefined ? Number(body.amount) : undefined,
    });

    if (!result.transaction) {
      return NextResponse.json({ error: 'Transaksi tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Gagal memperbarui transaksi', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await deleteTransaction(id);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Gagal menghapus transaksi', details: (error as Error).message },
      { status: 500 }
    );
  }
}

