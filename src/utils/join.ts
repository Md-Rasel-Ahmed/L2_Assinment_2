import { pool } from "../config/db";

export const getSingleIssue=async(id:number,repoer_id:number)=>{
  console.log(id)
     const result=await pool.query(`
             SELECT * FROM issues WHERE id=$1
            `,[id])
    
            const data=result.rows[0];
            console.log(data)            
           const repoter=await pool.query(`
             SELECT id, name, role FROM users WHERE id=$1
            `,[repoer_id])
            delete data.reporter_id
            data.reporter=repoter.rows[0]
            return data
}