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
const singUpUser=async(req:Request,res:Response)=>{
    const result=await authService.SingupUserIntoDB(req.body);
    console.log(result)
    if(!result.email){
       return sendResponse(res,{message:"User can,t created please try again",status:400,success:false,data:{}})
    }
       return sendResponse(res,{message:"User registered successfully",status:201,success:true,data:result})

}
export const authController={
    loginUser,
    singUpUser
}