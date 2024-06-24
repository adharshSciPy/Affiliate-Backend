import express from "express"
import cors from 'cors';
import cookieParser from "cookie-parser";
import { limiter } from "./utils/apilimiter.js"

//importing routes
import adminRoute from "./routers/admin.router.js"
import userRoute from "./routers/user.router.js"
import companyRoute from "./routers/company.router.js"
import serviceRoute from "./routers/service.router.js"
import transactionRoute from "./routers/transaction.router.js"
import payoutRoute from "./routers/payout.router.js"
import orderRoute from "./routers/order.router.js";

const app = express()

//middlewares
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(limiter)
app.use(cors())
app.use(cookieParser())

//routes
app.use('/api/v1/admin', adminRoute)
app.use('/api/v1/user', userRoute)
app.use('/api/v1/company', companyRoute)
app.use('/api/v1/service', serviceRoute)
app.use('/api/v1/transaction', transactionRoute)
app.use('/api/v1/payout', payoutRoute)
app.use('/api/v1/order', orderRoute)

export { app }