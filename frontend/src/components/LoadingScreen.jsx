import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LOADING_MESSAGES = [
    "Initializing Environment...",
    "Verifying Credentials...",
    "Loading Workspace...",
    "Establishing Secure Connection..."
];

export default function LoadingScreen() {
    const [progress, setProgress] = useState(0);
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        // 1. Simulate Progress Bar
        const timer = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress >= 100) {
                    clearInterval(timer);
                    return 100;
                }
                // Slower increment near the end to make it feel "real"
                const remaining = 100 - oldProgress;
                const diff = Math.random() * (remaining / 5);
                return Math.min(oldProgress + diff, 100);
            });
        }, 150); // Faster updates for smoother bar

        // 2. Cycle through messages
        const msgTimer = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
        }, 1200); // Slower message cycle to make them readable

        return () => {
            clearInterval(timer);
            clearInterval(msgTimer);
        };
    }, []);

    return (
        <div
            className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center relative overflow-hidden bg-noise"
            role="status"
            aria-label="Loading application"
        >

            {/* Background Glow (Subtle) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-white/5 blur-[100px] rounded-full pointer-events-none opacity-20" />

            {/* Central Spinner */}
            <div className="flex flex-col items-center gap-8 z-10">
                <div className="relative w-16 h-16 flex items-center justify-center">
                    {/* Outer Ring */}
                    <div className="absolute inset-0 border-t border-r border-white/20 rounded-full animate-spin duration-[1.5s]"></div>
                    {/* Inner Ring (Reverse) */}
                    <div className="absolute inset-2 border-t border-l border-white/40 rounded-full animate-spin direction-reverse duration-1000"></div>
                    {/* Logo Text */}
                    <span className="font-bold text-white text-sm tracking-widest animate-pulse">OM</span>
                </div>

                <div className="flex flex-col items-center gap-2 h-6">
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={messageIndex}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.3 }}
                            className="text-zinc-500 text-xs font-mono uppercase tracking-widest"
                        >
                            {LOADING_MESSAGES[messageIndex]}
                        </motion.p>
                    </AnimatePresence>
                </div>
            </div>

            {/* Bottom Progress Bar */}
            <div className="absolute bottom-20 w-64 h-0.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-white/30 shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "linear", duration: 0.2 }}
                />
            </div>
        </div>
    );
}