import express from "express";
import { loginSiswa } from "../controllers/authController";
import { upload } from "../middleware/upload";

const router = express.Router();


router.post("/login_siswa", upload.none(), loginSiswa);

export default router;
