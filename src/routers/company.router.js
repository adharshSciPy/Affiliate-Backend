import { Router } from "express";
import {
  registerCompany,
  companyMoreDetials,
  deleteCompany,
  getAllcompanies
} from "../controllers/company.controller.js";

const companyRoute = Router();

companyRoute.route("/register").post(registerCompany);
companyRoute.route("/companies/:companyId").patch(companyMoreDetials);
companyRoute.route("/companies/:companyId").delete(deleteCompany);
companyRoute.route('/companies').get(getAllcompanies)


export default companyRoute;
