import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// --- ICONS ---
const Icons = {
    Zap: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>,
    Shield: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" /></svg>,
    Chart: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>,
    ArrowRight: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>,
    Check: () => <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>,
    Plus: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>,
    Minus: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" /></svg>,
    Code: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>,
    Eye: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    Upload: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
};

export default function LandingPage() {
    const [viewMode, setViewMode] = useState('ui'); // 'ui' | 'code'
    const [billing, setBilling] = useState('monthly'); // 'monthly' | 'yearly'

    return (
        <div className="min-h-screen bg-[#09090b] text-white font-sans selection:bg-emerald-500/30 overflow-x-hidden">

            {/* Background Ambience */}
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-200 h-100 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none opacity-50" />

            {/* --- NAVBAR --- */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#09090b]/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold text-sm shadow-[0_0_15px_rgba(16,185,129,0.3)]">OM</div>
                        <span className="font-semibold tracking-tight text-lg group-hover:text-zinc-200 transition-colors">OpsMind</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
                        <a href="#features" className="hover:text-white transition-colors">How it works</a>
                        <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
                        <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link to="/auth" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors hidden sm:block">Log In</Link>
                        <Link to="/auth" className="h-9 px-4 bg-white hover:bg-zinc-200 text-black text-sm font-medium rounded-full transition-all flex items-center">Get Started</Link>
                    </div>
                </div>
            </nav>

            {/* --- HERO SECTION --- */}
            <main className="relative pt-32 pb-20 px-6">
                <div className="max-w-5xl mx-auto text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-zinc-300 mb-6">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            Now supporting 50MB+ Files
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
                            Turn any PDF into <br className="hidden md:block" />
                            <span className="bg-clip-text text-transparent bg-linear-to-r from-emerald-400 to-cyan-400">a Conversation.</span>
                        </h1>
                        <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                            Upload contracts, research papers, or textbooks. OpsMind AI instantly understands your document and answers questions with precise citations.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/auth" className="h-12 px-8 bg-white hover:bg-zinc-200 text-black font-semibold rounded-full transition-all flex items-center gap-2 group">
                                <Icons.Upload /> Upload PDF
                            </Link>
                            <button className="h-12 px-8 bg-[#18181b] hover:bg-[#27272a] border border-white/10 text-white font-medium rounded-full transition-all">
                                View Demo
                            </button>
                        </div>
                    </motion.div>

                    {/* INTERACTIVE HERO PREVIEW */}
                    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="mt-20">
                        {/* Toggle Switch */}
                        <div className="flex justify-center mb-4">
                            <div className="bg-[#18181b] border border-white/10 p-1 rounded-full flex gap-1">
                                <button onClick={() => setViewMode('ui')} className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-2 ${viewMode === 'ui' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'}`}>
                                    <Icons.Eye /> Preview
                                </button>
                                <button onClick={() => setViewMode('code')} className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-2 ${viewMode === 'code' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'}`}>
                                    <Icons.Code /> Code
                                </button>
                            </div>
                        </div>

                        {/* Window Content */}
                        <div className="rounded-xl border border-white/10 bg-[#0c0c0e] shadow-2xl overflow-hidden aspect-video relative max-w-4xl mx-auto">
                            {/* Window Controls */}
                            <div className="h-10 border-b border-white/5 bg-[#18181b] flex items-center px-4 gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                            </div>

                            {/* Animated Content Switcher */}
                            <div className="h-[calc(100%-40px)]">
                                <AnimatePresence mode="wait">
                                    {viewMode === 'ui' ? (
                                        <RagPreview key="ui" />
                                    ) : (
                                        <RagCode key="code" />
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* --- LOGO MARQUEE --- */}
            <div className="border-y border-white/5 bg-[#0c0c0e] py-8 overflow-hidden relative">
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-[#0c0c0e] to-transparent z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-[#0c0c0e] to-transparent z-10" />
                <motion.div
                    className="flex gap-16 min-w-max items-center"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                >
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="flex gap-16 items-center opacity-30 grayscale">
                            <span className="text-xl font-bold tracking-widest">MIT</span>
                            <span className="text-xl font-bold tracking-widest">Stanford</span>
                            <span className="text-xl font-bold tracking-widest">OpenAI</span>
                            <span className="text-xl font-bold tracking-widest">NASA</span>
                            <span className="text-xl font-bold tracking-widest">Tesla</span>
                            <span className="text-xl font-bold tracking-widest">Amazon</span>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* --- FEATURES GRID --- */}
            <section id="features" className="py-24 px-6 bg-[#09090b]">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-semibold mb-4">Chat with precision</h2>
                        <p className="text-zinc-400">Advanced RAG technology optimized for complex documents.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FeatureCard icon={<Icons.Zap />} title="Smart Parsing" desc="We don't just read text. We understand tables, charts, and multi-column layouts." />
                        <FeatureCard icon={<Icons.Shield />} title="Instant Citations" desc="Don't trust blindly. Click any answer to jump to the exact paragraph in your PDF." />
                        <FeatureCard icon={<Icons.Chart />} title="Deep Understanding" desc="Our hybrid search combines keywords and semantics to find needles in haystacks." />
                    </div>
                </div>
            </section>

            {/* --- PRICING SECTION --- */}
            <section id="pricing" className="py-24 px-6 border-t border-white/5">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-semibold mb-4">Start for free</h2>
                        <div className="flex items-center justify-center gap-4">
                            <span className={`text-sm ${billing === 'monthly' ? 'text-white' : 'text-zinc-500'}`}>Monthly</span>
                            <button
                                onClick={() => setBilling(billing === 'monthly' ? 'yearly' : 'monthly')}
                                className="w-12 h-6 bg-[#18181b] border border-white/10 rounded-full relative px-1 transition-colors"
                            >
                                <motion.div
                                    layout
                                    className="w-4 h-4 bg-white rounded-full"
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    style={{ float: billing === 'monthly' ? 'left' : 'right' }}
                                />
                            </button>
                            <span className={`text-sm ${billing === 'yearly' ? 'text-white' : 'text-zinc-500'}`}>Yearly <span className="text-emerald-400 text-xs ml-1">Save 20%</span></span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <PricingCard title="Student" price={billing === 'monthly' ? "$0" : "$0"} features={["3 PDFs / day", "5MB File Limit", "Basic Chat"]} />
                        <PricingCard title="Pro" price={billing === 'monthly' ? "$19" : "$15"} features={["Unlimited PDFs", "OCR Support", "Export to Notion"]} popular />
                        <PricingCard title="Team" price="Custom" features={["Shared Workspace", "API Access", "SSO & Security"]} />
                    </div>
                </div>
            </section>

            {/* --- FAQ SECTION --- */}
            <section id="faq" className="py-24 px-6 border-t border-white/5 bg-[#0c0c0e]">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-semibold mb-12 text-center">Frequently asked questions</h2>
                    <div className="space-y-4">
                        <FAQItem question="What happens to my files?" answer="Your files are stored securely in encrypted buckets. You can delete them at any time, or set them to auto-delete after 24 hours." />
                        <FAQItem question="Does it work with scanned PDFs?" answer="Yes! Our Pro plan includes OCR (Optical Character Recognition) to extract text from scanned images." />
                        <FAQItem question="Is there a page limit?" answer="The Free plan supports up to 50 pages per PDF. Pro plans support up to 2,000 pages." />
                    </div>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="border-t border-white/5 py-12 px-6 bg-[#09090b]">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-emerald-500/20 flex items-center justify-center text-[10px] font-bold text-emerald-500">OM</div>
                        <span className="text-sm font-medium text-zinc-300">OpsMind AI</span>
                    </div>
                    <div className="flex gap-6 text-sm text-zinc-500">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Twitter</a>
                        <a href="#" className="hover:text-white transition-colors">GitHub</a>
                    </div>
                    <p className="text-xs text-zinc-600">© 2026 OpsMind AI Inc.</p>
                </div>
            </footer>
        </div>
    );
}

// --- HELPER COMPONENTS ---

// 1. RAG PREVIEW (The "Brain" Visualization)
function RagPreview() {
    const [step, setStep] = useState(0); // 0: Idle, 1: Searching, 2: Found, 3: Answering

    useEffect(() => {
        const loop = async () => {
            setStep(0);
            await new Promise(r => setTimeout(r, 1000));
            setStep(1); // User asks / Searching
            await new Promise(r => setTimeout(r, 1500)); // Search duration
            setStep(2); // Context Found
            await new Promise(r => setTimeout(r, 1000)); // Pause on found
            setStep(3); // AI Answers
            await new Promise(r => setTimeout(r, 4000)); // Read answer
        };
        loop();
        const interval = setInterval(loop, 8000);
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            key="ui"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative w-full h-full bg-[#0c0c0e] flex flex-col md:flex-row p-6 gap-6"
        >
            {/* LEFT: The Knowledge Base (Vector Store) */}
            <div className="flex-1 border border-white/10 bg-white/5 rounded-xl p-4 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute top-2 left-4 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">PDF Content</div>

                {/* Grid of "Data Chunks" */}
                <div className="grid grid-cols-5 gap-3 relative z-10">
                    {[...Array(20)].map((_, i) => {
                        const isRelevant = [7, 12, 13].includes(i);
                        const isActive = step >= 2 && isRelevant;

                        return (
                            <motion.div
                                key={i}
                                className={`w-3 h-3 rounded-sm transition-all duration-500 ${isActive ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)] scale-125' : 'bg-zinc-800'}`}
                                animate={step === 1 ? { opacity: [0.3, 1, 0.3] } : {}}
                                transition={{ duration: 1, repeat: step === 1 ? Infinity : 0, delay: i * 0.05 }}
                            />
                        );
                    })}
                </div>

                {/* Search Beam Animation */}
                {step === 1 && (
                    <motion.div
                        layoutId="search-beam"
                        className="absolute inset-0 bg-linear-to-r from-transparent via-emerald-500/10 to-transparent w-full h-full"
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                )}
            </div>

            {/* RIGHT: The Chat Interface */}
            <div className="flex-1 flex flex-col gap-4 justify-center">
                {/* User Query */}
                <AnimatePresence>
                    {step >= 1 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="self-end bg-zinc-800 text-white text-xs px-3 py-2 rounded-lg rounded-tr-none max-w-[90%]"
                        >
                            What is the total budget mentioned?
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Processing Indicator */}
                <AnimatePresence>
                    {step === 1 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex gap-1 self-start ml-1"
                        >
                            <span className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* AI Response with Citations */}
                <AnimatePresence>
                    {step >= 3 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="self-start text-xs text-zinc-300 max-w-[95%]"
                        >
                            <div className="bg-white/5 border border-white/5 p-3 rounded-lg rounded-tl-none mb-2">
                                <p className="leading-relaxed mb-2">
                                    The document outlines a total budget of <span className="text-emerald-400 font-bold">$1.2M</span> for Q4, allocated primarily for marketing and R&D.
                                </p>
                                {/* Citations */}
                                <div className="flex gap-2 mt-2">
                                    <span className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded text-[10px] border border-emerald-500/20">
                                        <Icons.Zap /> Page 14
                                    </span>
                                    <span className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded text-[10px] border border-emerald-500/20">
                                        <Icons.Chart /> Table 2.1
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

// 2. RAG CODE (Shows Upload -> Chat Workflow)
function RagCode() {
    return (
        <motion.div
            key="code"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-6 h-full overflow-hidden flex flex-col font-mono text-sm"
        >
            <div className="text-zinc-400 overflow-x-auto">
                {/* Step 1: Upload */}
                <div className="mb-6">
                    <p className="text-zinc-500 mb-1">// 1. Upload PDF</p>
                    <p><span className="text-purple-400">const</span> {'{ id }'} = <span className="text-purple-400">await</span> opsMind.<span className="text-blue-400">upload</span>({'{'}</p>
                    <p className="pl-4">file: <span className="text-green-400">"contract.pdf"</span>,</p>
                    <p className="pl-4">ocr: <span className="text-yellow-300">true</span></p>
                    <p>{'}'});</p>
                </div>

                {/* Step 2: Chat */}
                <div>
                    <p className="text-zinc-500 mb-1">// 2. Ask Questions</p>
                    <p><span className="text-purple-400">const</span> response = <span className="text-purple-400">await</span> opsMind.<span className="text-blue-400">chat</span>({'{'}</p>
                    <p className="pl-4">documentId: id,</p>
                    <p className="pl-4">message: <span className="text-green-400">"Summarize the liability clause"</span></p>
                    <p>{'}'});</p>
                </div>
            </div>

            {/* Output Simulation */}
            <div className="mt-auto border-t border-white/5 pt-3">
                <div className="flex justify-between items-center mb-2">
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500">AI Response</p>
                    <span className="text-[10px] text-emerald-500">Processing: 0.4s</span>
                </div>
                <div className="text-xs text-zinc-300 bg-black/30 p-2 rounded border border-white/5">
                    <p className="text-emerald-400">"The liability is limited to 2x the annual fees..."</p>
                    <p className="text-zinc-500 mt-1 italic">Source: Section 4.2 (Page 9)</p>
                </div>
            </div>
        </motion.div>
    );
}

// 3. UI HELPER CARDS
function FeatureCard({ icon, title, desc }) {
    return (
        <div className="bg-white/5 p-6 rounded-2xl hover:bg-[#18181b] transition-all group border border-white/5 hover:border-white/10">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 mb-4 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                {icon}
            </div>
            <h3 className="text-lg font-medium mb-2">{title}</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">{desc}</p>
        </div>
    );
}

function PricingCard({ title, price, features, popular }) {
    return (
        <div className={`p-8 rounded-2xl border flex flex-col ${popular ? 'border-emerald-500/30 bg-emerald-500/5 relative overflow-hidden' : 'border-white/5 bg-[#121214]'}`}>
            {popular && <div className="absolute top-0 right-0 bg-emerald-500 text-black text-[10px] font-bold px-2 py-1 rounded-bl-lg">POPULAR</div>}
            <h3 className="text-lg font-medium text-zinc-300 mb-2">{title}</h3>
            <div className="text-4xl font-bold text-white mb-6">{price}<span className="text-sm font-normal text-zinc-500">/mo</span></div>
            <ul className="space-y-3 mb-8 flex-1">
                {features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-zinc-400">
                        <Icons.Check /> {f}
                    </li>
                ))}
            </ul>
            <button className={`w-full h-10 rounded-lg text-sm font-medium transition-all ${popular ? 'bg-emerald-500 text-black hover:bg-emerald-400' : 'bg-[#27272a] text-white hover:bg-[#3f3f46]'}`}>
                Choose {title}
            </button>
        </div>
    )
}

function FAQItem({ question, answer }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border border-white/5 rounded-xl bg-[#121214] overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-[#18181b] transition-colors"
            >
                <span className="font-medium text-zinc-200">{question}</span>
                <span className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    {isOpen ? <Icons.Minus /> : <Icons.Plus />}
                </span>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 pt-0 text-sm text-zinc-400 leading-relaxed border-t border-white/5">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}