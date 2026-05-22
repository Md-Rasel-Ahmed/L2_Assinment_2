import { Router } from "express";
import { authController } from "./auth.controller";

const router=Router()
router.post("/auth/login",authController.loginUser)
router.post("/auth/signup",authController.singUpUser)
export const authRouter=router