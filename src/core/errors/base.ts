// working with errors, we can use this class as a base class for all errors
export class ApplicationError extends Error {
    get name(){
        return this.constructor.name
    }
}
//database errors eg. if database is down
export class DatabaseError extends ApplicationError {
    //default status code
    get statusCode(){
        return 500;
    }
}

//user errors eg. if user didn't send username
export class UserError extends ApplicationError{
    get statusCode(){
        return 500;
    }
}
//server error eg. if server didn't start correctly
export class ServerError extends ApplicationError{
    get statusCode(){
        return 500;
    }
}