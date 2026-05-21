import type { Request, Response } from "express"
import bcrypt from "bcryptjs"
import type { Iuser } from "../../interfaces/user.interface"
import { pool } from "../../config/db"

const getAllUserFromDB=()=>{
    console.log("database user")
}
type Trole="contributor"|"maintainer"

const addUserIntoDB=async(payload:Iuser)=>{
    const {name,email,password,role}=payload
    const hashPassowrd=await bcrypt.hash(password,10)
   try {
    let rasel
     if(role){
      const result=await pool.query(`
      INSERT INTO users(name,email,password,role)
      VALUES($1,$2,$3,$4)
      RETURNING *
    `,[name,email,hashPassowrd,role])
    rasel=result
     }else{
      const result=await pool.query(`
      INSERT INTO users(name,email,password)
      VALUES($1,$2,$3)
      RETURNING *
    `,[name,email,hashPassowrd])
    rasel=result
     }

     const insertedData=rasel.rows[0]
     const {password,...data}=insertedData
    // console.log(result.rows)
    return data
   } catch (error) {
     throw Error(error instanceof Error?error.message:"Something went wrong")
   }
}
export const service={
    getAllUserFromDB,
    addUserIntoDB
}