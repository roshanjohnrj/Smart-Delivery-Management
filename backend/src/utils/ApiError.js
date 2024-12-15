class ApiError extends Error{
    constructor(
        statusode,
        message="Something went wrong",
        errors=[],
        stack=""
    ){
        super(message)
        this.statusode=statusode
        this.data=null
        this.errors=errors
        this.message=message

        if(stack){
            this.stack=stack 
        }else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export {ApiError}