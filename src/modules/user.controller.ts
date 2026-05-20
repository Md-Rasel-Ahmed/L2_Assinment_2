import type { Request, Response } from "express";
import { service } from "./user.service"
import sendResponse from "../utils/sendResponse";

const getAllUser=()=>{
    console.log("getting users")
}
const addUser=async(req:Request,res:Response)=>{
    const result=await service.addUserIntoDB(req.body);
    if(result.rows.length===0){
       return sendResponse(res,{message:"User can,t created please try again",status:400,success:false,data:{}})
    }
       return sendResponse(res,{message:"User create successfull",status:201,success:true,data:result.rows[0]})

}
export const controller={
    getAllUser,
    addUser
}