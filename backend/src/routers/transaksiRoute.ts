import express from "express";
import { createTransaksiSiswa, PemasukanAdmin,HistoriAdmin,updateStatusTransaksi, getAllTransaksiSiswa, getAllTransaksiAdmin } from "../controllers/transaksiController";
import { authMiddleware, onlySiswa, onlyAdminStan } from "../middleware/auth"; 
import {HistoriPesananBulananSiswa} from "../controllers/transaksiController";

const router = express.Router();

router.post("/transaksi", authMiddleware, createTransaksiSiswa);
router.get("/histori", authMiddleware, HistoriPesananBulananSiswa);
router.get("/pemasukan", authMiddleware, PemasukanAdmin);
router.get("/historiadmin", authMiddleware, HistoriAdmin);
router.put("/transaksi/status/:id", authMiddleware, updateStatusTransaksi,onlyAdminStan);
router.get("/transaksi",authMiddleware,onlySiswa, getAllTransaksiSiswa);
router.get("/admin/transaksi",authMiddleware,onlyAdminStan,getAllTransaksiAdmin);

export default router;
