import { title } from "node:process"
import { pool } from "../../config/db"
import { getSingleIssue } from "../../utils/join"
const postIssueIntoDB=async(payload:{title:string,description:string,type:string},reqUser:{id:number,name:string,role:string})=>{
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
const getAllIssueFromDB = async (payload: { sort: string, type: string, status: string }) => {
    const { sort = "newest", type, status } = payload;
    
    try {
        let queryText = `SELECT * FROM issues WHERE 1=1`;
        const queryParams: any[] = [];
        let paramIndex = 1;

        if (type && type !== 'none') {
            queryText += ` AND type = $${paramIndex}`;
            queryParams.push(type);
            paramIndex++;
        }

        if (status && status !== 'none') {
            queryText += ` AND status = $${paramIndex}`;
            queryParams.push(status);
            paramIndex++;
        }

        if (sort === 'oldest') {
            queryText += ` ORDER BY created_at ASC`;
        } else {
            queryText += ` ORDER BY created_at DESC`; 
        }

        const result = await pool.query(queryText, queryParams);
        const data = result.rows;

        if (data.length === 0) return [];

        const reporterIds: number[] = [];
        for (const row of data) {
            if (row.reporter_id && !reporterIds.includes(row.reporter_id)) {
                reporterIds.push(row.reporter_id);
            }
        }

        let allReporters: any[] = [];
        if (reporterIds.length > 0) {
            const idString = reporterIds.join(',');
            const reporterResult = await pool.query(`
                SELECT id, name, role FROM users WHERE id IN (${idString})
            `);
            allReporters = reporterResult.rows;
        }

        const allIssues: any[] = [];
        for (const issue of data) {
            const reporter = allReporters.find(r => r.id === issue.reporter_id);
            if (reporter) {
                delete issue.reporter_id; 
                issue.reporter = reporter; 
            } else {
                issue.reporter = null; 
            }
            allIssues.push(issue);
        }

        return allIssues;

    } catch (error) {
        throw new Error("Does not fetch data!");
    }
}
const getSingleIssueFromDB=async(id:number)=>{
    try {
        const result=await pool.query(`
            SELECT * FROM issues WHERE id= $1
            `,[id])
            const data=await getSingleIssue(id,result.rows[0].reporter_id)
        return data
    } catch (error) {
        console.log(error)
        throw new Error("Does not fetch data!")
    }
}
const updateIssuFromDB=async(payload:{title:string,description:string},id:number,user:{id:number,name:string,role:string})=>{
  
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
        if(findIssue.rows[0].status==="open"){
         const update=await pool.query(`
         UPDATE issues
         SET title =$1, description =$2, status ='in_progress', updated_at =$3
         WHERE id =$4
         RETURNING *
        `,[title,description,new Date(),id])
        result=update.rows[0]
        }else{
            throw new Error("The issue is progress can,t update")
        }
    }
     return result
    } catch (error) {
        throw new Error("Something went wrong")
    }
}
const deleteIssueFromDB=async(id:number)=>{
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