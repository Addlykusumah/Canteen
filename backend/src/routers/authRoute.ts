import { Router } from "express";
import { login } from "../controllers/authController";
import { verifyAuthentication } from "../middleware/userValidation";

const router = Router();


router.post("/login", verifyAuthentication, login);

export default router;
