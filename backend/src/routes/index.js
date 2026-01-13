import express from "express";
import multer from "multer";
import { ingestFile } from "../controllers/ingestController.js";
import { chatWithPDF } from "../controllers/chatController.js";
import { getJobStatus } from "../services/jobStatusStore.js";
import { register, login } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { streamHandler } from "../controllers/streamController.js";
import {
    saveMessage,
    getConversations,
    getConversation,
    deleteConversation,
    updateConversationTitle
} from "../controllers/chatHistoryController.js";

const router = express.Router();

// Configure Multer (where to save uploaded files temporarily)
const upload = multer({ dest: "uploads/" });

// Authentication Routes (Public)
router.post("/auth/register", register);
router.post("/auth/login", login);

// Upload Route (Protected - Starts the background job)
router.post("/ingest", protect, upload.single("file"), ingestFile);

// Chat Route (Protected - Talks to the AI)
router.post("/chat", protect, chatWithPDF);

// Stream Route (Protected - Streaming AI responses)
router.get("/stream", protect, streamHandler);

// Status Route (Protected - Checks progress)
router.get("/status/:jobId", protect, async (req, res) => {
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

// Chat History Routes (Protected)
router.post("/history/message", protect, saveMessage);
router.get("/history/conversations", protect, getConversations);
router.get("/history/conversation/:conversationId", protect, getConversation);
router.delete("/history/conversation/:conversationId", protect, deleteConversation);
router.patch("/history/conversation/:conversationId/title", protect, updateConversationTitle);

export default router;