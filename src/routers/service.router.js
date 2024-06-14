import { Router } from "express";
import { deleteService, postService,UpadateServiceDetials,getAllServices } from "../controllers/service.controller.js";

const serviceRoute = Router();

 serviceRoute.route('/services/:companyId').post(postService)
serviceRoute.route('/services').get(getAllServices)
serviceRoute.route('/services/:serviceId').patch(UpadateServiceDetials)
serviceRoute.route('/services/:serviceId').delete(deleteService)

export default serviceRoute