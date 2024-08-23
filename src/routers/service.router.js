import { Router } from "express";
import { deleteService, postService, upadateServiceDetials, getAllServices, serviceDetail } from "../controllers/service.controller.js";
import upload from "../middlewares/uploads.js";

const serviceRoute = Router();

serviceRoute.route('/services/:companyId').post(upload.single('image'), postService)
serviceRoute.route('/services').get(getAllServices)
serviceRoute.route('/services/:serviceId').get(serviceDetail)
serviceRoute.route('/services/:serviceId').patch(upload.single('image'), upadateServiceDetials)
serviceRoute.route('/services/:serviceId').delete(deleteService)

export default serviceRoute