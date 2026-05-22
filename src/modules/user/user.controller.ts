import type { Request, Response } from "express";
import { service } from "./user.service";
import sendResponse from "../../utils/sendResponse";

const getAllUser=()=>{
    console.log("getting users")
}

export const controller={
    getAllUser,
}