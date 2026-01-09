// Check pending jobs in Redis queue
import dotenv from "dotenv";
dotenv.config();

import { Queue } from "bullmq";

const pdfQueue = new Queue("pdf-queue", {
    connection: {
        url: process.env.REDIS_URL
    }
});

async function checkQueue() {
    try {
        console.log("\n📋 Checking PDF Queue Status...\n");
        
        const waiting = await pdfQueue.getWaiting();
        const active = await pdfQueue.getActive();
        const completed = await pdfQueue.getCompleted();
        const failed = await pdfQueue.getFailed();
        
        console.log(`⏳ Waiting jobs: ${waiting.length}`);
        console.log(`🔄 Active jobs: ${active.length}`);
        console.log(`✅ Completed jobs: ${completed.length}`);
        console.log(`❌ Failed jobs: ${failed.length}`);
        
        if (waiting.length > 0) {
            console.log("\n⏳ Waiting Jobs:");
            for (const job of waiting) {
                console.log(`  Job ${job.id}: ${job.data.filename}`);
            }
        }
        
        if (failed.length > 0) {
            console.log("\n❌ Failed Jobs:");
            for (const job of failed) {
                console.log(`  Job ${job.id}: ${job.data.filename}`);
                console.log(`  Error: ${job.failedReason}`);
            }
        }
        
        if (completed.length > 0) {
            console.log("\n✅ Recently Completed Jobs:");
            for (const job of completed.slice(0, 5)) {
                console.log(`  Job ${job.id}: ${job.data.filename}`);
            }
        }
        
        console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
        
        await pdfQueue.close();
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

checkQueue();
