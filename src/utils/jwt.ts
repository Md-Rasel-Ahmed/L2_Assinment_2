import  Jwt  from 'jsonwebtoken';
import config from '../config/config';
import { pool } from '../config/db';
export const createToken=(payload:object)=>{
 return Jwt.sign(payload,config.jwt_secret as string,{expiresIn:"10d"})

}
export const verifyJwt=(token:string)=>{
  return Jwt.verify(token,config.jwt_secret as string)
}

export const verify_token=async(token:string)=>{
   const validToken:any=verifyJwt(token)
   
   if(!token||!validToken){
       throw new Error("Unauthorized access")
   }
   const findUserFromDb=await pool.query(`
        SELECT * FROM users WHERE id=$1
        `,[validToken.id])
    const user=findUserFromDb.rows[0] 
    if(!validToken?.id===user.id){
      throw new Error("Forbidden access")
    }
   return validToken;
}