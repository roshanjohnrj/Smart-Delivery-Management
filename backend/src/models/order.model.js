import mongoose, { Schema } from "mongoose";

const orderSchema=new Schema({
   
    orderNumber:{
        type:String,
        required:true,
        unique:true
    },
    customer:{
        name:{
            type:String,
            required:true
        },
        phone:{
            type:String,
            required:true
        },
        address:{
            type:String,
            required:true
        }
    },
    area:{
        type:String,
        required:true
    },
    items:[
        {
            name:{
                type:String,
                required:true
            },
            quantity:{
                type:Number,
                required:true,
            },
            price:{
                type:Number,
                required:true
            }
        }
    ],
    status:{
        type:String,
        enum:['pending','assigned','picked','delivered'],
        required:true,
        default:"pending"
    },
    scheduledFor:{                        //hh:mm
        type:String,
        required:true
    },
    assignedTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"DeliveryPartner",
        default:null
    },
    totalAmount:{
        type:Number,
        required:true
    }

},{timestamps:true})

export const Order=mongoose.model("Order",orderSchema)