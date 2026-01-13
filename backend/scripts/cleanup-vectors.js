// cleanup-vectors.js
// Run this ONCE to delete all old vectors without userId
import dotenv from "dotenv";
dotenv.config();

import { connectMongo } from "../src/config/mongo.js";

async function cleanup() {
    try {
        const db = await connectMongo();
        const collection = db.collection("vectors");

        // Delete all documents that don't have a userId field
        const result = await collection.deleteMany({
            userId: { $exists: false }
        });

        console.log(`✅ Deleted ${result.deletedCount} old documents without userId`);
        
        // Also show total remaining documents
        const remaining = await collection.countDocuments();
        console.log(`📊 Remaining documents: ${remaining}`);
        
        process.exit(0);
    } catch (error) {
        console.error("❌ Cleanup failed:", error);
        process.exit(1);
    }
}

cleanup();
