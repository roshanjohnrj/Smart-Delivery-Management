
import dotenv from "dotenv";
import connectDB from "./db/db.js";
import {app} from "./app.js"

const PORT= process.env.PORT

dotenv.config({
    path:'./.env'
})



connectDB()
.then(()=>{
    app.listen(PORT || 8000 ,()=>{
        console.log(`server listening on POR: ${process.env.PORT}` )
    })
})
.catch((err)=>{
    console.log("MongoDB connection failed !!! ",err)
})