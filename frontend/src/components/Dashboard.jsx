import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import UploadForm from './UploadForm';
import AskForm from './AskForm';
// import DocumentList from './DocumentList';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('chat');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-20' : 'w-64'} bg-gray-800/95 backdrop-blur-lg border-r border-gray-700/50 transition-all duration-300 flex flex-col`}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-700/50">
          <div className="flex items-center justify-between">
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
        </div>

        {/* User Profile */}
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

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => setActiveTab('chat')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${activeTab === 'chat' ? 'bg-gray-700/50 text-blue-400 border-l-2 border-blue-500' : 'hover:bg-gray-700/30 text-gray-300'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {!sidebarCollapsed && <span>Chat</span>}
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${activeTab === 'upload' ? 'bg-gray-700/50 text-blue-400 border-l-2 border-blue-500' : 'hover:bg-gray-700/30 text-gray-300'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            {!sidebarCollapsed && <span>Upload</span>}
          </button>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-700/50">
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-gray-800/95 backdrop-blur-lg border-b border-gray-700/50 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {activeTab === 'chat' && 'Document Q&A'}
              {activeTab === 'documents' && 'My Documents'}
              {activeTab === 'upload' && 'Upload Documents'}
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>AI Ready</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <div className="h-full">
              <AskForm />
            </div>
          )}

          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <div className="h-full p-6 overflow-auto">
              <div className="max-w-4xl mx-auto">
                <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                      <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold">Upload Documents</h3>
                      <p className="text-gray-400">Upload PDFs for AI-powered analysis</p>
                    </div>
                  </div>
                  <UploadForm />
                </div>
              </div>
            </div>
          )}
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