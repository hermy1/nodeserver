import { ObjectId } from "mongodb";

export default class Pet {
    _id: ObjectId = new ObjectId();
    name: string = '';
    type : string = '';
    userId: ObjectId = new ObjectId();
    createdAt: Date = new Date();
    updatedAt: Date = new Date();
}



