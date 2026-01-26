import express from "express";
import { authMiddleware, onlySiswa } from "../middleware/auth";
import { upload } from "../middleware/upload";
import { verifyEditUser } from "../middleware/userValidation";
import { getProfileSiswa, updateProfileSiswa } from "../controllers/siswaController";

const router = express.Router();


router.get("/profile", authMiddleware, onlySiswa, getProfileSiswa);


router.put(
  "/profile/edit",
  authMiddleware,
  onlySiswa,
  upload.single("foto"),
  verifyEditUser, 
  updateProfileSiswa
);

export default router;
