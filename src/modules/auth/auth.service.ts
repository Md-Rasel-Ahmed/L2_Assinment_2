import bcrypt from "bcryptjs"
import { pool } from "../../config/db"
import  Jwt  from "jsonwebtoken"
import 'dotenv/config'
import config from "../../config/config"
import type { Iuser } from "../../interfaces/user.interface"
import { createToken } from "../../utils/jwt"
 const loginUser=async(payload:{email:string,password:string})=>{
   const {email,password:paloadPass}=payload
   const result=await pool.query(`
      SELECT * FROM users WHERE email=$1

    `,[email])
   const user=result.rows[0]
    if(!user){
   throw new Error("Invalid credintials!")
    }
    const matchPassword=await bcrypt.compare(paloadPass,user.password)
    if(!matchPassword){
           throw new Error("Invalid credintials!")
    }

    const {password,...data}=user as any
    const jwtPayload={
      id:user.id,
      name:user.name,
      role:user.role
    }
    const token=createToken(jwtPayload)   
   return {token,user:data}
}
const SingupUserIntoDB=async(payload:Iuser)=>{
    const {name,email,password,role}=payload
    const hashPassowrd=await bcrypt.hash(password,10)
   try {
    let result
    if(role as undefined===""){
      throw new Error("Role must be contributor or maintainer")
    }
     if(role){
      const insertUser=await pool.query(`
      INSERT INTO users(name,email,password,role)
      VALUES($1,$2,$3,$4)
      RETURNING *
    `,[name,email,hashPassowrd,role])
    result=insertUser
     }else{
      const insertUser=await pool.query(`
      INSERT INTO users(name,email,password)
      VALUES($1,$2,$3)
      RETURNING *
    `,[name,email,hashPassowrd])
    result=insertUser
     }

     const insertedData=result.rows[0]
     const {password,...data}=insertedData
    // console.log(result.rows)
    return data
   } catch (error) {
     throw Error(error instanceof Error?error.message:"Something went wrong")
   }
}
export const authService={
   loginUser,
   SingupUserIntoDB
}