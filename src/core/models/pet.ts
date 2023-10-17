import { ObjectId } from "mongodb";

export default class Pet {
    _id: ObjectId = new ObjectId();
    name: string = '';
    type : string = '';
    age: number = -1;
    userId: ObjectId = new ObjectId();
    createdAt: Date = new Date();
    updatedAt: Date = new Date();
}

export  class Breed {
    _id: ObjectId = new ObjectId();
    petId: ObjectId = new ObjectId();
    name: string = '';
    description: string = '';
}

export class Toy {
    _id: ObjectId = new ObjectId();
    petId: ObjectId = new ObjectId();
    type: string = '';
    description: string = '';
}



//for getting info from multiple collections
export class FullPet {
    _id: ObjectId = new ObjectId();
    name: string = '';
    age: number = -1;
    createdAt: Date = new Date();
    updatedAt: Date = new Date();
    breed: Breed = new Breed();
    toys: Toy[] = [];
}



