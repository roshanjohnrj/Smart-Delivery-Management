import mongoose,{Schema} from "mongoose";


const deliveryPartnerSchema=new Schema({

     name:{
        type:String,
        required:true
     },
     email:{
        type:String,
        required:true,
        unique:true
     },
     phone:{
        type:String,
        required:true
     },
     status:{
        type:String,
        enum:['active','inactive'],
        required:true
     },
     currentLoad:{
        type:Number,
        max:3,
        required:true,
        default:0    
     },
     areas:[
      {
         type:String,
         required:true
      }
     ],
     shift:{
        start:{                       //hh:mm
            type:String,
            required:true,
            enum:['09:00','17:00']
        },
        end:{                        //hh:mm
            type:String,
            required:true,
            enum:['17:00','01:00']
        }
     },
     metrics:{
        rating:{
            type:Number,
            required:true,
            default:2.5
        },
        completedOrders:{
            type:Number,
            required:true,
            default:0
        },
        cancelledOrders:{
            type:Number,
            required:true,
            default:0
        }
     }
},{timestamps:true})


export const DeliveryPartner=mongoose.model("DeliveryPartner",deliveryPartnerSchema)