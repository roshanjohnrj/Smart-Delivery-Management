import express, { query } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

//routes
import deliveryPartnerRouter from "./routes/deliveryPartner.routes.js";
import orderRouter from "./routes/orders.routes.js";
import assignmentRouter from "./routes/assignment.routes.js";
import { DeliveryPartner } from "./models/deliveryPartner.model.js";
import { Order } from "./models/order.model.js";
import { ApiError } from "./utils/ApiError.js";
import { Assignment } from "./models/assignment.model.js";
import { AssignmentMetrics } from "./models/assignmentMetrics.model.js";

//routes declaration
app.use("/api/partners", deliveryPartnerRouter);

app.use("/api/orders", orderRouter);

app.use("/api/assignments", assignmentRouter);

//for front end dashboard

app.get("/api/dashboard", async (req, res) => {
  
    const [
      totalPartners,
      activePartners,
      totalOrders,
      completedOrders,
      cancelledOrders,
      pendingOrders,
      recentAssignments,
      activeOrders,
      totalAssignments,
      partnersList,
      successRate,
      availablePartners,
      busyPartners,
      offlinePartners,
      avgTime
    ] = await Promise.all([
      DeliveryPartner.countDocuments(),
      DeliveryPartner.countDocuments({ status: "active" }),
      Order.countDocuments(),
      Order.countDocuments({ status: "delivered" }),
      Order.countDocuments({status:"cancelled"}),
      Order.countDocuments({ status: "pending" }),
      // Order.find().populate('assignedTo','name').sort({createdAt:-1}).lean()
      Assignment.find().sort({createdAt:-1}),
      Order.countDocuments({ status: ["assigned", "picked"] }),
      Assignment.countDocuments(),
      DeliveryPartner.find(),
      AssignmentMetrics.findOne({}, { successRate: 1, _id: 0 }),
      DeliveryPartner.countDocuments({
        status: "active",
        currentLoad: { $lt: 3 }
      }),
      DeliveryPartner.countDocuments({
        status: "active",
        currentLoad:{$gte:3}
      }),
      DeliveryPartner.countDocuments({ status: "inactive" }),
      AssignmentMetrics.findOne({},{averageTime:1,_id:0})
    ]);

    //average rating
    const partners=await DeliveryPartner.find()
      const total=partners.reduce((sum, partner) => sum + partner.metrics.rating, 0)
     const avgRating=total/partners.length;

     res.send({
        totalPartners,
      activePartners,
      totalOrders,
      completedOrders,
      cancelledOrders,
      pendingOrders,
      recentAssignments,
      activeOrders,
      totalAssignments,
      partnersList,
      successRate,
      availablePartners,
      busyPartners,
      offlinePartners,
      avgRating,
      avgTime

     });

     app.post("/api/partners",(req,res)=>{

     })

});

export { app };
