import { Router } from "express";
import {upload} from "../middleware/upload";
import { loginStan } from "../controllers/authstanController";

const router = Router();

// POST /login_stan (form-data: username, password)
router.post("/login_stan", upload.none(), loginStan);

export default router;
