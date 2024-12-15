import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { DeliveryPartner } from "../models/deliveryPartner.model.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import { Order } from "../models/order.model.js";


const registerDeliveryPartner=asyncHandler(async (req,res)=>{
   //get partner details from frontend
   //validation - all fields are required
   //check is partner already exist - email
   //create partner object- create entry in db
   //remove password feild from response
   //check for partner creation
   //return response

   const {name, email, phone, areas,shift,status}=req.body;
   console.log("email :",email)

   if(
    [name, email, phone, areas,shift,status].some(field => !field || (typeof field === 'string' && field.trim() === ''))
   ){
    throw new ApiError(400,"All fields are required!")
   }

   const existedPartner= await DeliveryPartner.findOne({email});

   if(existedPartner){
    throw new ApiError(409,"Partner with email already exists")
   }

   const deliveryPartner=await DeliveryPartner.create({
    name,
    email,
    phone,
    areas,
    shift,
    status
   })

  const createdPartner=await DeliveryPartner.findById(deliveryPartner._id).select("-metrics")

  if(!createdPartner){
    throw new ApiError(500,"Something went wrong while registering partner!!")
  }

  return res.status(201).json(
    new ApiResponse(200,createdPartner,"Partner registered Successfully!! ")
  )
})

const displayAllDeliveryPartners=asyncHandler(async (req,res)=>{

    const partners=await DeliveryPartner.find({})      //fetching all the partners list
    console.log(partners)

    if(!partners || partners.length === 0){
        throw new ApiError(404,"No Delivery Partners Found!!")
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            partners,
            "Displayed All the partners.."
        )
       

    )

})

const updateDeliveryPartner=asyncHandler(async (req,res)=>{
    //get id-params , partner details from req body
    //check whether partner exists or not and update (findByIdAndUpdate)
    //return res

    const {id}=req.params;
    const {name,email,phone,areas,shift,status}=req.body;

    const updatedPartner=await DeliveryPartner.findByIdAndUpdate(id,{
        name,
        email,
        phone,
        areas,
        shift,
        status

    })

    if(!updatedPartner){
        throw new ApiError(404,"Partner not Found!!")
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedPartner,
            "Partner details updated successfully !!"
        )
    )


})

const deleteDeliveryParter=asyncHandler(async (req,res)=>{
    //req id
    //check partner with id exists or not
    //delete partner
    //return response

    const {id}=req.params;

    const deletedPartner=await DeliveryPartner.findByIdAndDelete(id)

    if(!deletedPartner){
        throw new ApiError(402,"Partner with id not Found")
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            "partner deleted successfully!"
        )
    )
    
})



export {registerDeliveryPartner,displayAllDeliveryPartners,updateDeliveryPartner,deleteDeliveryParter}