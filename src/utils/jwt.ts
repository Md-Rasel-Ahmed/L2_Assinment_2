import type { Request, Response } from "express";
import  Jwt, { type JwtPayload }  from 'jsonwebtoken';
import config from "../config/config";
import sendResponse from "./sendResponse";
import { pool } from "../config/db";

export const verifyToken=async(req:Request,res:Response)=>{
       const token=req.headers.authorization
       const verifyToken=Jwt.verify(token as string,config.jwt_secret as string) as JwtPayload
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
   return user;
   
}