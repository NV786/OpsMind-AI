// src/controllers/streamController.js
import { findSimilarDocuments } from "../services/ragService.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const streamHandler = async (req, res) => {
  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Helper function to send SSE events
  const sendEvent = (data, event = 'message') => {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  // Send initial connection event
  sendEvent({ 
    status: 'connected',
    timestamp: new Date().toISOString()
  }, 'connection');

  try {
    const { query } = req.query;
    
    if (!query) {
      sendEvent({ 
        type: 'error', 
        message: 'No query provided' 
      }, 'error');
      res.end();
      return;
    }

    console.log(`User ${req.user._id} asked (streaming): "${query}"`);

    // Finding relevant chunks from uploaded documents (filtered by user)
    const relevantDocs = await findSimilarDocuments(query, req.user._id.toString());
    
    console.log(`Found ${relevantDocs?.length || 0} relevant documents`);

    if (!relevantDocs || relevantDocs.length === 0) {
      const noDocsMessage = "I checked your uploaded documents, but I couldn't find any information relevant to your question.";
      
      // Stream the message character by character
      for (let i = 0; i < noDocsMessage.length; i++) {
        sendEvent({
          type: 'chunk',
          content: noDocsMessage[i]
        });
        await new Promise(resolve => setTimeout(resolve, 20));
      }
      
      sendEvent({ 
        type: 'complete',
        message: 'Streaming complete'
      }, 'complete');
      
      res.end();
      return;
    }

    // Preparing Context from relevant documents
    const context = relevantDocs.map(doc => doc.text).join("\n\n---\n\n");

    // Generate streaming response with Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite"});

    const prompt = `
You are a smart AI assistant. Answer the user's question based ONLY on the provided Context below.
Be concise and informative.

CONTEXT:
${context}

USER QUESTION:
${query}
`;

    const result = await model.generateContentStream(prompt);

    // Stream the response chunks
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      
      sendEvent({
        type: 'chunk',
        content: chunkText
      });
    }

    // Send completion event
    sendEvent({ 
      type: 'complete',
      message: 'Streaming complete'
    }, 'complete');

  } catch (error) {
    console.error('Streaming error:', error);
    sendEvent({ 
      type: 'error', 
      error: error.message 
    }, 'error');
  } finally {
    res.end();
  }

  // Handle client disconnect
  req.on('close', () => {
    console.log('Client disconnected from stream');
    res.end();
  });
};

// Optional: For a more realistic AI response streaming
export const aiStreamHandler = async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const sendEvent = (data, event = 'message') => {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  sendEvent({ status: 'connected' }, 'connection');

  try {
    const { query } = req.query;
    
    // You can integrate with your actual AI service here
    // Example with OpenAI or another LLM:
    /*
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: query }],
      stream: true,
    });

    for await (const chunk of response) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        sendEvent({
          type: 'chunk',
          content: content
        });
      }
    }
    */

    // For now, use mock data
    const words = query.split(' ');
    const response = `I understand you're asking about "${query}". Here's what I found: `;
    
    // Stream response word by word
    const responseWords = response.split(' ');
    for (let i = 0; i < responseWords.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 100));
      sendEvent({
        type: 'chunk',
        content: responseWords[i] + ' ',
        citation: i % 3 === 0 ? `Reference ${Math.floor(i/3) + 1}` : null,
        citationId: i % 3 === 0 ? `ref-${Math.floor(i/3) + 1}` : null
      });
    }

    sendEvent({ type: 'complete' }, 'complete');

  } catch (error) {
    sendEvent({ error: error.message }, 'error');
  } finally {
    res.end();
  }

  req.on('close', () => {
    res.end();
  });
};