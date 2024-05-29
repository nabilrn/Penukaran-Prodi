# Penukaran Prodi di Fakultas Teknologi Informasi
 project web penukaran prodi untuk tugas besar matkul pemrograman web Sistem Informasi Universitas Andalas 

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MySQL](https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white)
![Nodemon](https://img.shields.io/badge/NODEMON-%23323330.svg?style=for-the-badge&logo=nodemon&logoColor=%BBDEAD)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Preline UI](https://img.shields.io/badge/Preline_UI-4285F4?style=for-the-badge&logo=prelinu&logoColor=white)


## Instalasi

Install dependensi:

npm install

Jalankan server Apache dan database MySQL pada XAMPP, lalu buat database sesuai pada konfigurasi database:

DB_HOST = localhost
DB_NAME = "penukaran_prodi"
DB_USERNAME = "root"
DB_PASSWORD = ""
DB_CONNECTION = "mysql"
PORT = 3000
NODE_ENV = "development"


Migrasi tabel dari Express ke Database dengan menjalankan syntax di bawah pada terminal:

npx sequelize-cli db:migrate

Jalankan seeder untuk mengirim data ke database dengan menjalankan syntax di bawah pada terminal:

npx sequelize-cli db:seed:all

Jalankan server Node.js dengan command:

npm run start
npm run build

Berikut langkah-langkah untuk push perubahan:

git branch (namaBranch) //Untuk membuat branch baru (Selalu buat branch baru saat ingin melakukan modifikasi)
git checkout namaBranch //Pindah ke branch yang dibuat tadi
git add .
git commit -m "pesan" //"pesan" diubah sesuai yang diinginkan
git push -u origin namaBranch //namaBranch adalah nama branch tempat melakukan tugas
