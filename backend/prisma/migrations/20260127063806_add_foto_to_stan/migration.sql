-- AlterTable
ALTER TABLE `stan` ADD COLUMN `foto` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `transaksi` ALTER COLUMN `tanggal` DROP DEFAULT;
