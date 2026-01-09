import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import UnifiedChat from './UnifiedChat';
import api from '../config/axios';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const response = await api.get('/history/conversations');
      setConversations(response.data?.conversations || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setSelectedConversationId(null);
  };

  const handleConversationStart = (conversationId) => {
    setSelectedConversationId(conversationId);
    fetchConversations();
  };

  const handleSelectConversation = (conversationId) => {
    setSelectedConversationId(conversationId);
  };

  const deleteConversation = async (conversationId, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this conversation?')) return;
    
    try {
      await api.delete(`/history/conversation/${conversationId}`);
      setConversations(conversations.filter(c => c.conversationId !== conversationId));
      if (selectedConversationId === conversationId) {
        setSelectedConversationId(null);
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-20' : 'w-80'} bg-gray-800/95 backdrop-blur-lg border-r border-gray-700/50 transition-all duration-300 flex flex-col`}>
        {/* Logo & Collapse Button */}
        <div className="p-4 border-b border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            {!sidebarCollapsed && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">OM</span>
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  OpsMind AI
                </h1>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </button>
          </div>

          {/* New Chat Button */}
          {!sidebarCollapsed && (
            <button
              onClick={handleNewChat}
              className="w-full flex items-center justify-center gap-2 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              New Chat
            </button>
          )}
        </div>

        {/* Chat History List */}
        {!sidebarCollapsed && (
          <div className="flex-1 overflow-y-auto p-3">
            <div className="mb-2 px-3 py-2">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Chat History</h2>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-8 px-4">
                <svg className="w-12 h-12 mx-auto text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-sm text-gray-500">No conversations yet</p>
                <p className="text-xs text-gray-600 mt-1">Start a new chat to begin</p>
              </div>
            ) : (
              <div className="space-y-1">
                {conversations.map((conv) => (
                  <div
                    key={conv.conversationId}
                    onClick={() => handleSelectConversation(conv.conversationId)}
                    className={`group relative p-3 rounded-lg cursor-pointer transition-all ${
                      selectedConversationId === conv.conversationId
                        ? 'bg-gray-700/70 border-l-2 border-blue-500'
                        : 'hover:bg-gray-700/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          <h3 className="text-sm font-medium text-gray-200 truncate">
                            {conv.title}
                          </h3>
                        </div>
                        {conv.lastMessage && (
                          <p className="text-xs text-gray-500 truncate ml-6">
                            {conv.lastMessage}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-1 ml-6">
                          <span className="text-xs text-gray-600">
                            {formatDate(conv.lastMessageAt)}
                          </span>
                          {conv.messageCount > 0 && (
                            <>
                              <span className="text-gray-600">•</span>
                              <span className="text-xs text-gray-600">
                                {conv.messageCount} msgs
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={(e) => deleteConversation(conv.conversationId, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-all"
                        title="Delete conversation"
                      >
                        <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* User Profile & Logout */}
        <div className="border-t border-gray-700/50">
          <div className="p-4 border-b border-gray-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">{user?.username?.[0]?.toUpperCase() || 'U'}</span>
              </div>
              {!sidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{user?.username}</p>
                  <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                </div>
              )}
            </div>
          </div>
          <div className="p-4">
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-3 p-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {!sidebarCollapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-gray-800/95 backdrop-blur-lg border-b border-gray-700/50 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {selectedConversationId ? 'Chat' : 'New Conversation'}
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>AI Ready</span>
              </div>
            </div>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-hidden">
          <UnifiedChat 
            conversationId={selectedConversationId} 
            onConversationStart={handleConversationStart}
          />
        </div>

        {/* Footer */}
        <footer className="bg-gray-800/95 backdrop-blur-lg border-t border-gray-700/50 p-4">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-4">
              <span>OpsMind AI v1.0</span>
              <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded text-xs">AI Online</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Secure</span>
              <span>•</span>
              <span>Private</span>
              <span>•</span>
              <span>Encrypted</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}