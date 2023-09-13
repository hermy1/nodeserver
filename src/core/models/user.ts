import { ObjectId } from "mongodb";

export default class User {
    _id: ObjectId = new ObjectId();
    username: string = '';
    password: string = '';
    birthdate: Date = new Date();
    createdAt: Date = new Date();
    updatedAt: Date = new Date();
}