import type { NextFunction, Request, Response } from "express"

import { verify_token } from './../utils/jwt';

export const auth=()=>{
    return async (req:Request,res:Response,next:NextFunction)=>{
       const token=req.headers.authorization;
       const validToken= await verify_token(token as string)
       req.user=validToken
    next()
    }
}
export const maintainerAccess=()=>{
    return (req:Request,res:Response,next:NextFunction)=>{
  if(req.user.role==="maintainer"){
    next()
   }else{
    throw new Error("Your are not allowed  to delete")
   }
    }
 
}
