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


export default companyRoute;
