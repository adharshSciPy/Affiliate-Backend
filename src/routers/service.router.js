import { Router } from "express";
import { deleteService, postService,upadateServiceDetials,getAllServices } from "../controllers/service.controller.js";

const serviceRoute = Router();

 serviceRoute.route('/services/:companyId').post(postService)
serviceRoute.route('/services').get(getAllServices)
serviceRoute.route('/services/:serviceId').patch(upadateServiceDetials)
serviceRoute.route('/services/:serviceId').delete(deleteService)

export default serviceRoute