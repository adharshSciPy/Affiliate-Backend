import { Router } from "express"
import { registerAdmin } from "../controllers/admin.controller"

const adminRoute = Router()

adminRoute.route('/register').post(registerAdmin)

export default adminRoute