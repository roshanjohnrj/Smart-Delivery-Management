import { AssignmentMetrics } from "../models/assignmentMetrics.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const updateMetrics=asyncHandler(async(success,reason=null,timeTaken=0)=>{
    const metrics=await AssignmentMetrics.findOne()
    // console.log(metrics)

    if(!metrics){
        const newMetrics=new AssignmentMetrics({
             totalAssigned:success ? 1 : 0,
             successRate:success ? 100 : 0,
             averageTime:success ? timeTaken : 0,
             failureReasons:reason ? [{reason,count:1}] : []
            });
            
        await newMetrics.save();
      return newMetrics;
    }

    const update={
        $inc:{
            totalAssigned:success? 1 : 0
        },
        $set:{}
    }

    //update success rate
    const totalFailures=metrics.failureReasons?.reduce((sum,failure)=>sum+failure.count,0) || 0;
    const totalAttempts=metrics.totalAssigned + totalFailures + 1   // adding the current attempt
    const updatedSuccessRate=(( metrics.totalAssigned + (success? 1 : 0))/totalAttempts) *100;
    update.$set.successRate=updatedSuccessRate;

    //update avg aasignent time
    if (success===true && timeTaken > 0) {
        const updatedAverageTime = ((metrics.averageTime * metrics.totalAssigned) + timeTaken) / (metrics.totalAssigned + 1);
        update.$set.averageTime = updatedAverageTime;
      }
    
    //update failure reasons
    if (!success && reason) {
        const reasonIndex = metrics.failureReasons.findIndex((r) => r.reason === reason);
        if (reasonIndex !== -1) {
           failureReasons[reasonIndex].count += 1;
        } else {
           failureReasons.push({reason,count:1});
        }
        //save updated failure reasons
        update.$set.failureReasons=failureReasons;
      }

     const updatedMetrics= await AssignmentMetrics.findOneAndUpdate({}, update, { new: true });

      return updatedMetrics;

})

const performanceMetrics=asyncHandler(async (req,res)=>{
  const performance=await AssignmentMetrics.findOne();
  return res.status(200).json(
    new ApiResponse(
      200,
      performance,
      "Performace Metrics !"
    )
  )
})

export {updateMetrics,performanceMetrics}