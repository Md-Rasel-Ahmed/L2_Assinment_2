import { title } from "node:process"
import { pool } from "../../config/db"
import { getSingleIssue } from "../../utils/join"

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
const getAllIssueFromDB=async(payload:{sort:string,type:string,status:string})=>{
    const {sort="newest",type,status}=payload
    // console.log(sort)
    try {
        const result=await pool.query(`
         SELECT * FROM issues
        `)

        const data=result.rows;
        // console.log(data)
        const repoterId:number[]=[]
        for (const id of data) {
            if(!repoterId.includes(id.reporter_id)){
                repoterId.push(id.reporter_id)
            }
        }
        const idString=repoterId.join(',')
       const repoter=await pool.query(`
         SELECT id, name, role FROM users WHERE id IN (${idString})
        `,)
        const allRepoter=repoter.rows
        const allIssues:any[]=[]
      
        for (const issue of data) {
            for (const reporter of allRepoter) {
                  if(issue.reporter_id===reporter.id){
                    delete issue.reporter_id
                    issue.reporter=reporter
                    allIssues.push(issue)
                  }
            }
        }
        // console.log(allIssues)
        return allIssues
    } catch (error) {
        throw new Error("Does not fetch data!")
    }
}
const getSingleIssueFromDB=async(id:any)=>{
    try {
        const result=await pool.query(`
         SELECT * FROM issues WHERE id=$1
        `,[id])
       const data=await getSingleIssue(result.rows[0].reporter_id)
        console.log(data)
        return data
    } catch (error) {
        throw new Error("Does not fetch data!")
    }
}
const updateIssuFromDB=async(payload:{title:string,description:string},id:any,user:any)=>{
   const {title,description}=payload
   try {
    let result
       if(user.role==="maintainer"){
         const update=await pool.query(`
         UPDATE issues
         SET title =$1, description =$2, status ='in_progress'
         WHERE id =$3
         RETURNING *
        `,[title,description,id])
        result=update.rows[0]  
    }else{
        const findIssue=await pool.query(`
            SELECT * FROM issues WHERE id=$1 AND reporter_id=$2
            `,[id,user.id])
        console.log(findIssue.rows[0])
        result=findIssue.rows[0] 
    }
     return result
    } catch (error) {
        throw new Error("Something went wrong")
    }
}
const deleteIssueFromDB=async(id:any)=>{
    try {
        const result=await pool.query(`
         DELETE FROM issues WHERE id=$1;
        `,[id])
        console.log(result)
        return result
    } catch (error) {
        throw new Error("Not founded")
    }
}
export const issueService={
    postIssueIntoDB,
    getAllIssueFromDB,
    getSingleIssueFromDB,
    updateIssuFromDB,
    deleteIssueFromDB
    
}