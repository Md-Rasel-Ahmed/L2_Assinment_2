import type { NextFunction, Request, Response } from "express"
import sendResponse from "../utils/sendResponse";
import Jwt, { type JwtPayload }  from 'jsonwebtoken';
import config from "../config/config";
import { pool } from "../config/db";

export const auth=()=>{
    return async (req:Request,res:Response,next:NextFunction)=>{
       const token=req.headers.authorization;
       const verifyToken=Jwt.verify(token as string,config.jwt_secret as string)as JwtPayload
 if(!token||!verifyToken){
   return sendResponse(res,{message:"Unthorized access",status:401,success:false})
 }
const findUserFromDb=await pool.query(`
        SELECT * FROM users WHERE id=$1
        `,[verifyToken.id])
    const user=findUserFromDb.rows[0] 
    if(!verifyToken?.id===user.id){
           return sendResponse(res,{message:"Forbidden access",status:403,success:false})

    }
    req.user=verifyToken
    next()
    }
}
export const roleAccess=()=>{
    return async (req:Request,res:Response,next:NextFunction)=>{
       const token=req.headers.authorization;
       const verifyToken=Jwt.verify(token as string,config.jwt_secret as string)as JwtPayload
 if(!token||!verifyToken){
   return sendResponse(res,{message:"Unthorized access",status:401,success:false})
 }
const findUserFromDb=await pool.query(`
        SELECT * FROM users WHERE email=$1
        `,[verifyToken.email])
    const user=findUserFromDb.rows[0] 
    if(!verifyToken?.email===user.email){
           return sendResponse(res,{message:"Forbidden access",status:403,success:false})

    }
    
    if(user.role==="maintainer"){
      next()
    }
    next("You are not allowed to deleted issues!")
    }
}

