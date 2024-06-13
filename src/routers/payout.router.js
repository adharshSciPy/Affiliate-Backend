import { Router } from "express";
import { createPayout, deletePayout, savePayout } from "../controllers/payout.controller.js";

const payoutRouter = Router();

payoutRouter.route("/payouts/:companyId/:adminId/company").post(createPayout);
payoutRouter.route("/payouts/:userId/:adminId/user").post(savePayout);
// payoutRouter.route('/payouts').get(controllerfunction)
// payoutRouter.route('/payouts/:id').patch(controllerfunction)
 payoutRouter.route('/payouts/:payoutId').delete(deletePayout)

export default payoutRouter;
