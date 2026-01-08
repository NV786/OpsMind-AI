// src/components/ChatHistory.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChatHistory = ({ onSelectConversation, currentConversationId }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [editingTitle, setEditingTitle] = useState(null);
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/history/conversations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConversations(response.data?.conversations || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteConversation = async (conversationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/history/conversation/${conversationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConversations(conversations.filter(c => c.conversationId !== conversationId));
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  const updateTitle = async (conversationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `/api/history/conversation/${conversationId}/title`,
        { title: newTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setConversations(conversations.map(c =>
        c.conversationId === conversationId ? { ...c, title: newTitle } : c
      ));
      setEditingTitle(null);
      setNewTitle('');
    } catch (error) {
      console.error('Error updating title:', error);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-800">Chat History</h2>
        <p className="text-sm text-gray-600 mt-1">
          {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {conversations.length > 0 ? (
          <div className="space-y-2">
            {conversations.map((conversation) => (
              <div
                key={conversation.conversationId}
                className={`relative group border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-all cursor-pointer ${
                  currentConversationId === conversation.conversationId
                    ? 'bg-blue-50 border-blue-400'
                    : 'bg-white hover:bg-gray-50'
                }`}
                onClick={() => onSelectConversation(conversation.conversationId)}
              >
                {editingTitle === conversation.conversationId ? (
                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          updateTitle(conversation.conversationId);
                        }
                      }}
                    />
                    <button
                      onClick={() => updateTitle(conversation.conversationId)}
                      className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingTitle(null);
                        setNewTitle('');
                      }}
                      className="text-xs bg-gray-300 text-gray-700 px-2 py-1 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-800 text-sm line-clamp-2 flex-1 pr-2">
                        {conversation.title}
                      </h3>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingTitle(conversation.conversationId);
                            setNewTitle(conversation.title);
                          }}
                          className="p-1 hover:bg-gray-200 rounded"
                          title="Edit title"
                        >
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDeleteConfirm(conversation.conversationId);
                          }}
                          className="p-1 hover:bg-red-100 rounded"
                          title="Delete conversation"
                        >
                          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 mb-2 line-clamp-1">
                      {conversation.lastMessage}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{conversation.messageCount} message{conversation.messageCount !== 1 ? 's' : ''}</span>
                      <span>{formatDate(conversation.lastMessageAt)}</span>
                    </div>
                  </>
                )}

                {showDeleteConfirm === conversation.conversationId && (
                  <div
                    className="absolute inset-0 bg-white border-2 border-red-500 rounded-lg p-3 flex flex-col items-center justify-center z-10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <p className="text-sm font-medium text-gray-800 mb-3 text-center">
                      Delete this conversation?
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => deleteConversation(conversation.conversationId)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(null)}
                        className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 p-8 text-center">
            <div className="w-16 h-16 mb-4 text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-400 mb-2">No conversations yet</h3>
            <p className="text-sm text-gray-400">
              Start a new chat to see your history here
            </p>
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 p-3 bg-gray-50">
        <button
          onClick={fetchConversations}
          className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Refresh History
        </button>
      </div>
    </div>
  );
};

export default ChatHistory;
