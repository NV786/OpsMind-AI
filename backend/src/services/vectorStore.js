import { connectMongo } from "../config/mongo.js";

export async function storeVectors(docs, embeddings, extraMetadata) {
    const db = await connectMongo();
    const collection = db.collection("vectors");

    // Map the LangChain documents to MongoDB documents
    const dbRecords = docs.map((doc, i) => ({
        text: doc.pageContent,           // The text content
        embedding: embeddings[i],        // The vector
        filename: extraMetadata.filename,// The filename
        page: doc.metadata.loc.pageNumber, 
        createdAt: new Date()
    }));

    if (dbRecords.length > 0) {
        await collection.insertMany(dbRecords);
        console.log(`💾 Saved ${dbRecords.length} vectors with page numbers`);
    }
}