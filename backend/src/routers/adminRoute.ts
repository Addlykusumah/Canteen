import express from "express";
import { authMiddleware, onlyAdminStan } from "../middleware/auth";
import { getProfileStan, updateStanProfile } from "../controllers/adminController";

const router = express.Router();

// profile stan
router.get("/stan/profile", authMiddleware, onlyAdminStan, getProfileStan);
router.put("/stan/update", authMiddleware, onlyAdminStan, updateStanProfile);

export default router;
