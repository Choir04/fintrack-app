# 💰 FinTrack - Personal Finance & Expense Tracker

Aplikasi pencatatan keuangan pribadi modern berbasis database **PostgreSQL** dengan **Next.js 15 (App Router)**, **Prisma ORM**, dan **Tailwind CSS**. Siap diunggah ke **GitHub** dan langsung di-hosting secara gratis di **Vercel**.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon%20%2F%20Supabase-336791?style=for-the-badge&logo=postgresql)
![Vercel Ready](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)

---

## ✨ Fitur Utama

- 📊 **Dashboard Finansial Lengkap**:
  - Saldo Bersih, Total Pemasukan, Total Pengeluaran, dan Rasio Simpanan (Cashflow rate).
  - Visual breakdown persentase pengeluaran berdasarkan kategori.
- ⚡ **CRUD Transaksi Penuh (Database-backed)**:
  - Tambah, edit, dan hapus transaksi (Judul, Nominal, Kategori, Tanggal, Catatan).
  - Filter interaktif berdasarkan Tipe (Semua / Pemasukan / Pengeluaran) dan Kategori.
  - Pencarian real-time transaksi atau catatan.
- 🏷️ **Manajemen Kategori**:
  - Kategori default siap pakai (Gaji, Bisnis, Makanan, Transportasi, Tagihan, Belanja, dll).
  - Dukungan pembuatan kategori custom dengan palette warna dinamis.
- 📥 **Export Data**:
  - Unduh seluruh data catatan keuangan ke format file `.csv` dengan satu klik.
- 🌱 **1-Click Seed Demo Data**:
  - Tombol instan di antarmuka web untuk mengisi database dengan sampel transaksi realistis.
- 🛡️ **Zero-Crash Serverless Resilience**:
  - Memiliki fallback data otomatis in-memory bila database belum dikonfigurasi, sehingga aplikasi **tidak akan crash saat pertama kali di-deploy di Vercel**.

---

## 🚀 Panduan Menjalankan di Lokal (Local Development)

### 1. Clone atau Buka Folder Proyek
```bash
git clone <URL_REPO_GITHUB_ANDA>
cd PPP
```

### 2. Install Dependensi
```bash
npm install
```

### 3. Salin File Environment
Salin `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```

### 4. (Opsional) Hubungkan Database PostgreSQL
Dapatkan connection string PostgreSQL gratis dari [Neon.tech](https://neon.tech) atau [Supabase](https://supabase.com), lalu tempel ke `.env`:
```env
DATABASE_URL="postgresql://username:password@ep-sample-123.us-east-2.aws.neon.tech/neondb?sslmode=require"
```
Setelah mengisi `DATABASE_URL`, buat tabel database dengan menjalankan:
```bash
npx prisma db push
```
*(Opsional)* Jalankan seed data awal:
```bash
npm run db:seed
```

### 5. Jalankan Server Development
```bash
npm run dev
```
Buka browser di [http://localhost:3000](http://localhost:3000).

---

## 🌐 Menyiapkan Database Cloud Gratis (Neon.tech / Supabase)

Untuk hosting di Vercel, Anda membutuhkan database PostgreSQL berbasis cloud:

1. Kunjungi **[Neon.tech](https://neon.tech)** (Rekomendasi - 100% gratis, tanpa kartu kredit).
2. Buat akun dan buat project baru (misal: `fintrack-db`).
3. Di Dashboard Neon, salin **Connection String** yang berformat:
   ```text
   postgresql://alex:password@ep-xyz-123.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
4. Jalankan perintah berikut di komputer Anda agar struktur tabel terbentuk di cloud:
   ```bash
   npx prisma db push
   ```

---

## 🐙 Cara Upload ke GitHub

Jalankan perintah berikut di terminal komputer Anda:

```bash
# 1. Inisialisasi Git (jika belum)
git init

# 2. Tambahkan semua file proyek
git add .

# 3. Buat commit pertama
git commit -m "feat: initial commit project FinTrack database Next.js"

# 4. Buat repository baru di https://github.com/new (misal: fintrack-app)

# 5. Hubungkan repo lokal ke GitHub (ganti USERNAME dan REPO_NAME)
git branch -M main
git remote add origin https://github.com/USERNAME/REPO_NAME.git

# 6. Push kode ke GitHub
git push -u origin main
```

---

## ⚡ Cara Hosting & Deploy di Vercel

1. Buka [Vercel](https://vercel.com) dan login menggunakan akun **GitHub** Anda.
2. Klik tombol **"Add New..."** lalu pilih **"Project"**.
3. Cari dan pilih repository GitHub yang baru saja Anda upload (misal: `fintrack-app`), lalu klik **"Import"**.
4. Di bagian **Environment Variables**:
   - **Key**: `DATABASE_URL`
   - **Value**: Masukkan connection string PostgreSQL Neon/Supabase Anda (`postgresql://...`).
5. Klik **"Deploy"**.
6. Selesai! Dalam 1-2 menit, situs Anda akan aktif dengan domain publik gratis seperti `https://fintrack-app.vercel.app`.

> **Catatan Build Vercel**: Proyek ini sudah dilengkapi skrip `"postinstall": "prisma generate"` di `package.json`, sehingga Vercel secara otomatis meng-generate Prisma Client saat deployment tanpa perlu konfigurasi tambahan.

---

## 🛠️ Tech Stack & Dependencies

- **Frontend**: Next.js 15, React 19, Tailwind CSS 4, Lucide Icons
- **Backend**: Next.js Route Handlers (Serverless API)
- **Database ORM**: Prisma ORM v6
- **Database**: PostgreSQL (Neon Serverless Postgres / Supabase / Vercel Postgres)
- **Deployment**: Vercel Serverless Platform

---

## 📄 Lisensi
MIT License - Bebas digunakan dan dimodifikasi untuk keperluan portofolio, pembelajaran, maupun produksi.
