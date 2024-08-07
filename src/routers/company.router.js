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
  getPersonalInfo,
  updateSocialLinks,
  identificationDetails,
  getCompanyById,
  businessInformation,
  bankInfo,
  proofOfAddress
} from "../controllers/company.controller.js";
import upload from "../middlewares/uploads.js"

const companyRoute = Router();

companyRoute.route("/register").post(registerCompany);
companyRoute.route("/login").post(loginCompany);
companyRoute.route("/refresh").get(refreshCompanyAccessToken);
companyRoute.route("/logout").post(logoutCompany);
companyRoute.route("/companies/:companyId").patch(companyMoreDetials);
companyRoute.route("/companies/:companyId").delete(deleteCompany);
companyRoute.route('/companies').get(getAllVerifiedCompanies)
companyRoute.route('/companies/not-verified').get(getAllNewCompanies)
companyRoute.route('/companies/:companyId/verify').patch(verifyCompany)
companyRoute.route('/companies/:companyId/social-links').patch(updateSocialLinks)
companyRoute.route('/companies/:companyId/manage-block').patch(manageCompanyBlock)
companyRoute.route('/companies/:companyId/get-personal').get(getPersonalInfo)
companyRoute.route('/companies/:companyId/identification').patch(identificationDetails)
companyRoute.route('/companies/:companyId/getcompanyById').get(getCompanyById)
companyRoute.route('/companies/:companyId/businessinfo').patch(businessInformation)
companyRoute.route('/companies/:companyId/bankInfo').patch(bankInfo)
companyRoute.route('/companies/:companyId/proofOfAddress').patch(upload.array('uploads[]'), proofOfAddress)


export default companyRoute;
