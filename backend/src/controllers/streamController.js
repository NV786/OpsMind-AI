// src/controllers/streamController.js
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

    // Mock streaming response with citations
    // In a real app, this would connect to your AI model
    const mockResponses = [
      { text: "Based on the research by ", citation: "Smith et al., 2023" },
      { text: "published in the Journal of AI Research, ", citation: "AI Research, 2024" },
      { text: "large language models demonstrate ", citation: "Johnson, 2023" },
      { text: "significant improvements in understanding ", citation: "Tech Review, 2024" },
      { text: "and generating human-like text. ", citation: "Smith et al., 2023" },
      { text: "These advancements are particularly notable ", citation: "AI Research, 2024" },
      { text: "in few-shot learning scenarios.", citation: "Johnson, 2023" }
    ];

    // Stream chunks with delay to simulate real-time
    for (let i = 0; i < mockResponses.length; i++) {
      const chunk = mockResponses[i];
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      sendEvent({
        type: 'chunk',
        content: chunk.text,
        citation: chunk.citation,
        citationId: `ref-${i + 1}`,
        chunkIndex: i,
        totalChunks: mockResponses.length
      });
    }

    // Send completion event
    sendEvent({ 
      type: 'complete',
      message: 'Streaming complete',
      totalChunks: mockResponses.length
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