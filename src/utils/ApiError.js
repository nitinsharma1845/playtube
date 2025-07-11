class apiError extends Error {
  constructor(
    statusCode,
    message = "Something went Wrong",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.dat = null;
    this.message = message
    this.sucess = false
    this.errors = errors

    if(stack){
        this.stack = stack
    }else{
        Error.captureStackTrace(this , this.constructor)
    }
  }
}


export {apiError}