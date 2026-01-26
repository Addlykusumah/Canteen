import { Router } from "express";
import { upload } from "../middleware/upload";
import { registerStan } from "../controllers/regristerController";
import { verifyRegisterStan } from "../middleware/userValidation";
import { registerSiswa } from "../controllers/regristerController";
import { verifyRegisterSiswa } from "../middleware/userValidation";
import { authMiddleware, onlyAdminStan } from "../middleware/auth";



const router = Router();

router.post("/register_stan", upload.none(), registerStan, verifyRegisterStan);
router.post(
  "/register_siswa",
  authMiddleware,          
  onlyAdminStan,          
  upload.single("foto"),  
  verifyRegisterSiswa,   
  registerSiswa           
);

export default router;
