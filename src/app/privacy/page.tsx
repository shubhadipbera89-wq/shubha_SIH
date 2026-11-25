'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Shield, Lock, FileText, CheckCircle2 } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-8">
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 rounded-3xl p-8 lg:p-10 text-white shadow-xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900 text-amber-300 text-xs font-semibold border border-emerald-700">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>Official Government Portal Data Governance</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Privacy Policy</h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
            JanSamadhan Jharkhand is committed to protecting citizen privacy and ensuring transparent handling of civic data across all 24 districts.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-600" />
              1. Information We Collect
            </h2>
            <p>
              When registering on JanSamadhan Jharkhand, we collect basic details including your name, email address, mobile number, district, and user category (e.g. Citizen, Student, Researcher, University Faculty, Industry Professional, NGO, Government Representative).
            </p>
            <p>
              When reporting civic challenges or submitting solutions, submitted descriptions, multimedia images, and geographic markers are recorded to enable research coordination and government departmental action.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              2. How Your Information Is Used
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To route community challenges to the concerned district officers, university researchers, and industry partners.</li>
              <li>To prevent duplicate civic grievances using AI Sentence-Transformers and natural language deduplication.</li>
              <li>To calculate and award community Impact Scores and public service badges.</li>
              <li>To notify you about updates, solution milestones, and collaboration requests.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              3. Data Security & Open Governance
            </h2>
            <p>
              Passwords are salted and cryptographically hashed using bcrypt. Access tokens are secured with JSON Web Tokens (JWT). We do not sell or monetize personal user data. Civic challenge statistics are published under open governance guidelines to foster research and development.
            </p>
          </section>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">Last updated: 2026 · JanSamadhan Jharkhand</span>
            <Link href="/" className="text-xs font-bold text-emerald-700 hover:underline">
              Return to Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
