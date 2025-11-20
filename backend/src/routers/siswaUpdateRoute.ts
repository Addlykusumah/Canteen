import express from "express";
import { upload } from "../middleware/upload";
import { updateSiswa } from "../controllers/siswaUpdateController";

const router = express.Router();

// UPDATE siswa
router.post("/update_siswa/:id", upload.single("foto"), updateSiswa);

export default router;
