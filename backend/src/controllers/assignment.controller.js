import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Order } from "../models/order.model.js";
import { DeliveryPartner } from "../models/deliveryPartner.model.js";
import { updateMetrics } from "./assignmentMetrics.controller.js";
import { Assignment } from "../models/assignment.model.js";

const assignDeliveryPartner=asyncHandler(async (req,res)=>{
    //take unassigned orders
     //check if there unassigned orders or not
     //take active partners
     //compare areas
     //check if partners current load is less then 3
     //assign order
 
     //current time
     const currentTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit',timeZone: 'Asia/Kolkata' });
     console.log("Current Time:", currentTime); ///

     const unassignedOrders=await Order.find({
       status:"pending",
       scheduledFor:{$lte:currentTime}
     })
 
     // console.log(unassignedOrders.length)
 
     if(!unassignedOrders){
         throw new ApiError(400,"There is no Unassigined Orders...")
     }
 
     const activePartners=await DeliveryPartner.find({
       status:"active",
       currentLoad:{$lt:3},
       'shift.start':{$lte:currentTime},
       'shift.end':{$gte:currentTime}
     })
       
     console.log("Active Partners Found:", activePartners);   //////

     if (!activePartners || activePartners.length === 0) {
      console.error("No active partners available at this time.");  //////

       throw new ApiError(400, "No active partners available...");
     }
 
     for( const order of unassignedOrders){
 
        
     //start time
     const startTime = Date.now();

       const partner=activePartners.find(p=>p.areas.includes(order.area))
 
       if(!partner){

        await updateMetrics(false, `No partner available for area: ${order.area}`,0);
        
        throw new ApiError(400,`No partner found for area: ${order.area}`)
       }
        
       console.log(order.status)
       order.status="assigned"
       order.assignedTo=partner._id
       await order.save()
 
 
       partner.currentLoad += 1;
       await partner.save()
       
       //end time
       const endTime = Date.now();
       
       //time taken
       const timeTaken = (endTime - startTime) / 1000; // Time in seconds
       const updatedMetrics=await updateMetrics(true, null, timeTaken);

 
     // Record successful assignment
      await Assignment.create({
       orderId: order._id,
       partnerId: partner._id,
       status: "success",
     });




 
     // console.log(assgnmentCreated)
 
       
     }
 
     return res.status(200).json(
       new ApiResponse(
         200,
         unassignedOrders,
         "orders assigned successfully!"
       )
     )
     
     
   
 })


 export {assignDeliveryPartner}
