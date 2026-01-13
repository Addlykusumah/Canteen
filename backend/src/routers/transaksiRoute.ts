import express from "express";
import { createTransaksiSiswa } from "../controllers/transaksiController";
import { authMiddleware } from "../middleware/auth"; 

const router = express.Router();


router.post("/transaksi", authMiddleware, createTransaksiSiswa);

export default router;
