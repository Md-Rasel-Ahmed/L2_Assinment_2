import { Router } from "express";
import { controller } from "./user.controller";

const route=Router()

route.post("/auth/signup",controller.addUser)

export const userRouter=route