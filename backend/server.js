import "dotenv/config"; // Loads variables from .env file
import express from "express";
import cors from "cors";
import router from "./src/routes/index.js"; 
import { connectMongo } from "./src/config/mongo.js";

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Middleware
app.use(cors());
app.use(express.json()); // Allows parsing JSON body

// 2. Connect to Database
connectMongo()
    .then(() => console.log("MongoDB Connected via Server"))
    .catch(err => console.error("DB Connection Failed:", err));

// 3. Add SSE Streaming Endpoint (Add this right here)
app.get('/api/stream', async (req, res) => {
  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const sendEvent = (data, event = 'message') => {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  // Send initial connection
  sendEvent({ status: 'connected' }, 'connection');

  try {
    const query = req.query.query || '';
    
    // Simulate streaming response with citations
    const mockResponses = [
      { text: "Based on recent studies ", citation: "Smith et al., 2023" },
      { text: "artificial intelligence models ", citation: "AI Research, 2024" },
      { text: "have shown significant improvements ", citation: "Johnson, 2023" },
      { text: "in natural language processing tasks.", citation: "Tech Review, 2024" }
    ];

    for (let i = 0; i < mockResponses.length; i++) {
      const chunk = mockResponses[i];
      await new Promise(resolve => setTimeout(resolve, 300));
      
      sendEvent({
        type: 'chunk',
        content: chunk.text,
        citation: chunk.citation,
        citationId: `ref-${i + 1}`
      });
    }

    sendEvent({ type: 'complete' }, 'complete');
    
  } catch (error) {
    sendEvent({ error: error.message }, 'error');
  } finally {
    res.end();
  }

  // Handle client disconnect
  req.on('close', () => {
    res.end();
  });
});

// 4. Existing API Routes (This stays exactly as before)
app.use("/api", router);

// 5. Global Error Handler
app.use((err, req, res, next) => {
    console.error("Server Error:", err.stack);
    res.status(500).json({ error: "Something went wrong on the server" });
});

// 6. Start Server
app.listen(PORT, () => {
    console.log(`API Server running on port ${PORT}`);
    console.log(`SSE Streaming endpoint: http://localhost:${PORT}/api/stream`);
});