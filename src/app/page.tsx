'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { JharkhandMap } from '@/components/home/JharkhandMap';
import {
  Shield,
  PlusCircle,
  Search,
  Users,
  Building2,
  GraduationCap,
  Award,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Lightbulb,
  FileCheck,
  Target,
  Zap,
  ChevronRight,
  TrendingUp,
  MapPin,
} from 'lucide-react';
import { TAGLINE } from '@/lib/constants';

export default function LandingPage() {
  const [stats, setStats] = useState({
    totalChallenges: 6,
    resolvedChallenges: 2,
    totalUsers: 140,
    totalUniversities: 5,
    totalIndustries: 4,
    districtBreakdown: [],
  });

  const [featuredChallenges, setFeaturedChallenges] = useState<any[]>([]);
  const [latestSolutions, setLatestSolutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch stats
    fetch('/api/admin/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.stats) setStats(data.stats);
      })
      .catch(console.error);

    // Fetch challenges
    fetch('/api/challenges')
      .then((res) => res.json())
      .then((data) => {
        if (data.challenges) setFeaturedChallenges(data.challenges.slice(0, 3));
      })
      .catch(console.error);

    // Fetch solutions
    fetch('/api/solutions')
      .then((res) => res.json())
      .then((data) => {
        if (data.solutions) setLatestSolutions(data.solutions.slice(0, 3));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-900 text-white overflow-hidden py-16 lg:py-24">
        {/* Subtle Tribal Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none jharkhand-tribal-pattern"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 text-amber-300 text-xs font-semibold border border-amber-400/30 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Jharkhand's First Multi-Stakeholder Civic Crowdsourcing Platform</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              Together, We Can Solve Jharkhand's <span className="text-amber-400">Real-World</span> Challenges
            </h1>

            <p className="text-base sm:text-lg text-emerald-100/90 font-normal max-w-3xl mx-auto leading-relaxed">
              "{TAGLINE}"
            </p>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/challenges/new"
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-sm font-extrabold px-6 py-3.5 rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all scale-100 hover:scale-[1.02]"
              >
                <PlusCircle className="w-5 h-5 text-slate-950" />
                <span>Report a Challenge</span>
              </Link>
              <Link
                href="/challenges"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 text-sm font-bold px-6 py-3.5 rounded-xl backdrop-blur-md flex items-center gap-2 transition-all"
              >
                <Search className="w-5 h-5 text-emerald-400" />
                <span>Explore Challenges</span>
              </Link>
              <Link
                href="/register"
                className="bg-emerald-800/80 hover:bg-emerald-800 text-emerald-100 border border-emerald-600/60 text-sm font-semibold px-6 py-3.5 rounded-xl transition-all"
              >
                <span>Join the Community</span>
              </Link>
            </div>

            {/* Live Statistics Cards */}
            <div className="pt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 text-left">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-sm">
                <div className="text-amber-400 text-2xl font-black">{stats.totalChallenges}</div>
                <div className="text-xs text-slate-300 font-medium">Challenges Reported</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-sm">
                <div className="text-emerald-400 text-2xl font-black">{stats.resolvedChallenges}</div>
                <div className="text-xs text-slate-300 font-medium">Challenges Solved</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-sm">
                <div className="text-blue-400 text-2xl font-black">{stats.totalUsers}+</div>
                <div className="text-xs text-slate-300 font-medium">Active Citizens</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-sm">
                <div className="text-purple-400 text-2xl font-black">{stats.totalUniversities}</div>
                <div className="text-xs text-slate-300 font-medium">Universities</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-sm col-span-2 sm:col-span-1">
                <div className="text-rose-400 text-2xl font-black">{stats.totalIndustries}</div>
                <div className="text-xs text-slate-300 font-medium">Industry Partners</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How JanSamadhan Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              How JanSamadhan Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              A 3-step collaborative ecosystem built specifically for Jharkhand's 24 districts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-sm relative group hover:border-emerald-500 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 transition-transform">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">1. Identify & Report</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Citizens, farmers, NGOs, and local panchayats report grassroots challenges in healthcare, water, agriculture, and infrastructure with district tagging.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-sm relative group hover:border-amber-500 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 transition-transform">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">2. Research & Co-create</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                University researchers from BIT Mesra, IIT ISM Dhanbad, and NIT Jamshedpur formulate technological models and assemble cross-disciplinary teams.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-sm relative group hover:border-blue-500 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 transition-transform">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">3. Sponsor & Implement</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Industry partners like Tata Steel and SAIL fund shortlisted solutions via CSR grants, while state administration facilitates ground execution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Jharkhand District Interactive Map Section */}
      <section className="py-12 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <JharkhandMap districtStats={stats.districtBreakdown} />
        </div>
      </section>

      {/* Featured Challenges */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Featured Challenges in Jharkhand
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                High-priority societal issues requiring urgent university & industry solutions.
              </p>
            </div>
            <Link
              href="/challenges"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              View All ({stats.totalChallenges}) <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredChallenges.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
              >
                {c.images && c.images.length > 0 ? (
                  <img
                    src={c.images[0]}
                    alt={c.title}
                    className="w-full h-44 object-cover"
                  />
                ) : (
                  <div className="w-full h-44 bg-emerald-900/10 flex items-center justify-center text-emerald-800 font-bold text-xs">
                    JanSamadhan Jharkhand
                  </div>
                )}

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                        {c.category}
                      </span>
                      <span className="text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                        {c.district}
                      </span>
                      <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded ml-auto">
                        {c.urgency}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 line-clamp-2 hover:text-emerald-700">
                      <Link href={`/challenges/${c.id}`}>{c.title}</Link>
                    </h3>

                    <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                      {c.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold text-emerald-700">
                      {c.supportCount || 0} Supporters
                    </span>
                    <span>{c.solutionCount || 0} Solutions</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border-t border-slate-100">
                  <Link
                    href={`/challenges/${c.id}`}
                    className="block w-full text-center bg-white hover:bg-emerald-50 text-emerald-800 text-xs font-bold py-2 rounded-lg border border-emerald-200 transition-colors"
                  >
                    View Details & Submit Solution
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* University & Industry Collaboration Banner */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900 text-emerald-300 text-xs font-semibold">
                <GraduationCap className="w-4 h-4 text-amber-400" />
                <span>Academia & Industry Synergies</span>
              </div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                Empowering Jharkhand Universities & Corporate CSR
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                JanSamadhan bridges higher education institutes like BIT Mesra, IIT ISM Dhanbad, and NIT Jamshedpur with heavy industries like Tata Steel, SAIL, and HEC to translate student research into ground projects.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/universities"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-5 py-3 rounded-xl transition-all"
                >
                  Explore University Directory
                </Link>
                <Link
                  href="/industry"
                  className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-5 py-3 rounded-xl border border-slate-700 transition-all"
                >
                  Explore Industry Partners
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
                <GraduationCap className="w-8 h-8 text-emerald-400" />
                <h4 className="font-bold text-sm text-white">For Universities</h4>
                <p className="text-[11px] text-slate-400">
                  Access real-world Jharkhand problems for student final year projects & research grants.
                </p>
              </div>
              <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
                <Building2 className="w-8 h-8 text-amber-400" />
                <h4 className="font-bold text-sm text-white">For Industry</h4>
                <p className="text-[11px] text-slate-400">
                  Direct CSR funding into validated civic solutions with clear impact metrics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="py-16 bg-gradient-to-r from-emerald-800 to-teal-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold">Ready to Make an Impact in Jharkhand?</h2>
          <p className="text-sm text-emerald-100">
            Join thousands of active citizens, researchers, and engineers building a prosperous future.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/register"
              className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-sm px-7 py-3 rounded-xl shadow-lg transition-all"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
