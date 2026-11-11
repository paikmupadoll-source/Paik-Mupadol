# Portofolio Tugas Kuliah — Panduan Pemula

Website ini memakai Next.js App Router, Tailwind CSS v4, PostgreSQL Neon melalui `pg`, dan Vercel Blob. Halaman publik hanya membaca data; pengelolaan dilakukan di `/admin` melalui HTTP Basic Auth.

## 1. Ganti identitas
Buka `lib/site-config.js` di GitHub dan ganti `[NAMA LENGKAP]`, `[JURUSAN]`, `[EMAIL]`, `[@USERNAME_IG]`, dan `[USERNAME_GITHUB]`. Ganti juga `USERNAME_IG` dan `USERNAME_GITHUB` pada URL profil. Ubah paragraf `tentang` sesuai kebutuhan.

## 2. Buat repository GitHub dari file ZIP
1. Unduh dan ekstrak ZIP ini di komputer/HP (jika memakai HP, gunakan aplikasi pengelola ZIP).
2. Masuk ke GitHub dan pilih **New repository**. Beri nama, misalnya `portofolio-tugas-kuliah`, lalu pilih **Public** atau **Private** dan buat repository.
3. Di repository, pilih **Add file → Upload files**.
4. Unggah isi folder proyek (bukan folder ZIP-nya). Pastikan `package.json`, `app`, `components`, `lib`, dan `schema.sql` terlihat di bagian utama repository.
5. Tekan **Commit changes**.

## 3. Buat database Neon melalui Vercel Marketplace
1. Login ke Vercel, pilih **Add New → Project**, lalu **Import** repository GitHub tadi.
2. Sebelum deploy pertama, buka **Storage / Marketplace** di dashboard Vercel, cari **Neon**, lalu buat/Hubungkan database Neon ke project.
3. Pilih opsi agar integrasi menambahkan environment variable `DATABASE_URL`. Gunakan connection string pooled jika ditawarkan.
4. Buka dashboard Neon → **SQL Editor**. Salin seluruh isi `schema.sql`, jalankan (Run). Tabel `tugas` akan dibuat.

## 4. Buat Vercel Blob
1. Di Vercel project, buka **Storage / Marketplace**, cari **Blob**, lalu buat Blob Store dengan akses **Public**.
2. Hubungkan store ke project dan pastikan environment variable `BLOB_READ_WRITE_TOKEN` tersedia. Bila integrasi hanya menyediakan `BLOB_STORE_ID`, tambahkan ID itu, tetapi fitur upload melalui SDK umumnya membutuhkan token read/write; buat/aktifkan token read-write di pengaturan Blob bila muncul pesan kredensial.

## 5. Tambahkan password admin dan deploy
1. Vercel → Project → **Settings → Environment Variables**.
2. Tambahkan `ADMIN_PASSWORD` dengan password panjang dan unik. Jangan menaruh password ini di file publik atau GitHub.
3. Pastikan `DATABASE_URL` dan `BLOB_READ_WRITE_TOKEN` aktif untuk **Production** (dan Preview jika dibutuhkan).
4. Klik **Deployments → Redeploy** pada deployment terbaru (atau push commit baru). Tunggu sampai status **Ready**.
5. Buka domain Vercel. Publik bisa melihat Beranda dan Daftar Tugas. Buka `/admin`, masukkan username bebas dan password dari `ADMIN_PASSWORD`.

## 6. Cara mengelola tugas
Di `/admin`, isi judul, deskripsi, link opsional, dan pilih file (maksimal 4 MB). Format: PDF, DOC/DOCX, PPT/PPTX, XLS/XLSX, JPG/JPEG, PNG, GIF, WEBP. Edit lewat tombol Edit. File baru saat edit akan menggantikan file lama; file Blob lama dihapus. Hapus tugas juga menghapus file Blob terkait.

Tanggal publik berasal dari `created_at` (waktu unggah), ditampilkan dengan zona Asia/Jakarta/WIB. Kolom `deadline` disediakan di database tetapi tidak digunakan untuk tanggal publik.

## 7. Mengatasi error umum

### “Application error” / halaman 500
- Buka Vercel → Project → **Deployments** → pilih deployment → **Runtime Logs**. Baca pesan error pertama yang relevan.
- `DATABASE_URL` kosong/salah: hubungkan ulang Neon, pastikan variable ada di Production, lalu Redeploy.
- `relation "tugas" does not exist`: jalankan ulang `schema.sql` di SQL Editor Neon pada database yang sama dengan `DATABASE_URL`.
- `password authentication failed` / `ECONNREFUSED`: salin ulang URL koneksi Neon, periksa password/host, dan gunakan URL dengan `sslmode=require`.
- Build gagal setelah perubahan dependency: pastikan repository memuat semua isi proyek dan tidak ada `node_modules` yang diunggah. Jalankan Redeploy.

### “No blob credentials found”
- Pastikan Blob Store sudah dibuat dan terhubung ke project Vercel yang benar.
- Periksa **Settings → Environment Variables**: `BLOB_READ_WRITE_TOKEN` harus ada untuk Production. Jika baru ditambahkan, Redeploy.
- Pastikan token berasal dari Blob Store yang sama dan memiliki izin read/write. `BLOB_STORE_ID` saja bukan pengganti token SDK untuk operasi upload pada konfigurasi standar.

### `/admin` tidak meminta password / menampilkan 503
Pastikan `ADMIN_PASSWORD` sudah ditambahkan tanpa spasi di awal/akhir dan environment-nya Production. Redeploy setelah mengubah env.

### PDF tidak tampil
Coba tombol **Buka di tab baru**. Bila pdf.js gagal, halaman otomatis mencoba iframe. Pastikan URL Blob masih dapat diakses publik dan ukuran file wajar.

### Office Viewer kosong
Office Online Viewer memerlukan URL file yang dapat diakses publik dari internet. Pastikan Blob Store bertipe Public. Viewer pihak ketiga dapat memiliki batasan layanan; tombol Buka di tab baru/Unduh tetap tersedia.

## Catatan keamanan dan operasional
- Next.js dikunci pada **16.4.5**, versi Active LTS yang sudah mencakup pembaruan keamanan 3 November 2026. Periksa advisori resmi sebelum memperbarui dependency.
- Jangan pernah commit `.env` atau token. Gunakan Environment Variables Vercel.
- HTTP Basic Auth melindungi `/admin`; gunakan HTTPS Vercel dan password kuat. Username bebas.
- Upload divalidasi berdasarkan ukuran dan MIME type pada server. Batas 4 MB menjaga payload di bawah batas Server Actions 5 MB.
- File Blob disimpan public sesuai kebutuhan viewer; siapa pun yang memiliki URL Blob dapat mengakses file tersebut. Jangan unggah dokumen pribadi/sensitif.
- `BLOB_STORE_ID` dicantumkan sebagai informasi konfigurasi, namun API `put`/`del` standar menggunakan `BLOB_READ_WRITE_TOKEN`.

## Teknologi
Next.js 16.4.5 · React 19.2.9 · Tailwind CSS 4 · PostgreSQL (Neon) · `pg` · Vercel Blob · pdfjs-dist.
