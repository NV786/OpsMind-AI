import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import UnifiedChat from './UnifiedChat';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

// --- ICONS ---
const Icons = {
  Plus: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>,
  Chat: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
  Trash: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Sidebar: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>,
  Search: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>,
  Settings: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Logout: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
  User: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  Close: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
};

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [toast, setToast] = useState(null);

  const searchInputRef = useRef(null);

  // --- API FUNCTION (Wrapped in useCallback) ---
  const fetchConversations = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/history/conversations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = Array.isArray(response.data) ? response.data : (response.data.conversations || []);
      setConversations(data);
    } catch (error) {
      console.error('Fetch error:', error);
      // FIX: Use functional update to avoid dependency on 'conversations' state
      setConversations(prev => {
        if (prev.length === 0) {
          return [{ conversationId: '1', title: 'Welcome to OpsMind', lastMessageAt: new Date().toISOString() }];
        }
        return prev;
      });
    } finally {
      setLoading(false);
    }
  }, []); // Dependencies are empty because we used functional state updates

  // --- RESPONSIVE HANDLER ---
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(true);
      else setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- KEYBOARD SHORTCUTS ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSidebarOpen(true);
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // --- API EFFECT ---
  // FIX: Added fetchConversations to dependency array
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // --- SEARCH EFFECT ---
  useEffect(() => {
    if (!searchQuery) setFilteredConversations(conversations);
    else setFilteredConversations(conversations.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase())));
  }, [searchQuery, conversations]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const deleteConversation = async (conversationId, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this chat?')) return;

    setConversations(prev => prev.filter(c => (c.conversationId || c._id) !== conversationId));
    if (selectedConversationId === conversationId) setSelectedConversationId(null);
    showToast("Conversation deleted");

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/history/conversation/${conversationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) { console.error(error); }
  };

  const handleSelect = (id) => {
    setSelectedConversationId(id);
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-[#09090b] text-white overflow-hidden font-sans selection:bg-white/20">

      {/* --- MOBILE OVERLAY --- */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 z-30 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* --- SIDEBAR --- */}
      <motion.div
        initial={false}
        animate={{
          width: sidebarOpen ? 300 : (isMobile ? 0 : 80),
          x: isMobile && !sidebarOpen ? -300 : 0
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`bg-[#0c0c0e] border-r border-white/5 flex flex-col z-40 shadow-2xl h-full fixed md:relative`}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between h-16 shrink-0">
          {(sidebarOpen || !isMobile) && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black font-bold text-xs shadow-lg">OM</div>
              {sidebarOpen && <span className="font-semibold tracking-tight">OpsMind</span>}
            </motion.div>
          )}
          {!isMobile && (
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-white transition-colors">
              <Icons.Sidebar />
            </button>
          )}
        </div>

        {/* New Chat & Search */}
        <div className="p-4 space-y-3 shrink-0">
          <button
            onClick={() => { setSelectedConversationId(null); if (isMobile) setSidebarOpen(false); }}
            className={`w-full flex items-center gap-2 p-3 bg-white hover:bg-zinc-200 text-black rounded-lg transition-all font-medium text-sm shadow-sm ${!sidebarOpen && !isMobile ? 'justify-center px-0' : ''}`}
          >
            <Icons.Plus />
            {sidebarOpen && <span>New Chat</span>}
          </button>

          {sidebarOpen && (
            <div className="relative group">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search (Cmd+K)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#18181b] border border-white/5 rounded-lg h-9 pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/10 focus:bg-[#202023] transition-all"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"><Icons.Search /></div>
            </div>
          )}
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1 custom-scrollbar">
          {sidebarOpen && conversations.length > 0 && <h2 className="px-3 py-2 text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">History</h2>}

          {loading ? (
            <div className="flex justify-center py-8"><div className="animate-spin w-4 h-4 border-2 border-white/20 border-t-white rounded-full" /></div>
          ) : (
            <AnimatePresence>
              {filteredConversations.map((conv) => (
                <motion.div
                  key={conv.conversationId || conv._id}
                  layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={() => handleSelect(conv.conversationId || conv._id)}
                  className={`group relative p-2.5 rounded-lg cursor-pointer transition-all flex items-center gap-3 ${selectedConversationId === (conv.conversationId || conv._id) ? 'bg-[#18181b] border border-white/5 text-white' : 'text-zinc-400 hover:bg-[#18181b] hover:text-zinc-200 border border-transparent'}`}
                >
                  <div className={`shrink-0 ${!sidebarOpen && !isMobile ? 'mx-auto' : ''}`}><Icons.Chat /></div>
                  {sidebarOpen && (
                    <>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium truncate text-zinc-200">{conv.title || 'Untitled Chat'}</h3>
                        <p className="text-[10px] text-zinc-500 truncate">{new Date(conv.lastMessageAt || Date.now()).toLocaleDateString()}</p>
                      </div>
                      <button onClick={(e) => deleteConversation(conv.conversationId || conv._id, e)} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/10 text-zinc-500 hover:text-red-400 rounded-md transition-all absolute right-2"><Icons.Trash /></button>
                    </>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* User Footer with Popover */}
        <div className="p-4 border-t border-white/5 shrink-0 bg-[#0c0c0e] relative">
          <AnimatePresence>
            {showUserMenu && sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-full left-4 right-4 mb-2 bg-[#18181b] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
              >
                <button onClick={() => setShowSettings(true)} className="w-full px-4 py-3 text-left text-sm hover:bg-white/5 flex items-center gap-3"><Icons.Settings /> Settings</button>
                <div className="h-px bg-white/5" />
                <button onClick={logout} className="w-full px-4 py-3 text-left text-sm hover:bg-red-500/10 text-red-400 flex items-center gap-3"><Icons.Logout /> Sign out</button>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => sidebarOpen ? setShowUserMenu(!showUserMenu) : logout()}
            className={`flex items-center gap-3 w-full rounded-lg transition-colors ${!sidebarOpen && !isMobile ? 'justify-center' : ''}`}
          >
            <div className="w-8 h-8 rounded-full bg-linear-to-tr from-zinc-700 to-zinc-600 border border-white/10 flex items-center justify-center text-xs font-bold shrink-0">
              {currentUser?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium truncate text-white">{currentUser?.username}</p>
                <p className="text-xs text-zinc-500 truncate">Free Plan</p>
              </div>
            )}
          </button>
        </div>
      </motion.div>

      {/* --- MAIN AREA --- */}
      <div className="flex-1 flex flex-col relative bg-[#09090b] w-full">
        {/* Header */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3">
            {isMobile && (
              <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-zinc-400 hover:text-white"><Icons.Sidebar /></button>
            )}
            <div className="flex items-center gap-2">
              <span className="text-zinc-600 text-sm">/</span>
              <h2 className="font-medium text-sm text-zinc-200">
                {selectedConversationId
                  ? conversations.find(c => (c.conversationId === selectedConversationId || c._id === selectedConversationId))?.title || 'Chat'
                  : 'New Conversation'}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2 px-2.5 py-1 bg-emerald-500/5 border border-emerald-500/10 rounded-full">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            <span className="text-[10px] text-zinc-400 font-medium tracking-wide uppercase hidden sm:inline">System Online</span>
          </div>
        </header>

        {/* Chat Content */}
        <div className="flex-1 overflow-hidden relative flex flex-col">
          {selectedConversationId || !loading ? (
            <UnifiedChat conversationId={selectedConversationId} onConversationStart={handleSelect} />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin w-6 h-6 border-2 border-white/20 border-t-white rounded-full"></div>
            </div>
          )}
        </div>
      </div>

      {/* --- MODALS & TOASTS --- */}

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowSettings(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-[#18181b] border border-white/10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative z-10">
              <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <h3 className="text-lg font-semibold">Settings</h3>
                <button onClick={() => setShowSettings(false)} className="text-zinc-400 hover:text-white"><Icons.Close /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <div className="flex items-center gap-3"><Icons.User /> <span>Profile</span></div>
                  <span className="text-xs text-zinc-500">Manage</span>
                </div>
                {/* Add more settings here */}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 px-4 py-3 bg-[#18181b] border border-white/10 text-white text-sm rounded-lg shadow-2xl flex items-center gap-3 z-50"
          >
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}