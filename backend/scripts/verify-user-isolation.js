// verify-user-isolation.js
// Run this to verify that documents are properly isolated by user
import dotenv from "dotenv";
dotenv.config();

import { connectMongo } from "../src/config/mongo.js";

async function verify() {
    try {
        const db = await connectMongo();
        const collection = db.collection("vectors");

        console.log("🔍 Checking document isolation...\n");

        // Count total documents
        const total = await collection.countDocuments();
        console.log(`📊 Total documents: ${total}`);

        // Count documents with userId
        const withUserId = await collection.countDocuments({ userId: { $exists: true } });
        console.log(`✅ Documents with userId: ${withUserId}`);

        // Count documents without userId
        const withoutUserId = await collection.countDocuments({ userId: { $exists: false } });
        console.log(`⚠️  Documents without userId: ${withoutUserId}`);

        if (withoutUserId > 0) {
            console.log("\n⚠️  WARNING: You have old documents without userId!");
            console.log("   These will NOT be searchable after the fix.");
            console.log("   Run: node scripts/cleanup-vectors.js");
        }

        // Show unique users
        const users = await collection.distinct("userId");
        console.log(`\n👥 Unique users with documents: ${users.length}`);
        
        if (users.length > 0) {
            console.log("\n📋 Document counts per user:");
            for (const userId of users) {
                if (userId) {
                    const count = await collection.countDocuments({ userId });
                    const files = await collection.distinct("filename", { userId });
                    console.log(`   User ${userId}: ${count} chunks from ${files.length} files`);
                }
            }
        }

        process.exit(0);
    } catch (error) {
        console.error("❌ Verification failed:", error);
        process.exit(1);
    }
}

verify();
