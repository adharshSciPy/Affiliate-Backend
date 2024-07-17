import { Router } from "express";
import {
  registerCompany,
  loginCompany,
  companyMoreDetials,
  deleteCompany,
  getAllVerifiedCompanies,
  getAllNewCompanies,
  refreshCompanyAccessToken,
  logoutCompany,
  verifyCompany,
  manageCompanyBlock,
  getPersonalInfo
} from "../controllers/company.controller.js";

const companyRoute = Router();

companyRoute.route("/register").post(registerCompany);
companyRoute.route("/login").post(loginCompany);
companyRoute.route("/refresh").get( refreshCompanyAccessToken);
companyRoute.route("/logout").post(logoutCompany);
companyRoute.route("/companies/:companyId").patch(companyMoreDetials);
companyRoute.route("/companies/:companyId").delete(deleteCompany);
companyRoute.route('/companies').get(getAllVerifiedCompanies)
companyRoute.route('/companies/not-verified').get(getAllNewCompanies)
companyRoute.route('/companies/:companyId/verify').patch(verifyCompany)
companyRoute.route('/companies/:companyId/manage-block').patch(manageCompanyBlock)
companyRoute.route('/companies/:companyId/get-personal').get(getPersonalInfo)


export default companyRoute;
