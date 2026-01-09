// Test the complete upload and search flow
import dotenv from "dotenv";
dotenv.config();

import { connectMongo } from "../src/config/mongo.js";
import { embedText } from "../src/services/embedService.js";

async function testVectorIndex() {
    try {
        const db = await connectMongo();
        const collection = db.collection("vectors");
        
        console.log("\n🔍 Testing Vector Index Configuration...\n");
        
        // Check if vector_index exists
        const indexes = await collection.listSearchIndexes().toArray();
        console.log("Available Search Indexes:");
        indexes.forEach(idx => {
            console.log(`  - Name: ${idx.name}`);
            console.log(`  - Type: ${idx.type}`);
            console.log(`  - Status: ${idx.status}`);
        });
        
        // Test a simple vector search without filter
        console.log("\n📊 Testing Vector Search (No Filter)...");
        const testQuery = "test machine learning";
        const queryVector = await embedText(testQuery);
        
        try {
            const results = await collection.aggregate([
                {
                    "$vectorSearch": {
                        "index": "vector_index",
                        "path": "embedding",
                        "queryVector": queryVector,
                        "numCandidates": 100,
                        "limit": 5
                    }
                }
            ]).toArray();
            
            console.log(`  ✅ Search works! Found ${results.length} documents`);
        } catch (error) {
            console.log(`  ❌ Search failed: ${error.message}`);
        }
        
        // Test vector search WITH userId filter
        console.log("\n📊 Testing Vector Search (With userId Filter)...");
        const testUserId = "69579fdfc2eb1febb2be4abb";
        
        try {
            const results = await collection.aggregate([
                {
                    "$vectorSearch": {
                        "index": "vector_index",
                        "path": "embedding",
                        "queryVector": queryVector,
                        "numCandidates": 100,
                        "limit": 5,
                        "filter": { "userId": testUserId }
                    }
                }
            ]).toArray();
            
            console.log(`  ✅ Filtered search works! Found ${results.length} documents`);
        } catch (error) {
            console.log(`  ❌ Filtered search failed: ${error.message}`);
            console.log(`  ⚠️  You need to update the vector index in MongoDB Atlas!`);
        }
        
        console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
        
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

testVectorIndex();
