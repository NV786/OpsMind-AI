import { Queue } from "bullmq";

// Connecting to the same queue named as worker
const pdfQueue = new Queue("pdf-queue", {
    connection: {
        host: "127.0.0.1",
        port: 6379
    }
});

export const ingestFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const { path, originalname } = req.file;

        // Adding the job to the queue
        // We pass the file path so the worker can read it later
        const job = await pdfQueue.add("process-pdf", {
            filePath: path,
            filename: originalname
        });

        console.log(`[API] File received. Job ID: ${job.id}`);

        // Responding immediately (don't wait for processing)
        res.status(202).json({
            message: "File uploaded successfully. Processing started.",
            jobId: job.id,
            statusUrl: `/api/status/${job.id}` 
        });

    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ error: "Failed to queue file processing" });
    }
};