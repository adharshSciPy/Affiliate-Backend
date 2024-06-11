import { Router } from "express";
import { postService } from "../controllers/service.controller.js";

const serviceRoute = Router();

 serviceRoute.route('/services/:companyId').post(postService)
// serviceRoute.route('/services').get(controllerfunction)
// serviceRoute.route('/services/:id').patch(controllerfunction)
// serviceRoute.route('/services/:id').delete(controllerfunction)

export default serviceRoute