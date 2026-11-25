'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import {
  Shield,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Sparkles,
  Users,
  Building2,
  GraduationCap,
  Award,
  KeyRound,
  ChevronRight,
} from 'lucide-react';
import { TAGLINE } from '@/lib/constants';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeDemo, setActiveDemo] = useState<string | null>(null);

  const demoAccounts = [
    {
      role: 'Admin',
      name: 'Dr. Rameshwar Oraon',
      email: 'admin@jansamadhan.gov.in',
      type: 'Government Rep',
      badge: 'bg-rose-100 text-rose-800 border-rose-300',
    },
    {
      role: 'Faculty',
      name: 'Prof. Alok Kumar',
      email: 'alok.ism@iitism.ac.in',
      type: 'IIT (ISM) Dhanbad',
      badge: 'bg-purple-100 text-purple-800 border-purple-300',
    },
    {
      role: 'Citizen',
      name: 'Birsa Munda',
      email: 'birsa.m@gmail.com',
      type: 'Gumla Farmer',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    {
      role: 'Student',
      name: 'Priya Sharma',
      email: 'priya.bit@gmail.com',
      type: 'BIT Mesra Ranchi',
      badge: 'bg-blue-100 text-blue-800 border-blue-300',
    },
    {
      role: 'Industry',
      name: 'Rajesh Singhania',
      email: 'rajesh@tatasteel.com',
      type: 'Tata Steel Jamshedpur',
      badge: 'bg-amber-100 text-amber-800 border-amber-300',
    },
  ];

  const handleQuickFill = (acc: (typeof demoAccounts)[0]) => {
    setEmail(acc.email);
    setPassword('Password123');
    setActiveDemo(acc.role);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed. Please check your credentials.');
      }

      login(data.user, data.token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl w-full bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left Column: Jharkhand Identity & Stats Hero */}
          <div className="lg:col-span-5 bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900 p-8 lg:p-10 text-white flex flex-col justify-between relative overflow-hidden">
            {/* Subtle Tribal Pattern Overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none jharkhand-tribal-pattern"></div>

            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg shadow-amber-400/20">
                  <Shield className="w-7 h-7" />
                </div>
                <div>
                  <span className="font-extrabold text-xl tracking-tight text-white">
                    Jan<span className="text-amber-400">Samadhan</span>
                  </span>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                    Jharkhand Civic Network
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-black leading-tight text-white">
                  Empowering Citizens & Innovators Across <span className="text-amber-400">24 Districts</span>
                </h2>
                <p className="text-xs text-emerald-100/90 mt-2 leading-relaxed italic">
                  "{TAGLINE}"
                </p>
              </div>

              {/* Impact Highlights */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0">
                    24
                  </div>
                  <div className="text-xs">
                    <div className="font-bold text-white">Districts Connected</div>
                    <div className="text-[10px] text-emerald-200">Ranchi, Dhanbad, Jamshedpur & beyond</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold shrink-0">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <div className="font-bold text-white">University R&D Network</div>
                    <div className="text-[10px] text-emerald-200">BIT Mesra, IIT ISM, NIT Jamshedpur</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Quote */}
            <div className="relative z-10 pt-8 border-t border-emerald-800/80 text-[11px] text-emerald-200/80 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Government of Jharkhand · Department of Higher Education & Innovation</span>
            </div>
          </div>

          {/* Right Column: Sign In Form */}
          <div className="lg:col-span-7 p-6 sm:p-10 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Form Title & Switcher */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">
                    Welcome Back
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Sign in to manage your reported challenges and solutions.
                  </p>
                </div>
                <Link
                  href="/register"
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 transition-colors"
                >
                  Create Account
                </Link>
              </div>

              {/* 1-Click Interactive Demo Login Accounts Bar */}
              <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4 text-amber-700" />
                    Quick 1-Click Demo Accounts (Select to test role):
                  </span>
                  <span className="text-[10px] text-amber-800 font-medium">Password: Password123</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {demoAccounts.map((acc) => {
                    const isSelected = activeDemo === acc.role;
                    return (
                      <button
                        key={acc.role}
                        type="button"
                        onClick={() => handleQuickFill(acc)}
                        className={`text-xs px-2.5 py-1.5 rounded-xl font-bold border transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-sm scale-105'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-amber-400 hover:bg-amber-100/50'
                        }`}
                      >
                        <span>{acc.role}</span>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${acc.badge}`}>
                          {acc.type}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3.5 rounded-2xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setActiveDemo(null);
                      }}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-[11px] font-bold text-emerald-700 hover:underline"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600 font-medium">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Keep me logged in for 7 days</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-800 to-teal-800 hover:from-emerald-900 hover:to-teal-900 text-white font-extrabold text-xs py-3 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? 'Authenticating...' : 'Sign In to JanSamadhan'}
                  {!loading && <ArrowRight className="w-4 h-4 text-amber-300" />}
                </button>

                {/* Quick Persona Demo Logins */}
                <div className="pt-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
                    Quick Demo Credentials (Click to Autofill)
                  </div>
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        setEmail('admin@jansamadhan.gov.in');
                        setPassword('Password123');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 text-[11px] font-bold hover:bg-rose-100 transition-colors"
                    >
                      Admin
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEmail('birsa.m@gmail.com');
                        setPassword('Password123');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold hover:bg-emerald-100 transition-colors"
                    >
                      Citizen
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEmail('priya.bit@gmail.com');
                        setPassword('Password123');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 text-[11px] font-bold hover:bg-blue-100 transition-colors"
                    >
                      Student
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEmail('alok.ism@iitism.ac.in');
                        setPassword('Password123');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-800 border border-purple-200 text-[11px] font-bold hover:bg-purple-100 transition-colors"
                    >
                      Faculty
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEmail('rajiv.tata@tatasteel.com');
                        setPassword('Password123');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-bold hover:bg-amber-100 transition-colors"
                    >
                      Industry
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Bottom Footer Link */}
            <div className="text-center text-xs text-slate-500 pt-4 border-t border-slate-100">
              New to JanSamadhan?{' '}
              <Link href="/register" className="font-extrabold text-emerald-700 hover:underline">
                Create a Free Account
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
