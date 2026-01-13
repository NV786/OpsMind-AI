import React, { useState } from 'react'; // Changed import from useMemo to useState
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// --- ICONS ---
const Icons = {
    Warning: () => (
        <svg
            className="w-8 h-8 text-amber-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
        </svg>
    ),
    ArrowLeft: () => (
        <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
        </svg>
    ),
    Home: () => (
        <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
        </svg>
    ),
};

export default function NotFound() {
    const navigate = useNavigate();

    // FIX: Use useState instead of useMemo for random values.
    // The function passed to useState only runs once on mount (lazy initialization).
    const [errorRef] = useState(() =>
        Math.random().toString(36).substring(2, 10).toUpperCase()
    );

    return (
        <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center p-6 font-sans selection:bg-white/20 relative overflow-hidden bg-noise">

            {/* Background Ambience */}
            <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
            {/* Tailwind suggested: w-[600px] -> w-150. We keep w-[600px] for precise control, or you can change to w-150 */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-white/5 blur-[120px] rounded-full pointer-events-none opacity-30" />

            <div className="text-center max-w-md relative z-10">

                {/* Animated Icon */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, type: 'spring' }}
                    className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-[#18181b] border border-white/10 mb-8 shadow-2xl relative group"
                >
                    <div className="absolute inset-0 bg-amber-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                            repeat: Infinity,
                            duration: 4,
                            ease: 'easeInOut',
                        }}
                    >
                        <Icons.Warning />
                    </motion.div>
                </motion.div>

                {/* Main Text */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <h1 className="text-5xl font-bold tracking-tight mb-3 text-white">
                        404
                    </h1>
                    <h2 className="text-lg font-medium text-zinc-300 mb-2">
                        Page not found
                    </h2>
                    <p className="text-zinc-500 mb-8 text-sm leading-relaxed">
                        The page you are looking for might have been removed, had its name
                        changed, or is temporarily unavailable.
                    </p>
                </motion.div>

                {/* Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-3"
                >
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full sm:w-auto h-10 px-6 bg-[#18181b] hover:bg-[#27272a] border border-white/10 text-zinc-300 hover:text-white text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
                    >
                        <span className="group-hover:-translate-x-0.5 transition-transform">
                            <Icons.ArrowLeft />
                        </span>
                        Go Back
                    </button>
                    <Link
                        to="/"
                        className="w-full sm:w-auto h-10 px-6 bg-white hover:bg-zinc-200 text-black text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-white/5"
                    >
                        <Icons.Home />
                        Return Home
                    </Link>
                </motion.div>

                {/* Footer Ref */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-12 pt-8 border-t border-white/5"
                >
                    <p className="text-[10px] text-zinc-600 font-mono">
                        Error Reference:{' '}
                        <span className="text-zinc-500 select-all cursor-text">
                            ERR_{errorRef}
                        </span>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}