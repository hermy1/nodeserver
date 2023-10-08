import Pet from '../models/pet';
import { getDB } from "../config/utils/mongohelper";
import { MongoInsertError } from "../errors/mongo";
import { ObjectId } from 'mongodb';

export const insertNewPet = async (name:string, userId:ObjectId, type:string): Promise<Pet> => {
    return new Promise(async (resolve, reject) => {
        try {
            let db = await getDB();
            const collection = db.collection<Pet>('pets');
            const newPet = new Pet();
            newPet.name = name;
            newPet.userId = userId;
            newPet.type = type;
            newPet.createdAt = new Date();
            newPet.updatedAt = new Date();
            const result = await collection.insertOne(newPet);
            if(result.acknowledged){
                newPet._id = result.insertedId;
                resolve(newPet);
            } else {
                throw new MongoInsertError('Something went wrong, cannot insert new pet');
            }
        } catch (err){
            reject(err);
        }
    });
};
//remove pet
export const removePet = async (petId: ObjectId): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
        try {
            let db = await getDB();
            const collection = db.collection<Pet>('pets');
            const result = await collection.deleteOne({_id: petId});
            if(result.deletedCount && result.deletedCount > 0){
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (err){
            reject(err);
        }
    });
}
//get pet by id
export const getPetById = async (petId: ObjectId): Promise<Pet | null> => {
    return new Promise(async (resolve, reject) => {
        try {
            let db = await getDB();
            const collection = db.collection<Pet>('pets');
            const result = await collection.findOne({_id: petId});
            if(result){
                resolve(result);
            } else {
                resolve(null);
            }
        } catch (err){
            reject(err);
        }
    });
};
//get all pets
export const getAllPets = async (): Promise<Pet[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            let db = await getDB();
            const collection = db.collection<Pet>('pets');
            const result = await collection.find({}).toArray();
            if (result){
                resolve(result);
            } else {
                resolve([]);
            }
        } catch (err){
            reject(err);
        }
    });
};

//getAllPetsbyUser
export const getAllPetsbyUser = async (userId: ObjectId): Promise<Pet[]> => {
    return new Promise (async (resolve, reject)=> {
        try {
            let db = await getDB();
            const collection = db.collection<Pet>('pets');
            const result = await collection.find({userId: userId}).toArray();
            if(result) {
                resolve(result);
            } else {
                //empty array
                resolve([]);
            }
        } catch (err){
            reject(err);
        }

    })
};

//update pet 
export const updatePet = async (petId: ObjectId, name: string): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
        try {
            let db = await getDB();
            const collection = db.collection<Pet>('pets');
            const result = await collection.updateOne({_id: petId}, {$set: {name: name}});
            if(result.modifiedCount && result.modifiedCount > 0){
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (err) {}
    });
};