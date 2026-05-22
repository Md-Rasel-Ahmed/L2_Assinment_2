import type { Request, Response } from "express"
import bcrypt from "bcryptjs"
import type { Iuser } from "../../interfaces/user.interface"
import { pool } from "../../config/db"

const getAllUserFromDB=()=>{
    console.log("database user")
}
type Trole="contributor"|"maintainer"


export const service={
    getAllUserFromDB,
}