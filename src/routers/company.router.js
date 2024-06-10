import { Router } from "express";
import { registerCompany } from "../controllers/company.controller";

const companyRoute = Router();

companyRoute.route('./register').post(registerCompany)

export default companyRoute