import { getDB } from "../config/utils/mongohelper";
import { MongoFindError, MongoInsertError } from "../errors/mongo";
import { AggregationCursor, ObjectId } from "mongodb";
import { FullPet, Breed, Toy } from "../models/pet";
import Pet from "../models/pet";
import { ensureObjectID } from "../config/utils/mongohelper";

export const insertNewPet = async (
  name: string,
  userId: ObjectId,
  type: string
): Promise<Pet> => {
  return new Promise(async (resolve, reject) => {
    try {
      let db = await getDB();
      const collection = db.collection<Pet>("pets");
      const newPet = new Pet();
      newPet.name = name;
      newPet.userId = userId;
      newPet.type = type;
      newPet.createdAt = new Date();
      newPet.updatedAt = new Date();
      const result = await collection.insertOne(newPet);
      if (result.acknowledged) {
        newPet._id = result.insertedId;
        resolve(newPet);
      } else {
        throw new MongoInsertError(
          "Something went wrong, cannot insert new pet"
        );
      }
    } catch (err) {
      reject(err);
    }
  });
};
//remove pet
export const removePet = async (petId: ObjectId): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      let db = await getDB();
      const collection = db.collection<Pet>("pets");
      const result = await collection.deleteOne({ _id: petId });
      if (result.deletedCount && result.deletedCount > 0) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (err) {
      reject(err);
    }
  });
};
//get pet by id
export const getPetById = async (petId: ObjectId): Promise<Pet | null> => {
  return new Promise(async (resolve, reject) => {
    try {
      let db = await getDB();
      const collection = db.collection<Pet>("pets");
      const result = await collection.findOne({ _id: petId });
      if (result) {
        resolve(result);
      } else {
        resolve(null);
      }
    } catch (err) {
      reject(err);
    }
  });
};
//get all pets
export const getAllPets = async (): Promise<Pet[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      let db = await getDB();
      const collection = db.collection<Pet>("pets");
      const result = await collection.find({}).toArray();
      if (result) {
        resolve(result);
      } else {
        resolve([]);
      }
    } catch (err) {
      reject(err);
    }
  });
};

//getAllPetsbyUser
export const getAllPetsbyUser = async (userId: ObjectId): Promise<Pet[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      let db = await getDB();
      const collection = db.collection<Pet>("pets");
      const result = await collection.find({ userId: userId }).toArray();
      if (result) {
        resolve(result);
      } else {
        //empty array
        resolve([]);
      }
    } catch (err) {
      reject(err);
    }
  });
};

//update pet
export const updatePet = async (
  petId: ObjectId,
  name: string
): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      let db = await getDB();
      const collection = db.collection<Pet>("pets");
      const result = await collection.updateOne(
        { _id: petId },
        { $set: { name: name } }
      );
      if (result.modifiedCount && result.modifiedCount > 0) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (err) {}
  });
};

//mongo joins
export const getPetByIds = async (petId: ObjectId): Promise<FullPet | null> => {
  return new Promise(async (resolve, reject) => {
    try {
      let db = await getDB();
      const collection = db.collection<FullPet>("pets");
      const result = await collection.findOne({ _id: ensureObjectID(petId) });
      if (result) {
        resolve(result);
      } else {
        throw new Error(`Pet with id ${petId} not found`);
      }
    } catch (err) {
      reject(err);
    }
  });
};

export const getBreedByPetId = async (
  petId: ObjectId
): Promise<Breed | null> => {
  return new Promise(async (resolve, reject) => {
    try {
      let db = await getDB();
      const collection = db.collection<Breed>("breed");
      const result = await collection.findOne({ petId: ensureObjectID(petId) });
      if (result) {
        resolve(result);
      } else {
        throw new Error(`Pet with id ${petId} not found`);
      }
    } catch (err) {
      reject(err);
    }
  });
};

export const getToysByPetId = async (petId: ObjectId): Promise<Toy[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      let db = await getDB();
      const collection = db.collection<Toy>("toy");
      const result = await collection
        .find({ petId: ensureObjectID(petId) })
        .toArray();
      if (result) {
        resolve(result);
      } else {
        throw new Error(`Pet with id ${petId} not found`);
      }
    } catch (err) {
      reject(err);
    }
  });
};

//get a full pet using aggregate
export const getFulltPetByIdss = async (
  petId: ObjectId
): Promise<FullPet | null> => {
  return new Promise(async (resolve, reject) => {
    try {
      let db = await getDB();
      const collection = db.collection<FullPet>("pets");
      //define pipeline with aggregate and supply type of aggregation cursor
      const result: AggregationCursor<FullPet> = await collection.aggregate([
        //pet table
        { $match: { _id: ensureObjectID(petId) } },
        //breed table
        {
          $lookup: {
            from: "breed",
            //local field is the field in the pet table
            let: { id: "$_id" },
            //foreign field is the field in the breed table
            pipeline: [
              //match the petId in the breed table with the petId in the pet table using expression
              //$$id is the petId in the pet table and $petId is the petId in the breed table
              { $match: { $expr: { $eq: ["$petId", "$$id"] } } },
            ],
            //save the result in breed
            as: "breed",
          },
        },
        //unwind the breed array to get the breed object. it wont return anything if the pet doesnt have a breed
        { $unwind: { path: "$breed", preserveNullAndEmptyArrays: false } },
        //toy table
        {
          $lookup: {
            from: "toy",
            //local field is the field in the pet table
            let: { id: "$_id" },
            //foreign field is the field in the toy table
            pipeline: [
              //match the petId in the breed table with the petId in the pet table using expression
              //$$id is the petId in the pet table and $petId is the petId in the toy table
              { $match: { $expr: { $eq: ["$petId", "$$id"] } } },
            ],
            //save the result in toys
            as: "toys",
          },
        },
      ]);
      if (result) {
        const resultArray = await result.toArray();
        if (resultArray.length > 0) {
          resolve(resultArray[0]);
        } else {
          throw new Error(`Pet with id ${petId} not found`);
        }
      } else {
        throw new MongoFindError(`Pet with id Aggregation ${petId} not found`);
      }
    } catch (err) {
      reject(err);
    }
  });
};
