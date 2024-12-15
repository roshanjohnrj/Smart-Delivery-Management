import {Router} from "express";
import { assignDeliveryPartner } from "../controllers/assignment.controller.js";
import { performanceMetrics, updateMetrics } from "../controllers/assignmentMetrics.controller.js";

const router = Router();

router.route('/run').post(assignDeliveryPartner)
router.route('/metrics').get(performanceMetrics)



export default router