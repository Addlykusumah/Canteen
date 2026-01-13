import express from "express";
import { registerSiswa } from "../controllers/regristerController";
import { upload } from "../middleware/upload";
import { verifyRegisterSiswa } from "../middleware/userValidation";
const router = express.Router();

router.post(
  "/register_siswa",
  upload.single("foto"),
  registerSiswa,
  verifyRegisterSiswa
);

export default router;
