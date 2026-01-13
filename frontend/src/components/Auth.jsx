import React, { useState } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
// 1. Updated Import: Added 'Link'
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// --- ICONS ---
const Icons = {
    Google: () => <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>,
    Github: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>,
    Eye: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    EyeOff: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>,
    Check: () => <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>,
    ArrowLeft: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>,
    Caps: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75L12 3m0 0l3.75 3.75M12 3v18" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 21h12" /></svg>
};

// --- ANIMATION VARIANTS ---
const variants = {
    enter: (direction) => ({
        x: direction > 0 ? 50 : -50,
        opacity: 0,
        scale: 0.95
    }),
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1,
        scale: 1
    },
    exit: (direction) => ({
        zIndex: 0,
        x: direction < 0 ? 50 : -50,
        opacity: 0,
        scale: 0.95
    })
};

export default function Auth() {
    const [view, setView] = useState('login');
    const [direction, setDirection] = useState(0);

    const switchView = (newView) => {
        if (view === 'login' && newView === 'register') setDirection(1);
        else if (view === 'register' && newView === 'login') setDirection(-1);
        else if (newView === 'forgot') setDirection(1);
        else setDirection(-1);
        setView(newView);
    };

    return (
        <div className="min-h-screen bg-[#09090b] text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-white/20 relative">

            {/* Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-grid-pattern opacity-30" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-100 bg-white/5 blur-[120px] rounded-full opacity-50" />
            </div>

            {/* 2. New: Back to Home Button */}
            <Link
                to="/"
                className="absolute top-6 left-6 sm:top-8 sm:left-8 z-50 flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group"
            >
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/20 transition-all">
                    <Icons.ArrowLeft />
                </div>
                <span className="text-sm font-medium"> Home </span>
            </Link>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-8"
                >
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-linear-to-tr from-white/10 to-transparent border border-white/10 mb-6 shadow-2xl">
                        <span className="font-bold text-lg tracking-tight">OM</span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">OpsMind AI</h1>
                    <p className="text-zinc-500 text-sm mt-2">Enterprise intelligence platform.</p>
                </motion.div>

                {/* Card Container */}
                <div className="relative w-full">
                    <div className="min-h-105">
                        <AnimatePresence initial={false} mode="wait" custom={direction}>
                            {view === 'login' && (
                                <LoginForm key="login" custom={direction} onSwitch={switchView} />
                            )}
                            {view === 'register' && (
                                <RegisterForm key="register" custom={direction} onSwitch={switchView} />
                            )}
                            {view === 'forgot' && (
                                <ForgotForm key="forgot" custom={direction} onSwitch={switchView} />
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 text-center"
                >
                    <p className="text-zinc-600 text-xs">
                        &copy; {new Date().getFullYear()} OpsMind AI Inc.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}

// --- LOGIN FORM ---
function LoginForm({ onSwitch, custom }) {
    const { login } = useAuth();
    const navigate = useNavigate();
    const shakeControls = useAnimation();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await login(formData.email, formData.password);
            if (!res.success) {
                throw new Error(res.error || 'Invalid credentials');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.message);
            shakeControls.start({ x: [0, -5, 5, -5, 5, 0], transition: { duration: 0.4 } });
        }
        finally { setLoading(false); }
    };

    return (
        <motion.div
            custom={custom}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full"
        >
            <motion.div animate={shakeControls} className="glass-panel rounded-2xl p-8 border border-white/5 shadow-2xl bg-[#0c0c0e]">
                <h2 className="text-lg font-medium mb-1">Welcome back</h2>
                <p className="text-zinc-500 text-sm mb-6">Please enter your details to sign in.</p>

                {error && <ErrorMessage message={error} />}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputGroup
                        label="Email"
                        type="email"
                        placeholder="name@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />

                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-medium text-zinc-400">Password</label>
                            <button type="button" onClick={() => onSwitch('forgot')} className="text-xs text-white hover:underline hover:text-zinc-200 transition-colors">Forgot?</button>
                        </div>
                        <PasswordInput
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <Button loading={loading}>Sign In</Button>
                </form>

                <SocialDivider />

                <div className="mt-6 pt-6 border-t border-white/5 text-center">
                    <span className="text-zinc-500 text-sm">Don't have an account? </span>
                    <button onClick={() => onSwitch('register')} className="text-white text-sm font-medium hover:underline">
                        Sign up
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}

// --- REGISTER FORM ---
function RegisterForm({ onSwitch, custom }) {
    const { register } = useAuth();
    const navigate = useNavigate();
    const shakeControls = useAnimation();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });

    // Password Strength
    const getStrength = (pass) => {
        let s = 0;
        if (pass.length >= 6) s++;
        if (/[0-9]/.test(pass)) s++;
        if (/[^A-Za-z0-9]/.test(pass)) s++;
        return s;
    };
    const strength = getStrength(formData.password);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await register(formData.username, formData.email, formData.password);
            if (!res.success) throw new Error(res.error);
            else navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Registration failed');
            shakeControls.start({ x: [0, -5, 5, -5, 5, 0], transition: { duration: 0.4 } });
        }
        finally { setLoading(false); }
    };

    return (
        <motion.div
            custom={custom}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full"
        >
            <motion.div animate={shakeControls} className="glass-panel rounded-2xl p-8 border border-white/5 shadow-2xl bg-[#0c0c0e]">
                <h2 className="text-lg font-medium mb-1">Create account</h2>
                <p className="text-zinc-500 text-sm mb-6">Get started with your free account.</p>

                {error && <ErrorMessage message={error} />}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputGroup
                        label="Username"
                        placeholder="john_doe"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    />
                    <InputGroup
                        label="Email"
                        type="email"
                        placeholder="name@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <div>
                        <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Password</label>
                        <PasswordInput
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                        <div className="flex gap-1 mt-2 h-1 overflow-hidden rounded-full bg-white/5">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(strength / 3) * 100}%` }}
                                className={`h-full ${strength === 3 ? 'bg-emerald-500' : strength === 2 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            />
                        </div>
                    </div>

                    <Button loading={loading}>Create Account</Button>
                </form>

                <SocialDivider />

                <div className="mt-6 pt-6 border-t border-white/5 text-center">
                    <span className="text-zinc-500 text-sm">Already have an account? </span>
                    <button onClick={() => onSwitch('login')} className="text-white text-sm font-medium hover:underline">
                        Sign in
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}

