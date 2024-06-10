import { Router } from "express"
import { registerAdmin, loginAdmin } from "../controllers/admin.controller"

const adminRoute = Router()

adminRoute.route('/register').post(registerAdmin)
adminRoute.route('/login').post(loginAdmin)

export default adminRoute