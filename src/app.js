import express from "express"
import Cookieparser from "cookie-parser"
import { superadminrouter } from "./routes/superadmin.routes.js"
const app = express()


app.use(express.json({limit:"16mb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(Cookieparser())


app.use("/api/v1/superadmin",superadminrouter)

export default app