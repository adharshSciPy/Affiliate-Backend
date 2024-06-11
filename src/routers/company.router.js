import { Router } from "express";
import {
  registerCompany,
  loginCompany,
  companyMoreDetials,
} from "../controllers/company.controller.js";

const companyRoute = Router();

companyRoute.route("/register").post(registerCompany);
companyRoute.route("/login").post(loginCompany);
companyRoute.route("/:companyId").patch(companyMoreDetials);

export default companyRoute;
