import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'framer-motion';

// --- ICONS ---
const Icons = {
  Send: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>,
  Stop: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="6" y="6" width="12" height="12" rx="2" /></svg>,
  // FIX: Updated Paperclip Icon (Cleaner/Sharper)
  Paperclip: () => <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.293 3.293a4.586 4.586 0 1 1 6.414 6.414l-11 11a2.586 2.586 0 1 1-3.656-3.656l10-10a.586.586 0 0 1 .828.828l-10 10a1.414 1.414 0 1 0 2 2l11-11a3.414 3.414 0 0 0-4.828-4.828l-6.293 6.293" /></svg>,
  File: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>,
  X: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>,
  Copy: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>,
  Check: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>,
  ArrowDown: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>,
  Upload: () => <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>,
  Sparkles: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 00-1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" /></svg>,
  User: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>,
  // FIX: Added Alert Icon for Error Messages
  Alert: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
};

// --- HELPER: Message Content & Markdown Parser ---
const MessageContent = ({ content, isUser }) => {
  if (!content) return null;

  // 1. Detect [File: ...] tag (Case Insensitive)
  const fileMatch = content.match(/\[File:\s*(.*?)\]/i);
  const cleanContent = content.replace(/\[File:\s*.*?\]/gi, '').trim();
  const fileName = fileMatch ? fileMatch[1] : null;

  // 2. Parse Code Blocks
  const parts = cleanContent.split(/(```[\s\S]*?```)/g);

  return (
    <div className={`flex flex-col gap-2 w-full ${isUser ? 'items-end' : 'items-start'}`}>
      {/* Text Content */}
      {cleanContent && (
        <div className="space-y-4 w-full">
          {parts.map((part, i) => {
            if (part.startsWith('```')) {
              const code = part.replace(/```/g, '').trim();
              return (
                <div key={i} className="rounded-xl bg-[#0c0c0e] border border-white/10 overflow-hidden my-2 shadow-lg w-full">
                  <div className="px-4 py-2 bg-white/5 border-b border-white/5 text-[10px] text-zinc-500 font-mono flex justify-between items-center tracking-wider">
                    <span>CODE</span>
                  </div>
                  <pre className="p-4 overflow-x-auto text-xs sm:text-sm font-mono text-zinc-300 custom-scrollbar">
                    <code>{code}</code>
                  </pre>
                </div>
              );
            }
            return (
              <p key={i} className={`whitespace-pre-wrap leading-relaxed text-[15px] tracking-wide ${isUser ? 'text-zinc-100' : 'text-zinc-300'}`}>
                {part.split(/(\*\*.*?\*\*)/g).map((sub, j) =>
                  sub.startsWith('**') && sub.endsWith('**') ? <strong key={j} className="text-white font-semibold">{sub.slice(2, -2)}</strong> : sub
                )}
              </p>
            );
          })}
        </div>
      )}

      {/* PDF Attachment UI (Always Visible for Both User & AI) */}
      {fileName && (
        <div className={`flex items-center gap-3 p-3 rounded-xl border w-fit max-w-full mt-1 backdrop-blur-sm ${isUser ? 'bg-white/10 border-white/10' : 'bg-[#202023] border-white/5'}`}>
          <div className="p-2.5 bg-red-500/10 rounded-lg text-red-400 shrink-0">
            <Icons.File />
          </div>
          <div className="flex flex-col min-w-0">
            <span className={`text-xs font-semibold truncate ${isUser ? 'text-white' : 'text-zinc-200'}`}>{fileName}</span>
            <span className={`text-[10px] uppercase font-medium ${isUser ? 'text-zinc-400' : 'text-zinc-500'}`}>PDF Document</span>
          </div>
        </div>
      )}
    </div>
  );
};

// --- COMPONENT: THINKING BUBBLE ---
const ThinkingBubble = () => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="flex gap-4 items-start w-full">
    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 mt-1 shadow-lg shadow-white/5">
      <span className="font-bold text-[8px] text-black">OM</span>
    </div>
    <div className="bg-[#18181b]/50 border border-white/5 rounded-2xl px-4 py-3.5 flex items-center gap-2">
      <span className="text-xs text-zinc-500 font-medium">Thinking</span>
      <div className="flex gap-1">
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} className="w-1 h-1 bg-zinc-400 rounded-full" />
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1 h-1 bg-zinc-400 rounded-full" />
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1 h-1 bg-zinc-400 rounded-full" />
      </div>
    </div>
  </motion.div>
);

export default function UnifiedChat({ conversationId, onConversationStart }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTypingEffect, setIsTypingEffect] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState(conversationId);
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Checks to prevent overwriting new chats
  const isNewConversationRef = useRef(false); // Locks DB load for new chats
  // FIX: Use a Ref to track messages for the "double safety" check without creating a dependency loop
  const messagesRef = useRef(messages);

  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const fileInputRef = useRef(null);

  // Sync messagesRef with messages state
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 300);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, displayedText, isThinking]);

  // --- API LOGIC ---
  const loadConversation = useCallback(async (convId) => {
    // 1. SAFETY LOCK: If we just created the chat locally, DO NOT load from DB.
    if (isNewConversationRef.current) {
      console.log("Skipping DB Load (New Conversation Lock Active)");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/history/conversation/${convId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const conversation = response.data.conversation;
      const dbMessages = conversation?.messages || [];

      // 2. DOUBLE SAFETY: If DB is empty but we have local messages, ignore DB.
      // FIX: Use messagesRef.current instead of messages state directly to avoid dependency loops
      if (dbMessages.length === 0 && messagesRef.current.length > 0) {
        console.log("Skipping DB Load (Empty DB response vs Local Data)");
        return;
      }

      const displayMessages = dbMessages.map((msg, i) => ({
        id: i,
        type: msg.role,
        content: msg.content,
        timestamp: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: msg.sources
      }));
      setMessages(displayMessages);
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  }, []); // Dependencies cleared thanks to Ref usage

  // Watch for Prop Changes (Navigation)
  useEffect(() => {
    if (conversationId && conversationId !== currentConversationId) {
      // Only allow switching if we aren't in the middle of a new chat creation flow
      if (!isNewConversationRef.current) {
        setMessages([]);
        loadConversation(conversationId);
        setCurrentConversationId(conversationId);
      }
    }
    else if (!conversationId && currentConversationId) {
      // Reset for "New Chat" button click
      setMessages([]);
      setCurrentConversationId(null);
      isNewConversationRef.current = false;
    }
    // FIX: Added currentConversationId to dependency array as requested by ESLint
  }, [conversationId, loadConversation, currentConversationId]);

  const saveMessage = async (role, content, sources = []) => {
    try {
      const token = localStorage.getItem('token');
      const convId = currentConversationId || uuidv4();

      await axios.post(
        'http://localhost:5000/api/history/message',
        { conversationId: convId, role, content, sources },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Handle New Conversation Initialization
      if (!currentConversationId) {
        setCurrentConversationId(convId);
        const cleanContent = content.replace(/\[File: .*?\]/g, '').trim();
        let title = role === 'user' ? cleanContent.substring(0, 30) : 'New Chat';
        if (cleanContent.length > 30) title += '...';

        // LOCK: Prevent `useEffect` from reloading this chat from DB immediately
        isNewConversationRef.current = true;

        // Unlock after 5 seconds (enough time for DB to sync)
        setTimeout(() => { isNewConversationRef.current = false; }, 5000);

        if (onConversationStart) {
          onConversationStart(convId, title);
        }
      }
      return convId;
    } catch (error) {
      console.error('Error saving message:', error);
      return currentConversationId;
    }
  };

  // --- FILE HANDLING ---
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      validateAndSetFile(file);
      e.target.value = null;
    }
  };

  const validateAndSetFile = (file) => {
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      alert('Please select a PDF file');
    }
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) return null;
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/ingest', formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
        onUploadProgress: (progressEvent) => setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total))
      });
      setIsUploading(false);
      setUploadProgress(0);
      return selectedFile.name;
    } catch (error) {
      setIsUploading(false);
      setUploadProgress(0);
      const msg = {
        id: Date.now(),
        type: 'system',
        content: `Upload failed: ${error.response?.data?.error || 'Unknown error'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        error: true
      };
      setMessages(prev => [...prev, msg]);
      return null;
    }
  };

  // --- SEND LOGIC ---
  const handleSendMessage = async () => {
    const currentInput = input;
    const currentFile = selectedFile;

    if (!currentInput.trim() && !currentFile) return;

    let uploadedFileName = null;
    if (currentFile) {
      uploadedFileName = await uploadFile();
      if (!uploadedFileName) return;
    }

    const finalQuery = currentInput.trim() || 'Analyze this document';
    const userMessage = currentFile ? `${finalQuery} [File: ${uploadedFileName}]` : finalQuery;

    setInput('');
    setSelectedFile(null);
    setDisplayedText('');

    // --- 1. Optimistic Update (Immediate Show) ---
    const userMsg = {
      id: Date.now(),
      type: 'user',
      content: userMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);

    // --- 2. Save User Message (Background) ---
    await saveMessage('user', userMessage);

    // --- 3. Start AI Thinking ---
    setIsThinking(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/chat', {
        question: finalQuery
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setIsThinking(false);
      const answer = response.data.answer || "I checked your documents but couldn't find relevant information.";

      // --- 4. Start Typing Effect ---
      setIsTypingEffect(true);
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedText(prev => prev + (answer[i] || ''));
        i++;
        if (i >= answer.length) {
          clearInterval(interval);
          setIsTypingEffect(false);
          const assistantMsg = {
            id: Date.now(),
            type: 'assistant',
            content: answer,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          setMessages(prev => [...prev, assistantMsg]);
          setDisplayedText('');
          saveMessage('assistant', answer);
        }
      }, 10);

    } catch (error) {
      console.error("Chat Error", error);
      setIsThinking(false);
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'system',
        content: 'Error: Could not get response from server.',
        error: true
      }]);
    }
  };

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // --- RENDER ---
  return (
    <div
      className="flex flex-col h-full bg-[#09090b] relative font-sans overflow-hidden"
      onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
    >
      <div className="absolute inset-0 bg-dot-pattern opacity-[0.03] pointer-events-none" />

      {/* Drag Overlay */}
      <AnimatePresence>
        {isDragging && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 bg-black/90 backdrop-blur-sm border-2 border-dashed border-blue-500 m-4 rounded-3xl flex flex-col items-center justify-center pointer-events-none">
            <div className="text-blue-500 animate-bounce mb-4"><Icons.Upload /></div>
            <p className="text-2xl font-bold text-white">Drop PDF to Analyze</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. MESSAGES AREA */}
      <div ref={scrollContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth no-scrollbar z-10 flex flex-col justify-start min-h-0">
        <div className="max-w-3xl w-full mx-auto space-y-8 pb-4 grow flex flex-col">

          {messages.length === 0 && !isTypingEffect && !isThinking ? (
            // --- EMPTY STATE ---
            <div className="h-full flex flex-col items-center justify-center text-center opacity-0 animate-fade-in-up py-20">
              <div className="w-16 h-16 bg-[#18181b] border border-white/10 rounded-3xl flex items-center justify-center mb-8 shadow-2xl relative z-10">
                <span className="text-white text-2xl"><Icons.Sparkles /></span>
              </div>
              <h3 className="text-3xl font-semibold text-white mb-3 tracking-tight relative z-10">{getGreeting()}</h3>
              <p className="text-zinc-500 mb-12 text-sm max-w-sm leading-relaxed relative z-10">
                I can summarize documents, answer complex questions, and analyze data for you.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl relative z-10">
                {[{ title: "Summarize file", sub: "Upload a PDF" }, { title: "Analyze risks", sub: "Find key points" }, { title: "Extract dates", sub: "Create timeline" }, { title: "Explain concepts", sub: "Simplify terms" }].map((item, i) => (
                  <button key={i} onClick={() => setInput(item.title)} className="p-4 text-left bg-[#18181b]/80 hover:bg-[#27272a] border border-white/5 rounded-2xl transition-all hover:border-white/10 hover:scale-[1.02] group shadow-sm">
                    <span className="block text-sm font-medium text-zinc-200 mb-0.5 group-hover:text-white">{item.title}</span>
                    <span className="block text-xs text-zinc-500">{item.sub}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // --- CHAT MESSAGES ---
            <div className="space-y-8 pt-4 w-full">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  // FIX: Improved alignment logic for Errors vs User vs Assistant
                  className={`flex w-full ${msg.error || msg.type === 'system'
                      ? 'justify-center' // Center system/error messages
                      : msg.type === 'user'
                        ? 'justify-end'
                        : 'justify-start'
                    }`}
                >

                  {/* --- CASE 1: SYSTEM / ERROR MESSAGE (New Design) --- */}
                  {(msg.error || msg.type === 'system') ? (
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 backdrop-blur-sm max-w-[90%] sm:max-w-md shadow-lg">
                      <div className="p-2 bg-red-500/20 rounded-full text-red-500 shrink-0 animate-pulse">
                        <Icons.Alert />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-red-400 uppercase tracking-wider mb-0.5">System Alert</span>
                        <span className="text-sm text-red-200">{msg.content}</span>
                      </div>
                    </div>
                  ) : msg.type === 'assistant' ? (

                    /* --- CASE 2: ASSISTANT MESSAGE --- */
                    <div className="flex gap-4 max-w-[85%] sm:max-w-[75%] items-start">
                      <div className="shrink-0 mt-1">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg shadow-white/5">
                          <span className="font-bold text-[8px] text-black">OM</span>
                        </div>
                      </div>

                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-zinc-400">OpsMind AI</span>
                          <span className="text-[10px] text-zinc-600">{msg.timestamp}</span>
                        </div>

                        <div className="px-5 py-3.5 rounded-2xl bg-[#18181b]/60 border border-white/5 backdrop-blur-md shadow-sm text-zinc-300 leading-relaxed text-[15px] flex flex-col justify-center min-h-11">
                          <MessageContent content={msg.content} isUser={false} />

                          {/* Action Buttons (Copy) */}
                          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/5">
                            <button
                              onClick={() => copyToClipboard(msg.content, i)}
                              className="text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1.5 text-xs group"
                              title="Copy text"
                            >
                              {copiedIndex === i ? (
                                <span className="text-emerald-500 flex gap-1 items-center"><Icons.Check /> Copied</span>
                              ) : (
                                <><Icons.Copy /><span className="group-hover:underline">Copy</span></>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (

                    /* --- CASE 3: USER MESSAGE --- */
                    <div className="flex flex-col items-end max-w-[85%] sm:max-w-[75%]">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] text-zinc-600">{msg.timestamp}</span>
                        <span className="text-xs font-medium text-zinc-400">You</span>
                        <div className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center border border-white/10">
                          <Icons.User />
                        </div>
                      </div>
                      <div className="px-5 py-3.5 rounded-[20px] text-[15px] leading-relaxed shadow-sm border bg-[#27272a] text-zinc-100 border-white/5 rounded-tr-sm">
                        <MessageContent content={msg.content} isUser={true} />
                      </div>
                    </div>
                  )}

                </motion.div>
              ))}

              {isThinking && <ThinkingBubble />}

              {isTypingEffect && displayedText && (
                <div className="flex w-full justify-start">
                  <div className="flex gap-4 max-w-[85%] sm:max-w-[75%] items-start">
                    <div className="shrink-0 mt-1">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg shadow-white/5"><span className="font-bold text-[8px] text-black">OM</span></div>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-zinc-400">OpsMind AI</span>
                      </div>
                      <div className="px-5 py-3.5 rounded-2xl bg-[#18181b]/60 border border-white/5 backdrop-blur-md shadow-sm text-zinc-300 leading-relaxed text-[15px] flex flex-col justify-center min-h-11">
                        <MessageContent content={displayedText} isUser={false} />
                        <span className="inline-block w-2 h-4 bg-zinc-400 ml-1 align-middle animate-pulse rounded-sm mt-1" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} className="h-2" />
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showScrollBtn && (
          <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} onClick={scrollToBottom} className="absolute bottom-32 right-1/2 translate-x-1/2 p-2 bg-[#18181b] border border-white/10 rounded-full text-zinc-400 hover:text-white shadow-xl z-20 hover:scale-110 transition-transform"><Icons.ArrowDown /></motion.button>
        )}
      </AnimatePresence>

      {/* 2. Floating Input Island */}
      <div className="px-4 pb-6 pt-2 relative z-20 bg-linear-to-t from-[#09090b] via-[#09090b] to-transparent shrink-0">
        <div className="max-w-3xl mx-auto bg-[#18181b] border border-white/10 rounded-[26px] shadow-2xl relative transition-all focus-within:ring-1 focus-within:ring-zinc-700/50 focus-within:border-zinc-700/50 flex flex-col overflow-hidden">

          <AnimatePresence>
            {(selectedFile || isUploading) && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-3 pt-3">
                <div className="flex items-center gap-3 bg-[#202023] rounded-xl p-2 pr-3 border border-white/5 w-fit max-w-full">
                  <div className={`p-2 rounded-lg ${isUploading ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/10 text-red-400'}`}><Icons.File /></div>
                  <div className="flex flex-col min-w-0 mr-2">
                    <span className="text-xs font-semibold text-zinc-200 truncate max-w-37.5">{selectedFile?.name}</span>
                    <span className="text-[10px] text-zinc-500 uppercase mt-0.5">PDF Document</span>
                    {isUploading && <div className="w-full h-0.5 bg-white/10 rounded-full mt-2 overflow-hidden"><motion.div className="h-full bg-blue-500" initial={{ width: 0 }} animate={{ width: `${uploadProgress}%` }} /></div>}
                  </div>
                  {!isUploading && <button onClick={() => setSelectedFile(null)} className="p-1 text-zinc-500 hover:text-white rounded-full hover:bg-white/10 transition-colors"><Icons.X /></button>}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
            placeholder="Send a message..."
            className="w-full bg-transparent border-none text-zinc-200 text-[15px] px-5 py-4 focus:ring-0 focus:outline-none resize-none max-h-48 placeholder-zinc-500 custom-scrollbar"
            rows={1}
            style={{ minHeight: '56px' }}
          />

          <div className="flex items-center justify-between px-3 pb-3">
            <div className="flex items-center gap-1">
              <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept=".pdf" className="hidden" />
              <button onClick={() => fileInputRef.current?.click()} disabled={isThinking || isUploading} className="p-2.5 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors disabled:opacity-50" title="Attach PDF"><Icons.Paperclip /></button>
            </div>

            <button
              onClick={handleSendMessage}
              disabled={(!input.trim() && !selectedFile) || isUploading || isThinking}
              className={`p-2.5 rounded-xl transition-all duration-200 ${isThinking || isTypingEffect
                ? 'bg-zinc-700 text-zinc-400 cursor-wait'
                : input.trim() || selectedFile
                  ? 'bg-white text-black hover:scale-105 shadow-lg shadow-white/10'
                  : 'bg-[#27272a] text-zinc-500 cursor-not-allowed'
                }`}
            >
              {isThinking ? <div className="w-5 h-5 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" /> : <Icons.Send />}
            </button>
          </div>
        </div>
        <p className="text-center text-[10px] text-zinc-600 mt-4 select-none opacity-60">OpsMind AI can make mistakes. Check important info.</p>
      </div>
    </div>
  );
}