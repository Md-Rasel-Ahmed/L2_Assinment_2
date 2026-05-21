import { Router } from "express";
import { authController } from "./auth.controller";

const router=Router()
router.post("/auth/login",authController.loginUser)
export const authRouter=router