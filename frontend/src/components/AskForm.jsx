import React, { useState } from 'react';
import axios from 'axios';

export default function AskForm() {
    const [q, setQ] = useState('');
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);

    async function handleAsk(e) {
        e.preventDefault();
        if (!q.trim()) return;
        setLoading(true);
        setResponse(null);
        try {
            const res = await axios.post('http://localhost:5000/api/chat', { question: q });
            setResponse(res.data);
        } catch (err) {
            setResponse({ error: err.message || 'Failed to get response' });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            {/* Input Form */}
            <form onSubmit={handleAsk} className="space-y-4">
                <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <input 
                        value={q} 
                        onChange={e => setQ(e.target.value)} 
                        className="w-full pl-12 pr-24 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-500"
                        placeholder="Ask anything about your uploaded documents..." 
                        disabled={loading}
                    />
                    <button 
                        type="submit"
                        disabled={loading || !q.trim()}
                        className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2.5 font-medium rounded-lg transition-all duration-200 flex items-center gap-2 ${
                            loading || !q.trim()
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 hover:shadow-lg active:scale-95'
                        }`}
                    >
                        {loading ? (
                            <>
                                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Thinking...
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                Ask AI
                            </>
                        )}
                    </button>
                </div>
                
                {!q.trim() && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 ml-4">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Try asking questions about your document content</span>
                    </div>
                )}
            </form>

            {/* Loading State */}
            {loading && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                            </div>
                            <div className="absolute -top-1 -right-1">
                                <svg className="w-5 h-5 animate-spin text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="h-2 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full w-3/4 animate-pulse"></div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-2 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full w-1/2 animate-pulse"></div>
                            </div>
                            <p className="text-sm text-blue-700 mt-3">Analyzing your documents and generating answer...</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Error State */}
            {response && response.error && (
                <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-6 border border-red-100">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-red-800 mb-1">Unable to get response</h3>
                            <p className="text-red-700">{response.error}</p>
                            <button 
                                onClick={() => setResponse(null)}
                                className="mt-3 px-4 py-2 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-lg transition-colors duration-200"
                            >
                                Try again
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Response */}
            {response && response.answer && (
                <div className="space-y-6 animate-fadeIn">
                    {/* Answer Card */}
                    <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
                        <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-500"></div>
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-green-100 rounded-xl">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">AI Response</h3>
                                    <p className="text-sm text-gray-600">Based on your uploaded documents</p>
                                </div>
                            </div>
                            
                            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                                <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                                    {response.answer}
                                </div>
                            </div>

                            {/* Source Information */}
                            {response.sources && response.sources.length > 0 && (
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <div className="flex items-center gap-2 mb-3">
                                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                        <h4 className="font-semibold text-gray-700">Document Sources</h4>
                                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                                            {response.sources.length} {response.sources.length === 1 ? 'source' : 'sources'}
                                        </span>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {response.sources.map((source, i) => (
                                            <div 
                                                key={i} 
                                                className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border border-gray-200 hover:border-blue-300 transition-colors duration-200"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="p-2 bg-blue-100 rounded-lg">
                                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                    </div>
                                                    <div className="flex-1">
                                                        <h5 className="font-medium text-gray-900 truncate">{source.filename}</h5>
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <span className="px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                                                                Page {source.page}
                                                            </span>
                                                            <span className="text-xs text-gray-500">
                                                                Source {i + 1}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Ask Another Question */}
                    <div className="text-center">
                        <button
                            onClick={() => {
                                setQ('');
                                setResponse(null);
                            }}
                            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Ask another question
                        </button>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!response && !loading && (
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 p-8 text-center">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-r from-gray-100 to-blue-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Ask About Your Documents</h3>
                    <p className="text-gray-600 mb-4">Upload PDFs and ask questions to get AI-powered insights</p>
                    <div className="inline-flex flex-col items-center gap-2 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-gray-100 rounded">Examples:</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                            <span className="px-3 py-2 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer" onClick={() => setQ("What are the key points?")}>
                                "What are the key points?"
                            </span>
                            <span className="px-3 py-2 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer" onClick={() => setQ("Summarize the main ideas")}>
                                "Summarize the main ideas"
                            </span>
                            <span className="px-3 py-2 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer" onClick={() => setQ("Explain the methodology")}>
                                "Explain the methodology"
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}