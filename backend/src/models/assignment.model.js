import mongoose, { Schema } from "mongoose";

const assignmentSchema=new Schema({
    orderId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Order', required: true 
        },
    partnerId: {
         type: mongoose.Schema.Types.ObjectId, 
         ref: 'DeliveryPartner', required: true 
        },
    timestamp: {
         type: Date, 
         default: Date().now 
        },
    status: {
         type: String, 
         enum: ['success', 'failed'], 
         required: true 
        },
    reason: {
         type: String 
        }, // Optional reason for failure

})

export const Assignment=mongoose.model("Assignment",assignmentSchema)