import User from "../models/user";
import { getDB } from "../config/utils/mongohelper";
import * as bcrypt from "bcrypt";
import { MongoInsertError } from "../errors/mongo";
import { ObjectId } from "mongodb";
// controller

export const insertNewUser = async (
  username: string,
  password: string,
  birthdate: Date,
  isAdmin: boolean
): Promise<User> => {
  return new Promise(async (resolve, reject) => {
    try {
      let db = await getDB();
      const collection = db.collection<User>("users");
      bcrypt.hash(password, 10, async (err, hash) => {
        const newUser = new User();
        newUser.username = username;
        newUser.password = hash;
        newUser.birthdate = birthdate;
        newUser.isAdmin = isAdmin;
        newUser.createdAt = new Date();
        newUser.updatedAt = new Date();

        const result = await collection.insertOne(newUser);
        if (result.acknowledged) {
          newUser._id = result.insertedId;
          resolve(newUser);
        } else {
            throw new MongoInsertError("Something went wrong, cannot insert new user");
        }
      });
    } catch (err) {
      reject(err);
    }
  });
};

export const getAllUsers = async (): Promise<User[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      let db = await getDB();
      const collection = db.collection<User>("users");
      const result = await collection.find({}).toArray();
      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
};

export const getUserbyUsername = async (username: string): Promise<User | null> => {
  return new Promise(async (resolve, reject) => {
    try {
      let db = await getDB();
      const collection = db.collection<User>("users");
      const result = await collection.findOne({ username: username });
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

//get a user by id
export const getUserbyId = async (userId: ObjectId): Promise<User | null> => {
  return new Promise(async (resolve, reject) => {
    try {
      let db = await getDB();
      const collection = db.collection<User>("users");
      const result = await collection.findOne({ _id: userId });
      if (result) {
        resolve(result);
      } else {
        resolve(null);
      }
    } catch (errr) {
      reject(errr);
    }
  });
};

//changeUserToAdmin
export const changeUserToAdmin = async (userId: ObjectId, isAdmin: boolean): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      let db = await getDB();
      const collection = db.collection<User>("users");
      const result = await collection.updateOne({ _id: userId }, { $set: { isAdmin: isAdmin } });
      if (result.modifiedCount > 0) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (err) {}
  });
};
