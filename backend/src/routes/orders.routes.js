import {Router} from "express";
import { displayAllOrders ,createNewOrder, updateOrderStatus, assignmentHistory, updateOrder} from "../controllers/orders.controller.js";

const router=Router()

router.route("/display").get(displayAllOrders)
router.route("/create").post(createNewOrder)
router.route("/status/:id").put(updateOrderStatus)
router.route("/assign").get(assignmentHistory)
router.route("/update/:id").put(updateOrder)


export default router