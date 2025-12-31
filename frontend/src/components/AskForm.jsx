import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

export default function AskForm() {
    const [q, setQ] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    async function handleAsk(e) {
        e.preventDefault();
        if (!q.trim()) return;
        
        const userMessage = { type: 'user', content: q, timestamp: new Date() };
        setMessages(prev => [...prev, userMessage]);
        setLoading(true);
        setQ('');
        
        try {
            const res = await axios.post('http://localhost:5000/api/chat', { question: q });
            const aiMessage = { 
                type: 'ai', 
                content: res.data.answer,
                sources: res.data.sources || [],
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMessage]);
        } catch (err) {
            const errorMessage = { 
                type: 'ai', 
                content: `Error: ${err.message || 'Failed to get response'}`,
                error: true,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    }

    const clearChat = () => {
        setMessages([]);
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="flex flex-col h-full">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Document Q&A Assistant</h3>
                        <p className="text-sm text-gray-400">Ask questions about your uploaded documents</p>
                    </div>
                </div>
                {messages.length > 0 && (
                    <button
                        onClick={clearChat}
                        className="px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Clear Chat
                    </button>
                )}
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8">
                        <div className="w-24 h-24 bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl flex items-center justify-center mb-6">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-semibold mb-3">Ask About Your Documents</h3>
                        <p className="text-gray-400 mb-8 max-w-md">Upload PDFs and start asking questions to get AI-powered insights</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full">
                            {[
                                "What are the main points in my documents?",
                                "Summarize the key findings",
                                "Explain the methodology used",
                                "What are the recommendations?"
                            ].map((question, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setQ(question)}
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
                    messages.map((message, index) => (
                        <div key={index} className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : ''}`}>
                            {message.type === 'ai' && (
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                                    <span className="text-white font-bold text-sm">OM</span>
                                </div>
                            )}
                            <div className={`max-w-3xl ${message.type === 'user' ? 'order-1' : 'order-2'}`}>
                                <div className={`rounded-2xl p-5 ${message.type === 'user' ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-gray-800/50 border border-gray-700/50'}`}>
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
                                                <span className="px-2 py-0.5 text-xs font-medium bg-gray-700/50 text-gray-300 rounded">
                                                    {message.sources.length}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {message.sources.map((source, i) => (
                                                    <div key={i} className="px-3 py-2 bg-gray-900/50 rounded-lg border border-gray-700/50 text-xs flex items-center gap-2">
                                                        <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                        <span className="font-medium text-gray-300 truncate max-w-[150px]">{source.filename}</span>
                                                        <span className="text-gray-500">•</span>
                                                        <span className="text-gray-500">Page {source.page}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="text-xs text-gray-500 mt-2 px-2 flex items-center gap-2">
                                    <span>{message.type === 'user' ? 'You' : 'OpsMind AI'}</span>
                                    <span>•</span>
                                    <span>{formatTime(new Date(message.timestamp))}</span>
                                </div>
                            </div>
                            {message.type === 'user' && (
                                <div className="w-10 h-10 bg-gray-700 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                                    <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    ))
                )}
                {loading && (
                    <div className="flex gap-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-sm">OM</span>
                        </div>
                        <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-5">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-75"></div>
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-150"></div>
                                <span className="text-sm text-gray-400 ml-2">Thinking...</span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="p-6 border-t border-gray-700/50">
                <form onSubmit={handleAsk} className="max-w-4xl mx-auto">
                    <div className="relative">
                        <textarea
                            value={q}
                            onChange={e => setQ(e.target.value)}
                            className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl pl-5 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent placeholder-gray-500 resize-none text-gray-100"
                            placeholder="Ask about your documents..."
                            rows="3"
                            disabled={loading}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleAsk(e);
                                }
                            }}
                        />
                        <button
                            type="submit"
                            disabled={loading || !q.trim()}
                            className={`absolute right-4 top-4 p-2.5 rounded-lg transition-all ${loading || !q.trim() ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl'}`}
                        >
                            {loading ? (
                                <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            )}
                        </button>
                        <div className="absolute bottom-3 right-16 text-xs text-gray-500">
                            {q.length}/2000
                        </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 px-2">
                        <div className="text-xs text-gray-500 flex items-center gap-2">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Press Enter to send • Shift+Enter for new line
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
