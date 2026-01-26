import express from "express";
import { createTransaksiSiswa, PemasukanAdmin,HistoriAdmin } from "../controllers/transaksiController";
import { authMiddleware } from "../middleware/auth"; 
import {HistoriPesananBulananSiswa} from "../controllers/transaksiController";

const router = express.Router();


router.post("/transaksi", authMiddleware, createTransaksiSiswa);
router.get("/histori", authMiddleware, HistoriPesananBulananSiswa);
router.get("/pemasukan", authMiddleware, PemasukanAdmin);
router.get("/historiadmin", authMiddleware, HistoriAdmin);

export default router;
