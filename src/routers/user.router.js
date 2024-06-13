import { Router } from "express"
import { registerUser, loginUser, getAllCustomers } from "../controllers/user.controller.js"

const userRoute = Router()

userRoute.route('/register').post(registerUser)
userRoute.route('/login').post(loginUser)
userRoute.route('/customers').get(getAllCustomers)
// userRoute.route('/affiliaters').get(getAllCustomers)

export default userRoute