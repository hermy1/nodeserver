import { DatabaseError } from "./base";

export class MongoFindError extends DatabaseError {
    //passing message to base class
    constructor(message: string){
        //calling base class constructor
        super(message);
    }
    get statusCode(){
        return 500;
    }
}

//update erors 
export class MongoUpdateError extends DatabaseError {
    //passing message to base class
    constructor(message: string){
        super(message);
    }
    get statusCode(){
        return 500;
    }
}

//remove error 
export class MongoRemoveError extends DatabaseError {
    //passing message to base class
    constructor(message: string){
        super(message);
    }
    get statusCode(){
        return 500;
    }
}

//insert error
export class MongoInsertError extends DatabaseError {
    //passing message to base class
    constructor(message: string){
        super(message);
    }
    get statusCode(){
        return 500;
    }
}