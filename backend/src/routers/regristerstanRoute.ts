import { Router } from "express";
import { upload } from "../middleware/upload";
import { registerStan, registerSiswa } from "../controllers/regristerController";
import { verifyRegisterStan, verifyRegisterSiswa } from "../middleware/userValidation";
import { authMiddleware, onlyAdminStan } from "../middleware/auth";

const router = Router();

/**
 * REGISTER STAN
 * Jika stan juga upload foto, pakai upload.single("foto")
 * Urutan: upload -> validate -> controller
 */
router.post(
  "/register_stan",
  upload.single("foto"),
  verifyRegisterStan,
  registerStan
);

/**
 * REGISTER SISWA
 * Jika memang hanya admin_stan yang boleh membuat akun siswa:
 * Urutan: auth -> role -> upload -> validate -> controller
 */
router.post(
  "/register_siswa",
  authMiddleware,
  onlyAdminStan,
  upload.single("foto"),
  verifyRegisterSiswa,
  registerSiswa
);

export default router;
