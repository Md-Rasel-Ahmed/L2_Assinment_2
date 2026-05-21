import type { Request, Response } from "express";
import { service } from "./user.service";
import sendResponse from "../../utils/sendResponse";

const getAllUser=()=>{
    console.log("getting users")
}
const addUser=async(req:Request,res:Response)=>{
    const result=await service.addUserIntoDB(req.body);
    console.log(result)
    if(!result.email){
       return sendResponse(res,{message:"User can,t created please try again",status:400,success:false,data:{}})
    }
       return sendResponse(res,{message:"User registered successfully",status:201,success:true,data:result})

}
export const controller={
    getAllUser,
    addUser
}