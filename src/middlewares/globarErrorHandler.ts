import type { NextFunction, Request, Response } from "express";

const globalErrorHandler=(err:any,req:Request,res:Response,next:NextFunction)=>{
   const statusCode=err.statusCode || 500
   console.log("middleware erro",err)
   res.status(statusCode).json({
    success:false,
    message:err?err:"Something went wrong",
    stack:err.stack
   })
}
export default globalErrorHandler