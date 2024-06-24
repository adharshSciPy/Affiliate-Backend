import { Router } from "express"
import { registerUser, loginUser, refreshAccessToken, logoutUser, getAllCustomers, getAllaffiliaters } from "../controllers/user.controller.js"

const userRoute = Router()

userRoute.route('/register').post(registerUser)
userRoute.route('/login').post(loginUser)
userRoute.route('/refresh').get(refreshAccessToken)
userRoute.route('/logout').post(logoutUser)
userRoute.route('/customers').get(getAllCustomers)
userRoute.route('/affiliaters').get(getAllaffiliaters)

export default userRoute