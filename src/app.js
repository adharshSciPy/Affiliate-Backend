import express from "express"
import { limiter } from "./utils/apiratelimitter.utils.js"

//importing routes
import adminRoute from "./routes/admin.route.js"

const app = express()

//middlewares
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(limiter)

//routes
app.use('/api/v1/admin', adminRoute)

export { app }