import express from "express"
import { limiter } from "./utils/apiratelimitter.utils.js"

const app = express()

//middlewares
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(limiter)

export { app }