'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Shield, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-8">
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 rounded-3xl p-8 lg:p-10 text-white shadow-xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900 text-amber-300 text-xs font-semibold border border-emerald-700">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>Community Guidelines & Terms</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Terms of Service</h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
            Rules and guidelines governing your participation in the JanSamadhan crowdsourcing innovation ecosystem.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              1. Constructive Civic Engagement
            </h2>
            <p>
              JanSamadhan Jharkhand is intended for reporting genuine ground challenges in water, healthcare, education, agriculture, road safety, rural electrification, and environment across Jharkhand's 24 districts. Users must provide truthful information and relevant images.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              2. Intellectual Property & Research Solutions
            </h2>
            <p>
              Solutions submitted by university researchers, students, and industry partners are acknowledged with author attribution and impact score recognition. Collaborative projects are encouraged to follow open-source and ethical societal implementation principles.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              3. Content Moderation & AI Safeguards
            </h2>
            <p>
              JanSamadhan uses automated AI quality audits (OpenCV blur and spam detection) and administrative moderation. Malicious submissions, hate speech, spam images, or abusive content will result in immediate suspension of account privileges and deduction of impact scores.
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
