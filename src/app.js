import express from "express"
import { limiter } from "./utils/apiratelimitter.utils.js"

//importing routes
import adminRoute from "./routers/admin.route.js"
import companyRoute from "./routers/company.route.js"

const app = express()

//middlewares
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(limiter)

//routes
app.use('/api/v1/admin', adminRoute)
app.use('/api/v1/company',companyRoute)

export { app }