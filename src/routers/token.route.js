import { Router } from "express"
import { generateToken, updateTokenUseCount } from "../controllers/token.controller.js"

const userRoute = Router()

userRoute.route('/tokens').post(generateToken)
userRoute.route('/tokens/:tokenId').patch(updateTokenUseCount)

export default userRoute