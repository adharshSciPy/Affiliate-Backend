import { Router } from "express";
import { registerCompany } from "../controllers/company.controller.js";

const companyRoute = Router();

companyRoute.route('./register').post(registerCompany)

export default companyRoute