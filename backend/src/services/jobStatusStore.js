import { connectMongo } from "../config/mongo.js";

export async function setJobStatus(jobId, status, details = {}) {
    const db = await connectMongo();
    await db.collection("jobs").updateOne(
        { jobId: String(jobId) },
        { 
            $set: { 
                status: status, 
                updatedAt: new Date(),
                ...details 
            } 
        },
        { upsert: true }
    );
    console.log(`[JobStore] Status updated: ${jobId} -> ${status}`);
}

export async function getJobStatus(jobId) {
    const db = await connectMongo();
    return await db.collection("jobs").findOne({ jobId: String(jobId) });
}