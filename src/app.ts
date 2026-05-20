import express, { type Application } from "express"
import { userRouter } from "./modules/user.route";
import globalErrorHandler from "./middlewares/globarErrorHandler";
const app:Application=express()

// middlewares
app.use(express.json())
app.use("/api",userRouter)
app.get("/",(req,res)=>{
    res.status(200).json({
        success:true,
        message:"Database connected successfull"
    })
})
app.use(globalErrorHandler)
export default app;