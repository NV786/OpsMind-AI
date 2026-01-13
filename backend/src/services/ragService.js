import { connectMongo } from "../config/mongo.js";
import { embedText } from "./embedService.js"; // Re-use the SAME local embedder

export async function findSimilarDocuments(queryText, userId) {
    const db = await connectMongo();
    const collection = db.collection("vectors"); // Must match worker

    // Convert the USER'S question into a vector (using Xenova)
    const queryVector = await embedText(queryText);

    // Run the Vector Search aggregation with user filtering
    const results = await collection.aggregate([
        {
            "$vectorSearch": {
                "index": "vector_index", 
                "path": "embedding",
                "queryVector": queryVector,
                "numCandidates": 100,
                "limit": 5,
                "filter": { "userId": userId }  // Only search this user's documents
            }
        },
        {
            "$project": {
                "_id": 0,
                "text": 1,
                "filename": 1,
                "page": 1,
                "score": { "$meta": "vectorSearchScore" } 
            }
        }
    ]).toArray();

    return results;
}