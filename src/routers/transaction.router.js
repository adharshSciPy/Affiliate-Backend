import { Router } from "express";
import { postTransaction } from "../controllers/transaction.controller.js";

const transactionRouter = Router();

transactionRouter.route('/transactions').post(postTransaction);
// transactionRouter.route('/transactions').get(controllerfunction)
// transactionRouter.route('/transactions/:id').patch(controllerfunction)
// transactionRouter.route('/transactions/:id').delete(controllerfunction)

export default transactionRouter