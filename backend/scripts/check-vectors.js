// Check vectors in database
import dotenv from "dotenv";
dotenv.config();

import { connectMongo } from "../src/config/mongo.js";

async function checkVectors() {
    try {
        const db = await connectMongo();
        const collection = db.collection("vectors");
        
        console.log("\n📊 Vector Database Status:");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        
        const totalCount = await collection.countDocuments();
        console.log(`Total documents: ${totalCount}`);
        
        const withUserId = await collection.countDocuments({ userId: { $exists: true, $ne: null } });
        console.log(`Documents with userId: ${withUserId}`);
        
        const withoutUserId = await collection.countDocuments({ userId: { $exists: false } });
        console.log(`Documents without userId: ${withoutUserId}`);
        
        console.log("\n📄 Recent Documents:");
        const recent = await collection.find({}).limit(3).toArray();
        recent.forEach((doc, i) => {
            console.log(`\nDocument ${i + 1}:`);
            console.log(`  - Filename: ${doc.filename}`);
            console.log(`  - Page: ${doc.page}`);
            console.log(`  - UserId: ${doc.userId || 'MISSING'}`);
            console.log(`  - Text preview: ${doc.text.substring(0, 100)}...`);
        });
        
        console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
        
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

checkVectors();
