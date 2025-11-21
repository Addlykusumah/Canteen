import { Router } from "express";
import { upload } from "../middleware/upload";
import { registerStan } from "../controllers/RegristerController";


const router = Router();

// POST /register_stan (form-data)
router.post("/register_stan", upload.none(), registerStan);

export default router;
