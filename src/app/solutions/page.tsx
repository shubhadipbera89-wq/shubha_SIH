'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Lightbulb, Search, Filter, CheckCircle2, Clock, MapPin, ArrowRight } from 'lucide-react';
import { SOLUTION_STATUSES, PROBLEM_CATEGORIES, JHARKHAND_DISTRICTS } from '@/lib/constants';

export default function SolutionsPage() {
  const [solutions, setSolutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/solutions')
      .then((res) => res.json())
      .then((data) => {
        if (data.solutions) setSolutions(data.solutions);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  const filteredSolutions = useMemo(() => {
    return solutions.filter((s) => {
      if (statusFilter !== 'All' && s.status !== statusFilter) return false;
      if (categoryFilter !== 'All' && s.challenge?.category !== categoryFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = s.title?.toLowerCase().includes(q);
        const matchesDesc = s.description?.toLowerCase().includes(q);
        const matchesApproach = s.approach?.toLowerCase().includes(q);
        const matchesChallenge = s.challenge?.title?.toLowerCase().includes(q);
        const matchesUser = s.user?.name?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesApproach && !matchesChallenge && !matchesUser) {
          return false;
        }
      }
      return true;
    });
  }, [solutions, statusFilter, categoryFilter, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Header */}
        <div className="border-b border-slate-200 pb-6 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
            <Lightbulb className="w-4 h-4 text-amber-600" />
            <span>Jharkhand Innovation Solutions Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Proposed & Implemented Solutions
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Technical models, pilot projects, and ground implementations developed by university researchers and industry partners for Jharkhand.
          </p>
        </div>

        {/* Filter bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search solutions by title, approach, researcher..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
            >
              <option value="All">All Categories</option>
              {PROBLEM_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
            >
              <option value="All">All Statuses ({solutions.length})</option>
              {SOLUTION_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Solutions Grid */}
        {loading ? (
          <div className="py-16 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-700 mx-auto"></div>
          </div>
        ) : filteredSolutions.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-xs text-slate-500">
            No solutions matching the selected filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredSolutions.map((sol) => (
              <div
                key={sol.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-amber-300 transition-colors space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
                      Status: {sol.status}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      By {sol.user?.name} ({sol.user?.userType})
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 leading-snug">
                    {sol.title}
                  </h3>

                  <div className="text-xs text-slate-600 line-clamp-3">
                    {sol.description}
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1">
                    <span className="font-bold text-emerald-800 block text-[11px]">Proposed Approach:</span>
                    <p className="text-slate-700 text-[11px] line-clamp-2">{sol.approach}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-2 border-t border-slate-100">
                    <div>Estimated Cost: <span className="font-bold text-slate-900">{sol.estimatedCost || 'N/A'}</span></div>
                    <div>Timeline: <span className="font-bold text-slate-900">{sol.estimatedTimeline || 'N/A'}</span></div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <Link
                    href={`/challenges/${sol.challengeId}`}
                    className="flex items-center justify-between w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors"
                  >
                    <span>View Challenge Target ({sol.challenge?.district || 'Jharkhand'})</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
