import type { Response } from "express"

type Tresponse<T>={
    success:boolean,
    message:string,
    status:number,
    data?:T
}
const sendResponse=<T>(res:Response,data:Tresponse<T>)=>{
   res.status(data.status).json({
    success:data.success,
    message:data.message,
    data:data.data
   })
}
export default sendResponse