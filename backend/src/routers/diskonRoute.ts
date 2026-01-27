import express from "express";
import {
  tambahDiskon,
  getDiskonByStan,
  updateDiskon,
  deleteDiskon,
  insertMenuDiskon,
  updateMenuDiskon,
  deleteMenuDiskon,
  getMenuDiskonByStan,
  getMenuDiskonSiswa
} from "../controllers/diskonController";
import { authMiddleware,onlySiswa } from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = express.Router();

router.post("/tambahdiskon", authMiddleware, upload.none(), tambahDiskon);
router.get("/diskon", authMiddleware, getDiskonByStan);
router.put("/updatediskon/:id", authMiddleware, upload.none(), updateDiskon);
router.delete("/deletediskon/:id", authMiddleware, deleteDiskon);

router.post("/tambah_menudiskon", authMiddleware, upload.none(), insertMenuDiskon);
router.put("/update_menudiskon/:id", authMiddleware, upload.none(), updateMenuDiskon);
router.delete("/delete_menudiskon/:id",authMiddleware, deleteMenuDiskon );
router.get("/menudiskon", authMiddleware, getMenuDiskonByStan);
router.get("/menudiskon/siswa", authMiddleware, onlySiswa, getMenuDiskonSiswa);

export default router;
