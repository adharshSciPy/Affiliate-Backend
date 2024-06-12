import { Router } from "express";
import {
  registerCompany,
  loginCompany,
  companyMoreDetials,
  deleteCompany,
} from "../controllers/company.controller.js";

const companyRoute = Router();

companyRoute.route("/register").post(registerCompany);
companyRoute.route("/login").post(loginCompany);
companyRoute.route("/companies/:companyId").patch(companyMoreDetials);
companyRoute.route("/companies/:companyId").delete(deleteCompany);

export default companyRoute;
