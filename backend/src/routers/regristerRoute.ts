import { Router } from "express";
import { upload } from "../middleware/upload";
import { registerStan, registerSiswaPublic } from "../controllers/regristerController";
import { verifyRegisterStan, verifyRegisterSiswa } from "../middleware/userValidation";


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


router.post(
  "/register_siswa",
  upload.single("foto"),
  verifyRegisterSiswa,
  registerSiswaPublic
);

export default router;
