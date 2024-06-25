import { Router } from "express"
import { generateToken, updateTokenUseCount, updateTokenUsage } from "../controllers/token.controller.js"

const tokenRoute = Router()

tokenRoute.route('/tokens').post(generateToken)
tokenRoute.route('/tokens/:tokenId').patch(updateTokenUseCount)
tokenRoute.route('/tokenusage/:tokenId').patch(updateTokenUsage)

export default tokenRoute