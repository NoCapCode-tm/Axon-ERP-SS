class Apierror extends Error{
    constructor(
        statuscode,
        message,
        stack=[],
        error=""
   ){
     super(message)
     this.statuscode = statuscode
     this.message=message
     this.data=null
     this.error=error
     if(!stack){
        Error.captureStackTrace(this.constructor,constructor)
        }else{
            this.stack = stack
        }
   }
}

export {Apierror}