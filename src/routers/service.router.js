import { Router } from "express";
import { deleteService, postService } from "../controllers/service.controller.js";

const serviceRoute = Router();

 serviceRoute.route('/services/:companyId').post(postService)
// serviceRoute.route('/services').get(controllerfunction)
// serviceRoute.route('/services/:id').patch(controllerfunction)
serviceRoute.route('/services/:serviceId').delete(deleteService)

export default serviceRoute