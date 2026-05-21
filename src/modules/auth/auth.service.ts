import bcrypt from "bcryptjs"
import { pool } from "../../config/db"
import  Jwt  from "jsonwebtoken"
import 'dotenv/config'
import config from "../../config/config"
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
   const accessToken= Jwt.sign(user,config.jwt_secret as string,{expiresIn:"5d"})
   return {token:accessToken,data}
}
export const authService={
   loginUser
}