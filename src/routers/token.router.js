import { Router } from "express"
import { generateToken, updateTokenUseCount ,getAllTokens  } from "../controllers/token.controller.js"

const tokenRoute = Router()

tokenRoute.route('/tokens').post(generateToken)
tokenRoute.route('/tokens/:tokenId').patch(updateTokenUseCount)
tokenRoute.route('/tokens').get(getAllTokens )


export default tokenRoute