// --- FORGOT PASSWORD FORM ---
function ForgotForm({ onSwitch, custom }) {
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => { setLoading(false); setSent(true); }, 1500);
    };

    return (
        <motion.div
            custom={custom}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full"
        >
            <div className="glass-panel rounded-2xl p-8 border border-white/5 shadow-2xl bg-[#0c0c0e]">
                <button onClick={() => onSwitch('login')} className="mb-6 text-xs text-zinc-500 hover:text-white flex items-center gap-1 transition-colors group">
                    <Icons.ArrowLeft /> Back to login
                </button>

                <h2 className="text-lg font-medium mb-1">Reset Password</h2>
                <p className="text-zinc-500 text-sm mb-6">We'll send you a secure link to reset it.</p>

                {sent ? (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-lg text-sm flex items-center gap-3">
                        <div className="bg-emerald-500/20 p-1 rounded-full"><Icons.Check /></div>
                        Check your email for the reset link.
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <InputGroup label="Email Address" type="email" placeholder="name@company.com" />
                        <Button loading={loading}>Send Reset Link</Button>
                    </form>
                )}
            </div>
        </motion.div>
    );
}

// --- REUSABLE UI COMPONENTS ---

function InputGroup({ label, type = "text", value, onChange, placeholder }) {
    return (
        <div className="space-y-1.5 group">
            <label className="block text-xs font-medium text-zinc-400 group-focus-within:text-white transition-colors">{label}</label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full h-10 px-3 bg-[#18181b] border border-white/10 rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 transition-all focus:bg-[#202023]"
                required
            />
        </div>
    );
}

function PasswordInput({ value, onChange }) {
    const [show, setShow] = useState(false);
    const [capsLock, setCapsLock] = useState(false);

    const handleKeyDown = (e) => {
        if (e.getModifierState('CapsLock')) setCapsLock(true);
        else setCapsLock(false);
    };

    return (
        <div className="relative group">
            <input
                type={show ? "text" : "password"}
                value={value}
                onChange={onChange}
                onKeyDown={handleKeyDown}
                onKeyUp={handleKeyDown}
                placeholder="••••••••"
                className="w-full h-10 px-3 bg-[#18181b] border border-white/10 rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 transition-all pr-10 focus:bg-[#202023]"
                required
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {capsLock && (
                    <div className="text-amber-500" title="Caps Lock is ON"><Icons.Caps /></div>
                )}
                <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                    {show ? <Icons.EyeOff /> : <Icons.Eye />}
                </button>
            </div>
        </div>
    )
}

function Button({ children, loading }) {
    return (
        <button
            type="submit"
            disabled={loading}
            className="w-full h-10 bg-white hover:bg-zinc-200 text-black font-medium rounded-lg text-sm transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98] shadow-lg shadow-white/5"
        >
            {loading ? <Spinner /> : children}
        </button>
    );
}

function SocialDivider() {
    const [loadingGoogle, setLoadingGoogle] = useState(false);
    const [loadingGithub, setLoadingGithub] = useState(false);

    const handleSocial = (provider, setter) => {
        setter(true);
        setTimeout(() => setter(false), 2000); // Simulate API call
    };

    return (
        <div className="mt-6">
            <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#0c0c0e] px-2 text-zinc-500">Or continue with</span></div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                    type="button"
                    onClick={() => handleSocial('google', setLoadingGoogle)}
                    className="flex items-center justify-center h-10 bg-[#18181b] hover:bg-[#27272a] border border-white/5 rounded-lg text-zinc-400 hover:text-white transition-all active:scale-95"
                >
                    {loadingGoogle ? <Spinner size="small" color="white" /> : <Icons.Google />}
                </button>
                <button
                    type="button"
                    onClick={() => handleSocial('github', setLoadingGithub)}
                    className="flex items-center justify-center h-10 bg-[#18181b] hover:bg-[#27272a] border border-white/5 rounded-lg text-zinc-400 hover:text-white transition-all active:scale-95"
                >
                    {loadingGithub ? <Spinner size="small" color="white" /> : <Icons.Github />}
                </button>
            </div>
        </div>
    )
}

function ErrorMessage({ message }) {
    return (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-red-500" />
            {message}
        </motion.div>
    )
}

function Spinner({ size = 'normal', color = 'black' }) {
    const s = size === 'small' ? 'h-3 w-3' : 'h-4 w-4';
    const c = color === 'white' ? 'text-white' : 'text-black';
    return (
        <svg className={`animate-spin ${s} ${c}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    );
}