import mongoose, { Schema } from "mongoose";

const assignmentMetricsSchema=new Schema({
    totalAssigned: { 
        type: Number, 
        required: true ,
        default:0
    },
    successRate: { 
        type: Number, 
        required: true ,
        default:0

    },
    averageTime: { 
        type: Number, 
        required: true ,
        default:0

    }, 
    failureReasons: [
      {
        reason: { type: String, required: true },
        count: { type: Number, required: true },
      },
    ],
})

export const AssignmentMetrics=mongoose.model("AssignmentMetrics",assignmentMetricsSchema)