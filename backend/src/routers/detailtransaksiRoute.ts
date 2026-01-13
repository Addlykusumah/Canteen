import { Router } from "express";
import { getNotaTransaksi } from "../controllers/detailtransaksiController";
import { authMiddleware } from "../middleware/auth";


const router = Router();

// siswa melihat nota transaksi berdasarkan id
router.get("/siswa/nota/:id", authMiddleware, getNotaTransaksi);

export default router;