import { Router } from "express";
import { upload } from "../middleware/upload";
import { registerStan } from "../controllers/RegristerController";
import { verifyRegisterStan } from "../middleware/userValidation";


const router = Router();


router.post("/register_stan", upload.none(), registerStan, verifyRegisterStan);

export default router;
