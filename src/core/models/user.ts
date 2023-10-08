import { ObjectId } from "mongodb";

export default class User {
    _id: ObjectId = new ObjectId();
    username: string = '';
    password: string = '';
    isAdmin: boolean = false;
    birthdate: Date = new Date();
    createdAt: Date = new Date();
    updatedAt: Date = new Date();
}