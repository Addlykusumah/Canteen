import express from "express";
import { upload } from "../middleware/upload";
import { updateSiswa } from "../controllers/siswaUpdateController";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

// UPDATE siswa
router.post("/update_siswa/:id", authMiddleware, upload.single("foto"), updateSiswa);

export default router;
