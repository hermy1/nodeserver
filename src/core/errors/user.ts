//user errors
import { UserError } from "./base";

//bad request error
export class BadRequestError extends UserError {
    constructor(message: string){
        super(message);
    }
    get statusCode(){
        return 400;
    }
}

//unauthorized error
export class unauthorizedError extends UserError {
    constructor(message: string){
        super(message);
    }
    get statusCode(){
        return 401;
    }
}

//not found error
export class NotFoundError extends UserError {
    constructor(message: string){
        super(message);
    }
    get statusCode(){
        return 404;
    }
}