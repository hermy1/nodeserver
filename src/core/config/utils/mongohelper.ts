import {MongoClient, Db,ObjectId} from 'mongodb';
import config from '../index';


let mongoInstance: Db;

//get db 
export const getDB = async (): Promise<Db> => {
    if(!mongoInstance){
        
        const connectionString = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${config.mongo.database}`;
        const mongo = await MongoClient.connect(connectionString);
        mongoInstance = mongo.db(config.mongo.database);
        console.log('connected to mongo: ', config.mongo.database);

    }

    return mongoInstance;
};

//ensure object id
export const ensureObjectID = (id: any) => {
    if (typeof id === 'string') {
        return new ObjectId(id);
    }

    return id;
}
