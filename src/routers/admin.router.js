import { Router } from "express"
import { registerAdmin, loginAdmin,refreshAdminAccessToken,logoutAdmin } from "../controllers/admin.controller.js"

const adminRoute = Router()

adminRoute.route('/register').post(registerAdmin)
adminRoute.route('/login').post(loginAdmin)
adminRoute.route('/refresh').get(refreshAdminAccessToken)
adminRoute.route('/logout').post(logoutAdmin)

export default adminRoute