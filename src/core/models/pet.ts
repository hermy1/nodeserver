import { ObjectId } from "mongodb";

export default class Pet {
    _id: ObjectId = new ObjectId();
    name: string = '';
    type : string = '';
    age: number = -1;
    //added favourite food
    favouriteFood: ObjectId = new ObjectId();
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


//pet food
export class PetFood {
    _id: ObjectId = new ObjectId();
    type: string = '';
    brand: ObjectId = new ObjectId();
    size: number = -1;
    createdAt: Date = new Date();
    updatedAt: Date = new Date();
}

//brand
export class Brand {
    _id: ObjectId = new ObjectId();
    name: string = '';
    description: string = '';
    createdAt: Date = new Date();
    updatedAt: Date = new Date();
}

//food and brand 

export class FoodAndBrand {
    _id: ObjectId = new ObjectId();
    petFoodId: ObjectId = new ObjectId();
    brand: Brand = new Brand();
    createdAt: Date = new Date();
    updatedAt: Date = new Date();
}