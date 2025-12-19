import express from "express";
import multer from "multer";
import { ingestFile } from "../controllers/ingestController.js";
import { chatWithPDF } from "../controllers/chatController.js";
import { getJobStatus } from "../services/jobStatusStore.js";

const router = express.Router();

// Configure Multer (where to save uploaded files temporarily)
const upload = multer({ dest: "uploads/" });

// Upload Route (Starts the background job)
router.post("/ingest", upload.single("file"), ingestFile);

// Chat Route (Talks to the AI)
router.post("/chat", chatWithPDF);

// Status Route (Checks progress)
router.get("/status/:jobId", async (req, res) => {
    try {
        const status = await getJobStatus(req.params.jobId);
        if (!status) {
            return res.status(404).json({ error: "Job not found" });
        }
        res.json(status);
    } catch (error) {
        res.status(500).json({ error: "Failed to check status" });
    }
});

export default router;