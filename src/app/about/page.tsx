'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Shield, Sparkles, MapPin, GraduationCap, Building2, Users, Target, ArrowRight } from 'lucide-react';
import { TAGLINE } from '@/lib/constants';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-12">
        {/* About Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 rounded-3xl p-8 lg:p-12 text-white shadow-xl space-y-4 text-center">
          <div className="w-16 h-16 rounded-3xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold mx-auto shadow-lg">
            <Shield className="w-9 h-9" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">About JanSamadhan Jharkhand</h1>
          <p className="text-sm sm:text-base text-emerald-100 italic max-w-3xl mx-auto leading-relaxed">
            "{TAGLINE}"
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Target className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Our Core Mission</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              JanSamadhan was conceived to bridge the gap between grassroots societal challenges across all 24 districts of Jharkhand and the immense technical capabilities of our state's universities, researchers, and industrial champions.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Multi-Stakeholder Ecosystem</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              By connecting citizens, student researchers, university faculty (BIT Mesra, IIT ISM, NIT Jamshedpur), NGOs, and industrial leaders (Tata Steel, SAIL, HEC), we accelerate real-world ground implementation.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-emerald-900 text-white rounded-3xl p-8 text-center space-y-4">
          <h2 className="text-2xl font-bold">Be a Part of Jharkhand's Transformation</h2>
          <p className="text-xs text-emerald-100 max-w-xl mx-auto">
            Whether you are a citizen reporting a village problem or a researcher submitting a technical model, your contribution counts.
          </p>
          <Link
            href="/register"
            className="inline-block bg-amber-400 text-slate-950 font-bold text-xs px-6 py-3 rounded-xl shadow"
          >
            Get Started Now
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
