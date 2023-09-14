import User from "../models/user";
import { getDB } from "../config/utils/mongohelper";
import * as bcrypt from "bcrypt";
// controller

export const insertNewUser = async (
  username: string,
  password: string,
  birthdate: Date
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
        newUser.createdAt = new Date();
        newUser.updatedAt = new Date();

        const result = await collection.insertOne(newUser);
        if (result.acknowledged) {
          newUser._id = result.insertedId;
          resolve(newUser);
        } else {
          reject("Cannot insert new user");
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

export const getUserbyUsername = async (username: string): Promise<User> => {
  return new Promise(async (resolve, reject) => {
    try {
      let db = await getDB();
      const collection = db.collection<User>("users");
      const result = await collection.findOne({ username: username });
      resolve(result as User);
    } catch (err) {
      reject(err);
    }
  });
};
