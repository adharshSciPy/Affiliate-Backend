import { Router } from "express";
import {
  registerCompany,
  loginCompany,
  companyMoreDetials,
  deleteCompany,
  getAllcompanies,
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
companyRoute.route('/companies').get(getAllcompanies)


export default companyRoute;
