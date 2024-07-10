import { Router } from "express"
import { registerUser, loginUser, refreshAccessToken, logoutUser, getAllCustomers, getAllVerifiedAffiliaters, getAllNonVerifiedAffiliaters, verifyAffiliater, blockAll } from "../controllers/user.controller.js"

const userRoute = Router()

userRoute.route('/register').post(registerUser)
userRoute.route('/login').post(loginUser)
userRoute.route('/refresh').get(refreshAccessToken)
userRoute.route('/logout').post(logoutUser)
userRoute.route('/customers').get(getAllCustomers)
userRoute.route('/affiliaters').get(getAllVerifiedAffiliaters)
userRoute.route('/affiliaters/not-verified').get(getAllNonVerifiedAffiliaters)
userRoute.route('/affiliaters/:affiliaterId/verify').patch(verifyAffiliater)
userRoute.route('/blockAll/:id/manage-block').patch(blockAll)

export default userRoute