import React, { useState, useEffect, useRef, useCallback } from 'react';
import api, { STREAM_URL } from '../config/axios';
import { v4 as uuidv4 } from 'uuid';

export default function UnifiedChat({ conversationId, onConversationStart }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedText, setStreamedText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const eventSourceRef = useRef(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const [currentConversationId, setCurrentConversationId] = useState(conversationId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamedText]);

  const loadConversation = useCallback(async (convId) => {
    try {
      const response = await api.get(`/history/conversation/${convId}`);

      const conversation = response.data.conversation;
      
      // Convert stored messages to display format
      const displayMessages = conversation.messages.map((msg, index) => ({
        id: index,
        type: msg.role,
        content: msg.content,
        timestamp: new Date(msg.timestamp).toLocaleTimeString(),
        sources: msg.sources
      }));

      setMessages(displayMessages);
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  }, []);

  const saveMessage = async (role, content, sources = []) => {
    try {
      const convId = currentConversationId || uuidv4();
      
      const response = await api.post(
        '/history/message',
        { conversationId: convId, role, content, sources }
      );

      if (!currentConversationId) {
        setCurrentConversationId(convId);
        // Notify parent that a new conversation has started
        if (onConversationStart) {
          onConversationStart(convId);
        }
      }

      return convId;
    } catch (error) {
      console.error('Error saving message:', error);
      return currentConversationId;
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      alert('Please select a PDF file');
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) return null;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile); // Changed from 'pdf' to 'file'

    try {
      const response = await api.post('/ingest', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });

      setIsUploading(false);
      setUploadProgress(0);
      
      // Show success message
      const msg = {
        id: Date.now() - 1,
        type: 'system',
        content: `✓ File "${selectedFile.name}" uploaded successfully and is being processed.`,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, msg]);
      
      return selectedFile.name;
    } catch (error) {
      console.error('Error uploading file:', error);
      setIsUploading(false);
      setUploadProgress(0);
      
      const errorMsg = error.response?.data?.error || 'Failed to upload file. Please try again.';
      
      // Show error message in chat
      const msg = {
        id: Date.now() - 1,
        type: 'system',
        content: `✗ Upload failed: ${errorMsg}`,
        timestamp: new Date().toLocaleTimeString(),
        error: true
      };
      setMessages(prev => [...prev, msg]);
      
      return null;
    }
  };

  const startStreaming = async () => {
    if (!input.trim() && !selectedFile) return;
    
    if (isStreaming) {
      eventSourceRef.current?.close();
    }

    let uploadedFileName = null;
    
    // Upload file first if selected
    if (selectedFile) {
      uploadedFileName = await uploadFile();
      if (!uploadedFileName) return;
    }

    const userMessage = selectedFile 
      ? `${input.trim() ? input : 'Analyze this document'} [Uploaded: ${uploadedFileName}]`
      : input;
    
    setIsStreaming(true);
    
    const userMsg = { 
      id: Date.now(), 
      type: 'user', 
      content: userMessage,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setMessages(prev => [...prev, userMsg]);
    
    // Save user message
    await saveMessage('user', userMessage);
    
    setStreamedText('');
    setInput('');
    setSelectedFile(null);

    // Create SSE connection with token in URL
    const token = localStorage.getItem('token');
    const eventSource = new EventSource(
      `${STREAM_URL}?query=${encodeURIComponent(input.trim() || 'Analyze this document')}&token=${token}`
    );
    eventSourceRef.current = eventSource;

    let fullResponse = '';

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'chunk') {
          fullResponse += data.content;
          setStreamedText(prev => prev + data.content);
        }
      } catch (error) {
        console.error('Error parsing SSE data:', error);
      }
    };

    eventSource.addEventListener('complete', async () => {
      if (fullResponse) {
        const assistantMsg = {
          id: Date.now(),
          type: 'assistant',
          content: fullResponse,
          timestamp: new Date().toLocaleTimeString()
        };
        
        setMessages(prev => [...prev, assistantMsg]);
        
        // Save assistant message
        await saveMessage('assistant', fullResponse, []);
      }
      
      eventSource.close();
      setIsStreaming(false);
      setStreamedText('');
    });

    eventSource.addEventListener('error', (error) => {
      // Check if it's a connection error
      if (eventSource.readyState === EventSource.CLOSED) {
        console.warn('SSE Connection closed. Backend may not be running.');
        eventSource.close();
        setIsStreaming(false);
        
        // Only show error if we didn't get any response
        if (!fullResponse) {
          const errorMsg = {
            id: Date.now(),
            type: 'assistant',
            content: '⚠️ Cannot connect to backend server. Please start the backend with: cd backend && npm run dev',
            timestamp: new Date().toLocaleTimeString(),
            error: true
          };
          setMessages(prev => [...prev, errorMsg]);
        }
        
        setStreamedText('');
      }
    });
  };

  const stopStreaming = () => {
    eventSourceRef.current?.close();
    setIsStreaming(false);
    if (streamedText) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'assistant',
        content: streamedText,
        timestamp: new Date().toLocaleTimeString()
      }]);
      saveMessage('assistant', streamedText, []);
    }
    setStreamedText('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      startStreaming();
    }
  };

  // Load conversation when conversationId changes
  useEffect(() => {
    if (conversationId) {
      loadConversation(conversationId);
      setCurrentConversationId(conversationId);
    } else {
      // New conversation
      setMessages([]);
      setCurrentConversationId(null);
    }
    
    // Cleanup on unmount
    return () => {
      eventSourceRef.current?.close();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  return (
    <div className="flex flex-col h-full">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && !isStreaming ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-3">Start a conversation</h3>
            <p className="text-gray-400 mb-8 max-w-md">Ask questions about your documents or upload new files to analyze</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full">
              {[
                "What are the main points in my documents?",
                "Summarize the key findings",
                "Explain the methodology used",
                "What are the recommendations?"
              ].map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(question)}
                  className="p-4 text-left bg-gray-800/50 hover:bg-gray-700/50 rounded-xl border border-gray-700/50 transition-colors group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium">Try asking</span>
                  </div>
                  <p className="text-sm text-gray-300 group-hover:text-gray-200">"{question}"</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <div key={index}>
                {/* System Messages (uploads, errors) */}
                {message.type === 'system' && (
                  <div className="flex justify-center mb-4">
                    <div className={`px-4 py-2 rounded-lg text-sm ${
                      message.error 
                        ? 'bg-red-500/10 border border-red-500/20 text-red-400' 
                        : 'bg-green-500/10 border border-green-500/20 text-green-400'
                    }`}>
                      {message.content}
                    </div>
                  </div>
                )}
                
                {/* Regular Chat Messages */}
                {message.type !== 'system' && (
                  <div className={`flex gap-4 mb-6 ${message.type === 'user' ? 'justify-end' : ''}`}>
                    {message.type === 'assistant' && (
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white font-bold text-sm">OM</span>
                      </div>
                    )}
                    <div className={`max-w-3xl ${message.type === 'user' ? 'order-1' : 'order-2'}`}>
                      <div className={`rounded-2xl p-5 ${
                        message.type === 'user' 
                          ? 'bg-blue-500/10 border border-blue-500/20' 
                          : message.error 
                            ? 'bg-red-500/10 border border-red-500/20'
                            : 'bg-gray-800/50 border border-gray-700/50'
                      }`}>
                        <div className="prose prose-invert max-w-none">
                          <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                        </div>
                        {message.sources && message.sources.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-gray-700/50">
                            <div className="flex items-center gap-2 mb-3">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                              </svg>
                              <span className="text-sm font-medium text-gray-400">Sources</span>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <span>{message.timestamp}</span>
                      </div>
                    </div>
                    {message.type === 'user' && (
                      <div className="w-10 h-10 bg-gradient-to-r from-gray-700 to-gray-600 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                        <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            
            {/* Streaming message */}
            {isStreaming && streamedText && (
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold text-sm">OM</span>
                </div>
                <div className="max-w-3xl">
                  <div className="rounded-2xl p-5 bg-gray-800/50 border border-gray-700/50">
                    <div className="prose prose-invert max-w-none">
                      <p className="whitespace-pre-wrap leading-relaxed">{streamedText}</p>
                      <span className="inline-block w-2 h-5 bg-blue-500 animate-pulse ml-1"></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-700/50 p-6 bg-gray-800/50">
        {/* File Upload Progress */}
        {isUploading && (
          <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-blue-400">Uploading...</span>
              <span className="text-sm text-blue-400">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Selected File Display */}
        {selectedFile && !isUploading && (
          <div className="mb-4 p-3 bg-gray-700/50 border border-gray-600 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-sm text-gray-300">{selectedFile.name}</span>
              <span className="text-xs text-gray-500">({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
            </div>
            <button
              onClick={() => setSelectedFile(null)}
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        <div className="flex gap-3">
          {/* File Upload Button */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".pdf"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isStreaming || isUploading}
            className="p-3 bg-gray-700/50 hover:bg-gray-700 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Upload PDF"
          >
            <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>

          {/* Text Input */}
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question or upload a document..."
              disabled={isStreaming || isUploading}
              className="w-full p-4 pr-12 bg-gray-700/50 border border-gray-600 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              rows="1"
              style={{ minHeight: '56px', maxHeight: '200px' }}
            />
          </div>

          {/* Send/Stop Button */}
          {isStreaming ? (
            <button
              onClick={stopStreaming}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors font-medium flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
              Stop
            </button>
          ) : (
            <button
              onClick={startStreaming}
              disabled={(!input.trim() && !selectedFile) || isUploading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-xl transition-colors font-medium flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Send
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
