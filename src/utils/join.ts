import { pool } from "../config/db";

export const getSingleIssue=async(id:number)=>{
     const result=await pool.query(`
             SELECT * FROM issues WHERE id=$1
            `,[id])
    
            const data=result.rows[0];
            // console.log(data)
            const repoterId:number=data.reporter_id
            

           const repoter=await pool.query(`
             SELECT id, name, role FROM users WHERE id=$1
            `,[repoterId])
            delete data.reporter_id
            data.reporter=repoter.rows[0]
            return data
}