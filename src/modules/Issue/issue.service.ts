import { pool } from "../../config/db"

const postIssueIntoDB=async(payload:{title:string,description:string,type:string},reqUser:any)=>{
   const{description,title,type}=payload
    try {
     const result=await pool.query(`
      INSERT INTO issues(title,description,type,reporter_id)
      VALUES($1,$2,$3,$4)
      RETURNING *
    `,[title,description,type,reqUser.id])
   return result
    } catch (error) {
         throw new Error("Issue can not create")
    }
}
const getAllIssueFromDB=async()=>{
    try {
        const result=await pool.query(`
         SELECT * FROM issues
        `)

        const data=result.rows;
        const repoter=await pool.query(`
            SELECT * FROM users WHERE id=$1
            RETURNING *
            `,)

        return result
    } catch (error) {
        throw new Error("Does not fetch data!")
    }
}
const getSingleIssueFromDB=async(id:any)=>{
    try {
        const result=await pool.query(`
         SELECT * FROM issues WHERE id=$1
        `,[id])
        return result
    } catch (error) {
        throw new Error("Does not fetch data!")
    }
}
export const issueService={
    postIssueIntoDB,
    getAllIssueFromDB,
    getSingleIssueFromDB
    
}