import express, { type Application } from "express"
const app:Application=express()

// middlewares
app.use(express.json())

export default app;