import { ObjectId } from "mongodb";
export class Me{
    _id: ObjectId = new ObjectId()
    username: string = '';
    isAdmin: boolean = false;   
  
}
//TODO: objectID checking and switching to string