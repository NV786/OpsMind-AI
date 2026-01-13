// src/components/StreamingChat.jsx
import React, { useState, useEffect, useRef } from 'react';

const StreamingChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [citations, setCitations] = useState([]);
  const [streamedText, setStreamedText] = useState('');
  const eventSourceRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamedText]);

  const startStreaming = () => {
    if (!input.trim()) return;
    
    if (isStreaming) {
      eventSourceRef.current?.close();
    }

    setIsStreaming(true);
    setMessages(prev => [...prev, { 
      id: Date.now(), 
      type: 'user', 
      content: input,
      timestamp: new Date().toLocaleTimeString()
    }]);
    setCitations([]);
    setStreamedText('');

    // Get auth token
    const token = localStorage.getItem('token');
    
    // Create SSE connection with token
    const eventSource = new EventSource(
      `/api/stream?query=${encodeURIComponent(input)}&token=${token}`
    );
    eventSourceRef.current = eventSource;

    let currentStreamedText = '';
    let currentCitations = [];

    // Connection opened
    eventSource.addEventListener('connection', (event) => {
      console.log('SSE connection established:', event.data);
    });

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'chunk') {
          // Update streamed text
          currentStreamedText += data.content;
          setStreamedText(currentStreamedText);

          // Add citation if not already present
          if (data.citation) {
            setCitations(prev => {
              const exists = prev.some(c => c.id === data.citationId);
              if (!exists) {
                const newCitation = {
                  id: data.citationId,
                  title: data.citation,
                  content: `Supporting evidence from ${data.citation} related to your query.`,
                  page: Math.floor(Math.random() * 50) + 1,
                  source: 'Research Paper'
                };
                currentCitations = [...prev, newCitation];
                return currentCitations;
              }
              currentCitations = prev;
              return prev;
            });
          }
        }
      } catch (error) {
        console.error('Error parsing SSE data:', error);
      }
    };

    eventSource.addEventListener('complete', () => {
      console.log('Stream complete, text length:', currentStreamedText.length);
      // Add the completed assistant message to messages
      if (currentStreamedText) {
        setMessages(prev => [...prev, {
          id: Date.now(),
          type: 'assistant',
          content: currentStreamedText,
          timestamp: new Date().toLocaleTimeString(),
          citations: currentCitations.map(c => c.id)
        }]);
      }
      
      eventSource.close();
      setIsStreaming(false);
      setStreamedText('');
    });

    eventSource.onerror = (error) => {
      console.error('SSE Error:', error);
      
      // If we have partial content, save it
      if (currentStreamedText) {
        setMessages(prev => [...prev, {
          id: Date.now(),
          type: 'assistant',
          content: currentStreamedText,
          timestamp: new Date().toLocaleTimeString(),
          citations: currentCitations.map(c => c.id)
        }]);
        setStreamedText('');
      }
      
      eventSource.close();
      setIsStreaming(false);
    };

    setInput('');
  };

  const stopStreaming = () => {
    eventSourceRef.current?.close();
    setIsStreaming(false);
    // Add whatever was streamed so far
    if (streamedText) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'assistant',
        content: streamedText,
        timestamp: new Date().toLocaleTimeString(),
        citations: citations.map(c => c.id)
      }]);
    }
    setStreamedText('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      startStreaming();
    }
  };

  useEffect(() => {
    return () => {
      eventSourceRef.current?.close();
    };
  }, []);

  return (
    <div className="flex flex-col h-screen max-w-6xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Streaming Chat with Citations
        </h1>
        <p className="text-gray-600 mt-2">
          Responses stream in real-time with reference cards for citations
        </p>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 gap-6">
        {/* Chat Section */}
        <div className="flex flex-col lg:w-2/3">
          <div className="flex-1 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col">
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-3 ${message.type === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                      }`}
                  >
                    <div className="whitespace-pre-wrap wrap-break-word">
                      {message.content}
                    </div>
                    <div className={`text-xs mt-2 ${message.type === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
                      {message.timestamp}
                    </div>
                  </div>
                </div>
              ))}

              {/* Streaming message */}
              {isStreaming && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] md:max-w-[70%] rounded-2xl rounded-bl-none bg-gray-100 px-4 py-3">
                    <div className="whitespace-pre-wrap wrap-break-word">
                      {streamedText}
                      <span className="inline-block w-2 h-4 ml-1 bg-gray-600 animate-pulse"></span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                      <span className="text-xs text-gray-500">
                        Streaming...
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Section */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your question here..."
                  disabled={isStreaming}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <button
                  onClick={isStreaming ? stopStreaming : startStreaming}
                  disabled={!input.trim() && !isStreaming}
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${isStreaming
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed'
                    }`}
                >
                  {isStreaming ? 'Stop' : 'Send'}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Press Enter to send • {isStreaming ? 'Streaming in progress...' : 'Ready for questions'}
              </p>
            </div>
          </div>
        </div>

        {/* Reference Cards Section */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 h-full overflow-hidden flex flex-col">
            <div className="border-b border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Reference Cards
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Citations from the response
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {citations.length > 0 ? (
                <div className="space-y-4">
                  {citations.map((citation) => (
                    <div
                      key={citation.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors bg-gray-50"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-800 truncate">
                          {citation.title}
                        </h3>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          Page {citation.page}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {citation.content}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          {citation.source}
                        </span>
                        <div className="flex gap-2">
                          <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                            View Source
                          </button>
                          <button className="text-xs text-gray-600 hover:text-gray-800 font-medium">
                            Copy
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 p-8 text-center">
                  <div className="w-16 h-16 mb-4 text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-gray-400 mb-2">
                    No citations yet
                  </h3>
                  <p className="text-sm text-gray-400">
                    Ask a question to see reference cards appear here
                  </p>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 p-3 bg-gray-50">
              <div className="flex justify-between text-sm text-gray-600">
                <span>{citations.length} references</span>
                <span>{isStreaming ? 'Updating...' : 'Complete'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-center text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Server-Sent Events Active</span>
          </div>
          <span className="mx-3">•</span>
          <span>Streaming enabled</span>
          <span className="mx-3">•</span>
          <span>Real-time citations</span>
        </div>
      </div>
    </div>
  );
};

export default StreamingChat;