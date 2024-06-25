import { Router } from "express"
import { generateToken, updateTokenUseCount } from "../controllers/token.controller.js"

const tokenRoute = Router()

tokenRoute.route('/tokens').post(generateToken)
tokenRoute.route('/tokens/:tokenId').patch(updateTokenUseCount)

export default tokenRoute