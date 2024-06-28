import { Router } from "express"
import { generateToken, updateTokenUseCount ,getAllTokens, updateTokenUsage, deleteToken  } from "../controllers/token.controller.js"

const tokenRoute = Router()

tokenRoute.route('/tokens').post(generateToken)
tokenRoute.route('/tokens/:tokenId').patch(updateTokenUseCount)
tokenRoute.route('/tokens/:tokenId').patch(updateTokenUsage)
tokenRoute.route('/tokens').get(getAllTokens )
tokenRoute.route('/tokens/:tokenId').delete(deleteToken)


export default tokenRoute