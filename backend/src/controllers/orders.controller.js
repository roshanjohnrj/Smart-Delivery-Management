import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { Order } from "../models/order.model.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import { Assignment } from "../models/assignment.model.js";
import {DeliveryPartner} from "../models/deliveryPartner.model.js"




const createNewOrder=asyncHandler( async (req,res)=>{
  //req order details
  //check whether all fields are filled
  //calculate total amount 
  //create and save new order
  //return response
 
    const {orderNumber,customer,area,items}=req.body;
    // console.log(orderNumber)
  
     if(!orderNumber || !customer || !area || !items){
      throw new ApiError(400,"All fields are required!")
     }

     if(await Order.findOne({orderNumber})){
      throw new ApiError(400,"Order Already Exists..")
     }
  
     const totalAmount= items.reduce((total,item)=>total+item.quantity*item.price,0);

     //current time
     const currentTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  
     const newOrder=new Order({
      orderNumber,
      customer,
      area,
      items,
      totalAmount,
      scheduledFor:currentTime

     })
  
     await newOrder.save()
  
     return res.status(200).json(
      new ApiResponse(
        200,
        newOrder,
        "Order created successfully!!"
      )
     )


})

const displayAllOrders=asyncHandler (async (req,res)=>{
   try {
     const orders=await Order.find()
     return res.status(200).json(
         new ApiResponse(
             200,
             orders,
             "displayed all orders"
         )
     )
 
   } catch (error) {
      throw new ApiError(400,"Something went wrong while executing all orders")
   }
})

const updateOrderStatus=asyncHandler(async (req,res)=>{
  //get id from params and status from body
  //check whether the order with id exists or not
  //check the status is valid or not [pending,assigned,picked,delivered]
  //update the status 
  //check for update
  //return res

  const {id}=req.params;
  const {status}=req.body;

  const order=await Order.findById(id)

  if(!order){
    throw new ApiError(400,"Order not Found!")
  }
  
  const ValidateStatus=["pending","assigned","picked","delivered"]

  if(!ValidateStatus.includes(status)){
    throw new ApiError(404,"Enter a valid status...")
  }

  const updatedOrder=await Order.findByIdAndUpdate(id,{status},{new:true})

  const partner = await DeliveryPartner.findById(updatedOrder.assignedTo);
  
  if (status === 'delivered') {
    partner.metrics.completedOrders += 1;
    partner.currentLoad= Math.max(0,partner.currentLoad-1);
    partner.metrics.rating = calculateNewRating(partner.metrics);
    await partner.save();
  } else if (status === 'cancelled') {
    partner.metrics.cancelledOrders += 1;
    partner.currentLoad= Math.max(0,partner.currentLoad-1);
    await partner.save();
  }


function calculateNewRating(metrics) {
  const rating = metrics.completedOrders / 
    (metrics.completedOrders + metrics.cancelledOrders);
  return Math.round(rating * 5 * 10) / 10; // Round to 1 decimal
}
   
  return res.status(200).json(
    new ApiResponse(
      200,
      updatedOrder,
      "Order status updated successfully!!"
    )
  )

})

const deleteOrder=asyncHandler(async (req,res)=>{
  //get order id
  // check if available 
  // delete

  const {id}=req.params;

  const deletedOrder= await Order.findByIdAndDelete(id);

  return res.status(200).json(
    new ApiResponse(
      200,
      deletedOrder,
      "Order deleted successfully!!"
    )
  )
})

const assignmentHistory=asyncHandler(async (req,res)=>{
  //fetch all assigned data
  //check 
  //return res

  const history=await Assignment.find().populate('orderId','orderNumber customer.name status totalAmount').populate('partnerId','name email')

  if (!history || history.length === 0) {
    throw new ApiError(404, "No assignment history found.");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      history,
      "Assignment History fetched Successfully!"
    )
  )
})

const updateOrder=asyncHandler(async(req,res)=>{
  const {id}=req.params;
  const updates = req.body;

  if (!id) {
    throw new ApiError(400, "Order ID is required");
  }

  // Check if updates are provided
  if (!updates || Object.keys(updates).length === 0) {
    throw new ApiError(400, "No update fields provided");
  }

  // Find the order and update it
  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    { $set: updates }, // Set only the fields provided in the request
    { new: true, runValidators: true } // Return the updated document and run validations
  );
  if (!updatedOrder) {
    throw new ApiError(404, `Order with ID ${id} not found`);
  }

  res.status(200).json(new ApiResponse(200, updatedOrder, "Order updated successfully"));


})




export {displayAllOrders,createNewOrder,updateOrderStatus,deleteOrder,assignmentHistory,updateOrder}