import type { Request, Response } from "express"
import { pool } from "../config/db"
import sendResponse from "../utils/sendResponse"
import type { Iuser } from "../interfaces/user.interface"

const getAllUserFromDB=()=>{
    console.log("database user")
}
const addUserIntoDB=async(payload:Iuser)=>{
    const {name,email,password}=payload
   try {
     const result=await pool.query(`
      INSERT INTO users(name,email,password)
      VALUES($1,$2,$3)
      RETURNING *
    `,[name,email,password])
    return result
   } catch (error) {
     throw new Error("Bad Request")
   }
}
export const service={
    getAllUserFromDB,
    addUserIntoDB
}