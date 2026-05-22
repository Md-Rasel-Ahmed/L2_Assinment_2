import { title } from "node:process"
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
        const allIssues: any=[]
        const arr=[
            {id:3,name:"X"},
            {id:5,name:"X"},
        ]
        for (const issue of data) {
            for (const r of arr) {
                  if(issue.reporter_id===r.id){
                    issue.reporter_id=r
                    allIssues.push(issue)
                  }
            }
        }
        console.log(allIssues)
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
const updateIssuFromDB=async(payload:{title:string,description:string},id:any)=>{
   const {title,description}=payload
    try {
        const result=await pool.query(`
         UPDATE issues
         SET title =$1, description =$2
         WHERE id =$3
         RETURNING *
        `,[title,description,id])
        return result
    } catch (error) {
        throw new Error("Does not fetch data!")
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