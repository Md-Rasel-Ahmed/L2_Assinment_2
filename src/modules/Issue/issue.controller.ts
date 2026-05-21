import type { Request, Response } from "express"
import { issueService } from "./issue.service"
import sendResponse from "../../utils/sendResponse"
import  Jwt from 'jsonwebtoken';
import config from "../../config/config";

const postIssue=async(req:Request,res:Response)=>{
 const result=await issueService.postIssueIntoDB(req.body,req.user)
 const post=result.rows[0]
//  post.reporter_id=req.user.id
 if(result){
    sendResponse(res,{message:"Issue created successfully",status:201,success:true,data:post})
 }
}
const getAllIssues=async(req:Request,res:Response)=>{
   const result=await issueService.getAllIssueFromDB()
   sendResponse(res,{message:"Data fetched success",status:200,success:true,data:result.rows})
}
const getSingleIssue=async(req:Request,res:Response)=>{
  const{id}=req.params
   const result=await issueService.getSingleIssueFromDB(id)
    if(result.rows.length>0){
         return sendResponse(res,{message:"Data fetched success",status:200,success:true,data:result.rows[0]})
    }
     return  sendResponse(res,{message:"Not founded",status:404,success:false,data:{}})

  }
export const issueController={
  postIssue,
  getAllIssues,
  getSingleIssue
}