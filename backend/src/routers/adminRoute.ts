import express from "express";
import { authMiddleware, onlyAdminStan } from "../middleware/auth";
import { upload } from "../middleware/upload";
import {
  getProfileStan,
  updateStanProfile,
} from "../controllers/adminController";

const router = express.Router();


router.get(
  "/stan/profile",
  authMiddleware,
  onlyAdminStan,
  getProfileStan
);

router.put(
  "/stan/update",
  authMiddleware,
  onlyAdminStan,
  upload.single("foto"), 
  updateStanProfile
);

export default router;
