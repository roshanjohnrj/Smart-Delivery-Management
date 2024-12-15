import mongoose from "mongoose";
import { DB_NAME } from "../contants.js";

const connectDB=async()=>{
   try {
     const connnectInstance= await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
     console.log(`MonbgoDB connected !! host: ${connnectInstance.connection.host}`)
   } catch (error) {
    console.log("MongoDB connection error!",error)
    process.exit(1);
   }
}

export default connectDB