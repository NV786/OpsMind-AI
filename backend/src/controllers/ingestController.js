import { Queue } from "bullmq";

// Use the URL directly
const pdfQueue = new Queue("pdf-queue", {
    connection: {
        url: process.env.REDIS_URL // correct
    }
});

export const ingestFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const { path, originalname } = req.file;

        const job = await pdfQueue.add("process-pdf", {
            filePath: path,
            filename: originalname,
            userId: req.user._id.toString()
        });

        console.log(`[API] File received. Job ID: ${job.id}`);

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
