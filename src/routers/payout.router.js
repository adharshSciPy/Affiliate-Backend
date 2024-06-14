import { Router } from "express";
import { adminToCompanyPayout , deletePayout, updatePayout, adminToAffiliatePayout } from "../controllers/payout.controller.js";

const payoutRouter = Router();

payoutRouter.route("/payouts/:companyId/:adminId/company").post(adminToCompanyPayout );
payoutRouter.route("/payouts/:userId/:adminId/user").post(adminToAffiliatePayout);
// payoutRouter.route('/payouts').get(controllerfunction)
 payoutRouter.route("/payouts/:payoutId").patch(updatePayout);
 payoutRouter.route('/payouts/:payoutId').delete(deletePayout)

export default payoutRouter;
