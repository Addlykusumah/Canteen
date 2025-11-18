-- AlterTable
ALTER TABLE `transaksi` MODIFY `tanggal` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `status` ENUM('belum_dikonfirm', 'dimasak', 'diantar', 'sampai') NOT NULL DEFAULT 'belum_dikonfirm';
