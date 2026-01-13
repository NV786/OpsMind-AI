import dotenv from "dotenv";
dotenv.config();
import { connectMongo } from "../src/config/mongo.js";

async function checkUserDocs() {
    const db = await connectMongo();
    const vectorsCollection = db.collection("vectors");
    
    const userId = "69579fdfc2eb1febb2be4abb";
    
    console.log(`\n📊 Checking documents for user: ${userId}\n`);
    
    // Check total documents
    const totalDocs = await vectorsCollection.countDocuments();
    console.log(`Total documents in database: ${totalDocs}`);
    
    // Check user's documents
    const userDocs = await vectorsCollection.countDocuments({ userId });
    console.log(`Documents for this user: ${userDocs}`);
    
    // Check documents without userId
    const noUserIdDocs = await vectorsCollection.countDocuments({ userId: { $exists: false } });
    console.log(`Documents without userId: ${noUserIdDocs}`);
    
    // Show sample documents
    if (userDocs > 0) {
        console.log(`\n📄 Sample documents for user:`);
        const samples = await vectorsCollection.find({ userId }).limit(3).toArray();
        samples.forEach((doc, i) => {
            console.log(`\n${i + 1}. Filename: ${doc.filename}`);
            console.log(`   Page: ${doc.page}`);
            console.log(`   Text: ${doc.text.substring(0, 100)}...`);
        });
    }
    
    // Check if vector index exists and has userId filter
    console.log(`\n🔍 Checking Vector Index Configuration...`);
    const indexes = await vectorsCollection.listIndexes().toArray();
    console.log(`\nIndexes found:`);
    indexes.forEach(idx => {
        console.log(`- ${idx.name}: ${JSON.stringify(idx.key || idx)}`);
    });
    
    process.exit(0);
}

checkUserDocs().catch(console.error);
