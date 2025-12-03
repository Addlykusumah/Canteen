import express from "express";
import {
  tambahDiskon,
  getDiskonByStan,
  updateDiskon,
  deleteDiskon,
  insertMenuDiskon,
  updateMenuDiskon
} from "../controllers/diskonController";
import { authMiddleware } from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = express.Router();

router.post("/tambahdiskon", authMiddleware, upload.none(), tambahDiskon);

router.get("/diskon", authMiddleware, getDiskonByStan);

router.post("/updatediskon/:id", authMiddleware, upload.none(), updateDiskon);

router.delete("/deletediskon/:id", authMiddleware, deleteDiskon);
router.post( "/insert_menu_diskon",authMiddleware, upload.none(), insertMenuDiskon );
router.post("/update_menu_diskon/:id",authMiddleware, upload.none(), updateMenuDiskon );

export default router;
