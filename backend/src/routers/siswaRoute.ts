import express from "express";
import { registerSiswa } from "../controllers/regristerController";
import { upload } from "../middleware/upload";
import { verifyRegisterSiswa } from "../middleware/userValidation";
import { authMiddleware, onlyAdminStan } from "../middleware/auth";

const router = express.Router();

router.post(
  "/register_siswa",
  authMiddleware,          
  onlyAdminStan,          
  upload.single("foto"),  
  verifyRegisterSiswa,   
  registerSiswa           
);

export default router;
