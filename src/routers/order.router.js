import { Router } from "express"
import { createOrder } from "../controllers/order.controller.js"

const orderRoute = Router();

orderRoute.route('/orders/:userId').post(createOrder)

export default orderRoute