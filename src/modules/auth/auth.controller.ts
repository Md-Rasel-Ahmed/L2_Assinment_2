import type { Request, Response } from "express";
import { authService } from "./auth.service";
import sendResponse from "../../utils/sendResponse";

const loginUser=async(req:Request,res:Response)=>{
      const result=await authService.loginUser(req.body)
      if(result){
       return sendResponse(res,{message:"Login successful",status:200,success:true,data:result})
      }
     return sendResponse(res,{message:"User not found",status:404,success:false})
     
}
export const authController={
    loginUser
}