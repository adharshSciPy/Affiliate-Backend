import { Router } from "express";
import { createPayout } from "../controllers/payout.controller.js";

const payoutRouter = Router();

payoutRouter.route("/payouts/:companyId").post(createPayout);
// payoutRouter.route('/payouts').get(controllerfunction)
// payoutRouter.route('/payouts/:id').patch(controllerfunction)
// payoutRouter.route('/payouts/:id').delete(controllerfunction)

export default payoutRouter;
