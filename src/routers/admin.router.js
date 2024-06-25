import { Router } from "express"
import { registerAdmin, loginAdmin,logoutAdmin } from "../controllers/admin.controller.js"

const adminRoute = Router()

adminRoute.route('/register').post(registerAdmin)
adminRoute.route('/login').post(loginAdmin)
adminRoute.route('/logout').post(logoutAdmin)

export default adminRoute