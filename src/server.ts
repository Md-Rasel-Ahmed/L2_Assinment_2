import app from "./app";
import { initDBSafe } from "./config/db";
const port=process.env.PORT||5000
initDBSafe();

app.listen(port,()=>{
  console.log("Server is running on this port",port)
})