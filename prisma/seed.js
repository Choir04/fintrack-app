const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const defaultCategories = [
  { name: 'Gaji & Pendapatan', type: 'INCOME', color: '#10b981', icon: 'wallet' },
  { name: 'Freelance & Bisnis', type: 'INCOME', color: '#06b6d4', icon: 'briefcase' },
  { name: 'Investasi & Dividen', type: 'INCOME', color: '#8b5cf6', icon: 'trending-up' },
  { name: 'Makanan & Minuman', type: 'EXPENSE', color: '#f59e0b', icon: 'utensils' },
  { name: 'Transportasi', type: 'EXPENSE', color: '#3b82f6', icon: 'car' },
  { name: 'Belanja & Kebutuhan', type: 'EXPENSE', color: '#ec4899', icon: 'shopping-bag' },
  { name: 'Tagihan & Utilitas', type: 'EXPENSE', color: '#ef4444', icon: 'receipt' },
  { name: 'Hiburan & Liburan', type: 'EXPENSE', color: '#a855f7', icon: 'film' },
  { name: 'Kesehatan & Medis', type: 'EXPENSE', color: '#14b8a6', icon: 'activity' },
  { name: 'Pendidikan & Kursus', type: 'EXPENSE', color: '#6366f1', icon: 'book-open' },
];

const sampleTransactions = [
  {
    title: 'Gaji Bulanan',
    amount: 12500000,
    type: 'INCOME',
    categoryName: 'Gaji & Pendapatan',
    notes: 'Transfer gaji kantor bulan ini',
    dateOffset: -12,
  },
  {
    title: 'Proyek Desain Web',
    amount: 4500000,
    type: 'INCOME',
    categoryName: 'Freelance & Bisnis',
    notes: 'Klien landing page redesign',
    dateOffset: -5,
  },
  {
    title: 'Belanja Bulanan Supermarket',
    amount: 1450000,
    type: 'EXPENSE',
    categoryName: 'Belanja & Kebutuhan',
    notes: 'Bahan makanan dan perlengkapan rumah',
    dateOffset: -10,
  },
  {
    title: 'Makan Siang & Kopi Tim',
    amount: 185000,
    type: 'EXPENSE',
    categoryName: 'Makanan & Minuman',
    notes: 'Lunch meeting di kafe',
    dateOffset: -8,
  },
  {
    title: 'Bensin & Tol',
    amount: 350000,
    type: 'EXPENSE',
    categoryName: 'Transportasi',
    notes: 'Isi Pertamax dan saldo e-toll',
    dateOffset: -6,
  },
  {
    title: 'Tagihan Listrik & WiFi',
    amount: 820000,
    type: 'EXPENSE',
    categoryName: 'Tagihan & Utilitas',
    notes: 'PLN pascabayar & Indihome',
    dateOffset: -4,
  },
  {
    title: 'Langganan Netflix & Spotify',
    amount: 235000,
    type: 'EXPENSE',
    categoryName: 'Hiburan & Liburan',
    notes: 'Tagihan bulanan hiburan streaming',
    dateOffset: -2,
  },
  {
    title: 'Dividen Reksadana Saham',
    amount: 680000,
    type: 'INCOME',
    categoryName: 'Investasi & Dividen',
    notes: 'Hasil investasi aplikasi Bibit',
    dateOffset: -1,
  },
  {
    title: 'Beli Buku Pemrograman',
    amount: 275000,
    type: 'EXPENSE',
    categoryName: 'Pendidikan & Kursus',
    notes: 'Buku Next.js & Fullstack Web',
    dateOffset: 0,
  },
];

async function main() {
  console.log('🚀 Memulai proses seed database...');

  // Upsert categories
  const categoryMap = new Map();
  for (const cat of defaultCategories) {
    const createdCat = await prisma.category.upsert({
      where: { name: cat.name },
      update: { type: cat.type, color: cat.color, icon: cat.icon },
      create: cat,
    });
    categoryMap.set(cat.name, createdCat.id);
    console.log(`✅ Kategori: ${cat.name} (${cat.type})`);
  }

  // Insert sample transactions if none exist
  const count = await prisma.transaction.count();
  if (count === 0) {
    console.log('Menambahkan transaksi contoh...');
    const now = new Date();
    for (const item of sampleTransactions) {
      const categoryId = categoryMap.get(item.categoryName);
      if (categoryId) {
        const itemDate = new Date(now);
        itemDate.setDate(now.getDate() + item.dateOffset);

        await prisma.transaction.create({
          data: {
            title: item.title,
            amount: item.amount,
            type: item.type,
            notes: item.notes,
            date: itemDate,
            categoryId: categoryId,
          },
        });
      }
    }
    console.log(`✅ Berhasil menambahkan ${sampleTransactions.length} transaksi contoh!`);
  } else {
    console.log(`ℹ️ Transaksi sudah ada (${count} data), melewati seed transaksi.`);
  }

  console.log('🎉 Seed database selesai dengan sukses!');
}

main()
  .catch((e) => {
    console.error('Error saat seed database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

