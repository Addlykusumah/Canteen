-- CreateEnum
CREATE TYPE "StatusTransaksi" AS ENUM ('belum_dikonfirm', 'dimasak', 'diantar', 'sampai');

-- CreateEnum
CREATE TYPE "JenisMenu" AS ENUM ('makanan', 'minuman');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin_stan', 'siswa');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "siswa" (
    "id" SERIAL NOT NULL,
    "nama_siswa" TEXT NOT NULL,
    "alamat" TEXT,
    "telp" TEXT,
    "foto" TEXT,
    "id_user" INTEGER NOT NULL,

    CONSTRAINT "siswa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stan" (
    "id" SERIAL NOT NULL,
    "nama_stan" TEXT NOT NULL,
    "nama_pemilik" TEXT NOT NULL,
    "telp" TEXT,
    "foto" TEXT,
    "id_user" INTEGER NOT NULL,

    CONSTRAINT "stan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menu" (
    "id" SERIAL NOT NULL,
    "nama_makanan" TEXT NOT NULL,
    "harga" DOUBLE PRECISION NOT NULL,
    "jenis" "JenisMenu" NOT NULL,
    "foto" TEXT,
    "deskripsi" TEXT,
    "id_stan" INTEGER NOT NULL,

    CONSTRAINT "menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diskon" (
    "id" SERIAL NOT NULL,
    "nama_diskon" TEXT NOT NULL,
    "persentase_diskon" DOUBLE PRECISION NOT NULL,
    "tanggal_awal" TIMESTAMP(3) NOT NULL,
    "tanggal_akhir" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "diskon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menu_diskon" (
    "id" SERIAL NOT NULL,
    "id_menu" INTEGER NOT NULL,
    "id_diskon" INTEGER NOT NULL,

    CONSTRAINT "menu_diskon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaksi" (
    "id" SERIAL NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "id_stan" INTEGER NOT NULL,
    "id_siswa" INTEGER NOT NULL,
    "status" "StatusTransaksi" NOT NULL,

    CONSTRAINT "transaksi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detail_transaksi" (
    "id" SERIAL NOT NULL,
    "id_transaksi" INTEGER NOT NULL,
    "id_menu" INTEGER NOT NULL,
    "qty" INTEGER NOT NULL,
    "harga_beli" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "detail_transaksi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- AddForeignKey
ALTER TABLE "siswa" ADD CONSTRAINT "siswa_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stan" ADD CONSTRAINT "stan_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu" ADD CONSTRAINT "menu_id_stan_fkey" FOREIGN KEY ("id_stan") REFERENCES "stan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_diskon" ADD CONSTRAINT "menu_diskon_id_menu_fkey" FOREIGN KEY ("id_menu") REFERENCES "menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_diskon" ADD CONSTRAINT "menu_diskon_id_diskon_fkey" FOREIGN KEY ("id_diskon") REFERENCES "diskon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaksi" ADD CONSTRAINT "transaksi_id_stan_fkey" FOREIGN KEY ("id_stan") REFERENCES "stan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaksi" ADD CONSTRAINT "transaksi_id_siswa_fkey" FOREIGN KEY ("id_siswa") REFERENCES "siswa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_transaksi" ADD CONSTRAINT "detail_transaksi_id_transaksi_fkey" FOREIGN KEY ("id_transaksi") REFERENCES "transaksi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_transaksi" ADD CONSTRAINT "detail_transaksi_id_menu_fkey" FOREIGN KEY ("id_menu") REFERENCES "menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
