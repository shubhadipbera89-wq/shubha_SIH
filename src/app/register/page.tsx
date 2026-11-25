'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import {
  Shield,
  User as UserIcon,
  Mail,
  Phone,
  Lock,
  MapPin,
  Building,
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  Users,
  GraduationCap,
  Building2,
  Award,
  BookOpen,
  Briefcase,
  Landmark,
} from 'lucide-react';
import { JHARKHAND_DISTRICTS, USER_TYPES, TAGLINE } from '@/lib/constants';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    state: 'Jharkhand',
    district: 'Ranchi',
    userType: 'Citizen',
    institution: '',
    company: '',
    city: '',
    termsAccepted: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const roleIcons: Record<string, any> = {
    Citizen: Users,
    Student: GraduationCap,
    Researcher: BookOpen,
    'University Faculty': GraduationCap,
    'Industry Professional': Building2,
    NGO: Award,
    'Government Representative': Landmark,
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUserTypeSelect = (type: string) => {
    setFormData((prev) => ({ ...prev, userType: type }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!formData.termsAccepted) {
      setError('Please accept the Terms & Conditions to register.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed.');
      }

      login(data.user, data.token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  const isPasswordMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-10 space-y-8">
          {/* Header */}
          <div className="text-center space-y-2 border-b border-slate-100 pb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-700 to-teal-800 text-amber-300 flex items-center justify-center font-black mx-auto shadow-lg shadow-emerald-800/20">
              <Shield className="w-8 h-8" />
            </div>
            <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 text-[11px] font-extrabold px-3 py-1 rounded-full border border-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Sign Up Bonus: +10 Community Impact Points</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Join <span className="text-emerald-700">JanSamadhan</span> Jharkhand
            </h2>
            <p className="text-xs text-slate-500 italic max-w-xl mx-auto leading-relaxed">
              "{TAGLINE}"
            </p>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-4 rounded-2xl flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: User Type Selector Cards */}
            <div className="space-y-2">
              <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Select Your Role / Stakeholder Category *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                {USER_TYPES.map((type) => {
                  const Icon = roleIcons[type] || Users;
                  const isSelected = formData.userType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleUserTypeSelect(type)}
                      className={`p-2.5 rounded-2xl text-center border transition-all flex flex-col items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'bg-emerald-800 text-white border-amber-400 shadow-md scale-105 font-bold'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 font-medium'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-amber-300' : 'text-emerald-700'}`} />
                      <span className="text-[11px] leading-tight">{type}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@domain.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="+91 98350 00000"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* District Select */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Jharkhand District (24) *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {JHARKHAND_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Institution / Company */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Institution / Company / Organization
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    name="institution"
                    value={formData.institution}
                    onChange={handleChange}
                    placeholder="e.g. BIT Mesra / Tata Steel / Local Panchayat"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* City / Village */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  City / Village / Block
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Ranchi / Jamshedpur / Bishunpur"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
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

              {/* Confirm Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Confirm Password *
                  </label>
                  {isPasswordMatch && (
                    <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Match
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-10 py-2.5 bg-slate-50 border rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      formData.confirmPassword && !isPasswordMatch
                        ? 'border-rose-400 focus:ring-rose-500'
                        : 'border-slate-200'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="pt-2 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700 font-medium">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span>
                  I agree to the <span className="font-extrabold text-emerald-800">Terms & Conditions</span> and verify that I am participating in civic innovation and societal problem-solving for Jharkhand.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-800 to-teal-800 hover:from-emerald-900 hover:to-teal-900 text-white font-extrabold text-xs py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Registering Account...' : 'Create My JanSamadhan Account (+10 Pts)'}
              {!loading && <ArrowRight className="w-4 h-4 text-amber-300" />}
            </button>
          </form>

          <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
            Already registered on JanSamadhan?{' '}
            <Link href="/login" className="font-extrabold text-emerald-700 hover:underline">
              Sign In Here
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
