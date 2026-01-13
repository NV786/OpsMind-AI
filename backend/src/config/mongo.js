import { MongoClient } from "mongodb";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

console.log("DEBUG MONGODB_URI:", process.env.MONGODB_URI);

const client = new MongoClient(process.env.MONGODB_URI);

let db;

export async function connectMongo() {
    if (!db) {
        // Connect native MongoDB driver
        await client.connect();
        db = client.db("opsmind");
        
        // Connect Mongoose for authentication
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "opsmind"
        });
        
        console.log("MongoDB and Mongoose connected");
    }
    return db;
}
