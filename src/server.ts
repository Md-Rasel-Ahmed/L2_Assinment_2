import app from "./app";
import { initDB } from "./config/db";
const port=process.env.PORT||5000
initDB()

app.listen(port,()=>{
  console.log("Server is running on this port",port)
})