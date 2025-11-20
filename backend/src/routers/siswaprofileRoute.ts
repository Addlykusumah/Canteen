import express from "express";
import { getProfile } from "../controllers/siswaprofileController";

const router = express.Router();

router.get("/get_profile", getProfile);

export default router;
