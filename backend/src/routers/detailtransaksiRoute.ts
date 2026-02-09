import { Router } from "express";
import { getNotaTransaksi } from "../controllers/detailtransaksiController";
import { authMiddleware } from "../middleware/auth";


const router = Router();


router.get("/siswa/nota/:id", authMiddleware, getNotaTransaksi);


export default router;