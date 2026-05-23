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
   const result=await issueService.getAllIssueFromDB(req.query as any)
   sendResponse(res,{message:"Data fetched success",status:200,success:true,data:result})
}
const getSingleIssue=async(req:Request,res:Response)=>{
  const{id}=req.params
   const result=await issueService.getSingleIssueFromDB(Number(id))
    if(result){
         return sendResponse(res,{status:200,success:true,data:result})
    }
     return  sendResponse(res,{message:"Not founded",status:404,success:false,data:{}})

  }
const updateIssue=async(req:Request,res:Response)=>{
  const{id}=req.params
  console.log(req.user)
   const result=await issueService.updateIssuFromDB(req.body,Number(id),req.user)
   console.log(result)
    if(result){
         return sendResponse(res,{message:"Issue updated successfully",status:200,success:true,data:result})
    }
     return  sendResponse(res,{message:"Not founded",status:404,success:false,data:{}})

  }
const deleteIssue=async(req:Request,res:Response)=>{
  const{id}=req.params
   const result=await issueService.deleteIssueFromDB(Number(id))
    if(result.rowCount===1){
         return sendResponse(res,{message:"Issue delete successfully",status:200,success:true})
    }
     return  sendResponse(res,{message:"Issue not founded",status:404,success:false})

  }

export const issueController={
  postIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue,
  deleteIssue
}