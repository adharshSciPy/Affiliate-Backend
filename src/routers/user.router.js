import { Router } from "express"
import { registerUser, loginUser, refreshAccessToken, logoutUser, getAllCustomers, getAllVerifiedAffiliaters, getAllNonVerifiedAffiliaters, verifyAffiliater, manageUsersBlock, getUserById } from "../controllers/user.controller.js"

const userRoute = Router()

userRoute.route('/register').post(registerUser)
userRoute.route('/login').post(loginUser)
userRoute.route('/refresh').get(refreshAccessToken)
userRoute.route('/logout').post(logoutUser)
userRoute.route('/customers').get(getAllCustomers)
userRoute.route('/affiliaters').get(getAllVerifiedAffiliaters)
userRoute.route('/affiliaters/not-verified').get(getAllNonVerifiedAffiliaters)
userRoute.route('/affiliaters/:affiliaterId/verify').patch(verifyAffiliater)
userRoute.route('/users/:userId/manage-block').patch(manageUsersBlock)
userRoute.route('/user/:userId').get(getUserById)

export default userRoute