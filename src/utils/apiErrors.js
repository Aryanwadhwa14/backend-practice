class ApiError extends Error{
    constructor(
        statuscode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ){
        super(message)
        this.statusCode = this.statusCode
        this.data = null 
        this.message = message 
        this.success = false ;
        this.errors = errors 

        if(stack){
            this.stack = stack 
        } else{
            Error.captureStackTrace(this,this.constructor)  //passed the instance how the api error is being traced 
        }
    }
}


export {ApiError}