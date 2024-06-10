import { Router } from "express";
import { registerCompany,loginCompany } from "../controllers/company.controller.js";

const companyRoute = Router();

companyRoute.route('/register').post(registerCompany)
companyRoute.route('/login').post(loginCompany)

export default companyRoute