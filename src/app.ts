import express, { type Application } from "express"
import globalErrorHandler from "./middlewares/globarErrorHandler";
import { userRouter } from "./modules/user/user.route";
import { authRouter } from "./modules/auth/auth.router";
const app:Application=express()

// middlewares
app.use(express.json())
app.use("/api",userRouter)
app.use("/api",authRouter)
app.get("/",(req,res)=>{
    res.status(200).json({
        success:true,
        message:"Database connected successfull"
    })
})
app.use(globalErrorHandler)
export default app;