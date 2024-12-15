import {Router} from "express";
import { registerDeliveryPartner,displayAllDeliveryPartners, updateDeliveryPartner, deleteDeliveryParter } from "../controllers/deliveryPartner.controller.js";

const router= Router()

router.route("/register").post(registerDeliveryPartner)
router.route("/display").get(displayAllDeliveryPartners)
router.route("/update/:id").put(updateDeliveryPartner)
router.route("/delete/:id").delete(deleteDeliveryParter)





export default router