import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext';
import { UserRole } from '../types';
import {
  X,
  Lock,
  Mail,
  User,
  Phone,
  Briefcase,
  Shield,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Layers,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setAuthModalOpen,
    authMode,
    setAuthMode,
    login,
    register,
    users,
    setRole,
  } = useMarket();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setSelectedRole] = useState<UserRole>('customer');
  const [title, setTitle] = useState('');
  const [skills, setSkills] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const res = login(email, password);
    if (!res.success) {
      setErrorMsg(res.message || 'Invalid email or password');
    } else {
      setSuccessMsg('Successfully logged in! Redirecting...');
      setTimeout(() => {
        setAuthModalOpen(false);
      }, 700);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMsg('Please fill in all required fields');
      return;
    }

    const skillsArray = skills ? skills.split(',').map(s => s.trim()).filter(Boolean) : [];

    const res = register({
      name,
      email,
      password,
      phone,
      role,
      title: title || (role === 'customer' ? 'Buyer / Client' : 'Independent Specialist'),
      skills: skillsArray,
    });

    if (!res.success) {
      setErrorMsg(res.message || 'Registration failed');
    } else {
      setSuccessMsg('Account created successfully! Welcome to ReverseMarket.');
      setTimeout(() => {
        setAuthModalOpen(false);
      }, 800);
    }
  };

  const handleQuickLogin = (userEmail: string, userPass: string) => {
    setErrorMsg('');
    login(userEmail, userPass);
    setSuccessMsg('Logged in!');
    setTimeout(() => {
      setAuthModalOpen(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                {authMode === 'login' ? 'Sign In to ReverseMarket' : 'Create New Account'}
              </h3>
              <p className="text-xs text-slate-400">
                {authMode === 'login' ? 'Access your dashboard & active bids' : 'Join as Buyer or Provider'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setAuthModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Sign In vs Sign Up */}
        <div className="flex border-b border-slate-800 bg-slate-800/40 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setAuthMode('login');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-3 text-center transition ${
              authMode === 'login'
                ? 'bg-slate-800 text-white border-b-2 border-indigo-500 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('register');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-3 text-center transition ${
              authMode === 'register'
                ? 'bg-slate-800 text-white border-b-2 border-indigo-500 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Create Account (Sign Up)
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {authMode === 'login' ? (
            /* LOGIN FORM */
            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-slate-300 font-medium">Password</label>
                  <span className="text-[10px] text-indigo-400 cursor-pointer">Default: password123</span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition shadow-lg shadow-indigo-600/20"
              >
                Sign In to Account
              </button>

              {/* Quick One-Click Logins for easy evaluation */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 text-center">
                  Instant Test Login Persona (1-Click)
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('ramesh.sundaram@gmail.com', 'password123')}
                    className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-left text-[11px] transition"
                  >
                    <span className="font-bold text-white block">Ramesh (Customer)</span>
                    <span className="text-[10px] text-slate-400 block truncate">ramesh.sundaram@gmail.com</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('priya@webstudio.dev', 'password123')}
                    className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-left text-[11px] transition"
                  >
                    <span className="font-bold text-emerald-400 block">Priya (Top Provider)</span>
                    <span className="text-[10px] text-slate-400 block truncate">priya@webstudio.dev</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('build@devstudiopro.com', 'password123')}
                    className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-left text-[11px] transition"
                  >
                    <span className="font-bold text-blue-400 block">DevStudio (Provider)</span>
                    <span className="text-[10px] text-slate-400 block truncate">build@devstudiopro.com</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('admin@reversemarket.io', 'password123')}
                    className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-left text-[11px] transition"
                  >
                    <span className="font-bold text-purple-400 block">Platform Overseer (Admin)</span>
                    <span className="text-[10px] text-slate-400 block truncate">admin@reversemarket.io</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={handleRegister} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Select Your Role</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('customer')}
                    className={`py-2 px-2.5 rounded-xl border text-center font-semibold transition ${
                      role === 'customer'
                        ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    Buyer / Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('provider')}
                    className={`py-2 px-2.5 rounded-xl border text-center font-semibold transition ${
                      role === 'provider'
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    Provider / Specialist
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('admin')}
                    className={`py-2 px-2.5 rounded-xl border text-center font-semibold transition ${
                      role === 'admin'
                        ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    Admin
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g., Rajesh Kumar"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-medium">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="rajesh@domain.com"
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-medium">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Min 6 chars"
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Phone / WhatsApp (Optional)</label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+91 98401 12345"
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {role === 'provider' && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-medium">Professional Title / Agency</label>
                    <input
                      type="text"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      placeholder="e.g., Fullstack Web & Cloud Studio"
                      className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-medium">Key Skills (comma separated)</label>
                    <input
                      type="text"
                      value={skills}
                      onChange={e => setSkills(e.target.value)}
                      placeholder="React, Node.js, Tailwind, Mobile App"
                      className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition shadow-lg shadow-indigo-600/20"
              >
                Register & Enter Portal
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
