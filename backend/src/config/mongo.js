import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

console.log("DEBUG MONGODB_URI:", process.env.MONGODB_URI);

const client = new MongoClient(process.env.MONGODB_URI);

let db;

export async function connectMongo() {
    if (!db) {
        await client.connect();
        db = client.db("opsmind");
        console.log("MongoDB connected");
    }
    return db;
}
