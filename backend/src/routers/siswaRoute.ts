import express from "express";
import { registerSiswa } from "../controllers/RegristerController";
import { upload } from "../middleware/upload";

const router = express.Router();

router.post("/register_siswa", upload.single("foto"), registerSiswa);

export default router;
