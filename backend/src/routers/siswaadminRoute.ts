import express from "express";
import { authMiddleware, onlyAdminStan } from "../middleware/auth";
import { upload } from "../middleware/upload";
import {
  createSiswaAdmin,
  updateSiswaAdmin,
  deleteSiswaAdmin,
  getAllSiswaAdmin
} from "../controllers/siswaadminController";

const router = express.Router();

// semua route CRUD siswa hanya untuk admin_stan
router.post("/admin/siswa", authMiddleware, onlyAdminStan, upload.single("foto"), createSiswaAdmin);
router.put("/admin/siswa/:id", authMiddleware, onlyAdminStan, upload.single("foto"), updateSiswaAdmin);
router.delete("/admin/siswa/:id", authMiddleware, onlyAdminStan, deleteSiswaAdmin);
router.get("/admin/siswa", authMiddleware, onlyAdminStan, getAllSiswaAdmin);

export default router;