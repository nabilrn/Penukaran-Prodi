
# Penukaran Prodi di Fakultas Teknologi Informasi

Project web penukaran prodi untuk tugas besar matkul pemrograman web Sistem Informasi Universitas Andalas 

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MySQL](https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white)
![Nodemon](https://img.shields.io/badge/NODEMON-%23323330.svg?style=for-the-badge&logo=nodemon&logoColor=%BBDEAD)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Preline UI](https://img.shields.io/badge/Preline_UI-4285F4?style=for-the-badge&logo=preline&logoColor=white)

## Instalasi

Langkah-langkah untuk memulai proyek ini:

1. **Install Dependensi**

   ```bash
   npm install
   ```

2. **Konfigurasi Database**

   Pastikan server Apache dan MySQL di XAMPP sudah berjalan, lalu buat database sesuai konfigurasi berikut:

   ```plaintext
   DB_HOST = localhost
   DB_NAME = "penukaran_prodi"
   DB_USERNAME = "root"
   DB_PASSWORD = ""
   DB_CONNECTION = "mysql"
   PORT = 3000
   NODE_ENV = "development"
   ```

3. **Migrasi Tabel ke Database**

   Jalankan migrasi tabel dari Express ke Database dengan perintah:

   ```bash
   npx sequelize-cli db:migrate
   ```

4. **Jalankan Seeder**

   Isi database dengan data awal menggunakan seeder:

   ```bash
   npx sequelize-cli db:seed:all
   ```

5. **Jalankan Server Node.js**

   Mulai server dengan perintah:

   ```bash
   npm run start
   npm run build
   ```

## Panduan Git

Untuk berkolaborasi dalam proyek ini, ikuti langkah-langkah berikut untuk mendorong perubahan ke repository:

1. **Buat Branch Baru**

   ```bash
   git branch namaBranch
   ```

2. **Pindah ke Branch Baru**

   ```bash
   git checkout namaBranch
   ```

3. **Tambah Perubahan**

   ```bash
   git add .
   ```

4. **Commit Perubahan**

   ```bash
   git commit -m "pesan" // "pesan" diubah sesuai dengan deskripsi perubahan
   ```

5. **Push ke Repository**

   ```bash
   git push -u origin namaBranch
   ```

   Selalu buat branch baru saat ingin melakukan modifikasi untuk menjaga alur kerja yang bersih dan terorganisir.

Dengan mengikuti langkah-langkah di atas, Anda dapat dengan mudah mengatur dan menjalankan proyek "Penukaran Prodi di Fakultas Teknologi Informasi." Selamat bekerja!
