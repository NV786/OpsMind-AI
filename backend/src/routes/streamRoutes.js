// src/routes/streamRoutes.js
import express from 'express';
import { streamHandler, aiStreamHandler } from '../controllers/streamController.js';

const router = express.Router();

// GET /api/stream - Basic streaming endpoint
router.get('/stream', streamHandler);

// GET /api/stream/ai - AI-powered streaming endpoint
router.get('/stream/ai', aiStreamHandler);

// POST /api/stream - For longer queries
router.post('/stream', (req, res) => {
  // Handle POST requests by redirecting to GET with query in params
  const { query } = req.body;
  if (query) {
    res.redirect(`/api/stream?query=${encodeURIComponent(query)}`);
  } else {
    res.status(400).json({ error: 'No query provided' });
  }
});

export default router;