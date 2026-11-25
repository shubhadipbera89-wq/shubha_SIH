'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import {
  Search,
  Filter,
  MapPin,
  Tag,
  PlusCircle,
  ThumbsUp,
  Lightbulb,
  MessageSquare,
  ArrowUpDown,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import {
  JHARKHAND_DISTRICTS,
  PROBLEM_CATEGORIES,
  CHALLENGE_STATUSES,
} from '@/lib/constants';

function ChallengeExplorerContent() {
  const searchParams = useSearchParams();

  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState('');
  const [district, setDistrict] = useState(searchParams.get('district') || 'All');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [status, setStatus] = useState(searchParams.get('status') || 'All');
  const [urgency, setUrgency] = useState('All');
  const [sort, setSort] = useState('latest');

  const fetchChallenges = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (district !== 'All') params.append('district', district);
    if (category !== 'All') params.append('category', category);
    if (status !== 'All') params.append('status', status);
    if (urgency !== 'All') params.append('urgency', urgency);
    if (sort) params.append('sort', sort);

    fetch(`/api/challenges?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.challenges) setChallenges(data.challenges);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, [search, district, category, status, urgency, sort]);

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchChallenges();
  };

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>Jharkhand Challenge Repository</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Explore Societal Challenges in Jharkhand
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Browse verified problems from all 24 districts reported by citizens, farmers, NGOs, and local panchayats.
          </p>
        </div>

        <Link
          href="/challenges/new"
          className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-md flex items-center gap-2 shrink-0 transition-colors"
        >
          <PlusCircle className="w-4 h-4 text-amber-300" />
          <span>Report a Challenge</span>
        </Link>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by keywords, village, block, tags..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <button
            type="submit"
            className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors"
          >
            Search
          </button>
        </form>

        {/* Dropdown Filters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2 border-t border-slate-100">
          {/* District Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              District (24)
            </label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium"
            >
              <option value="All">All Districts</option>
              {JHARKHAND_DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Category (16)
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium"
            >
              <option value="All">All Categories</option>
              {PROBLEM_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium"
            >
              <option value="All">All Statuses</option>
              {CHALLENGE_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Urgency Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Urgency
            </label>
            <select
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium"
            >
              <option value="All">All Urgency</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Sort By
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium"
            >
              <option value="latest">Latest First</option>
              <option value="most_supported">Most Supported</option>
              <option value="most_urgent">Most Urgent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Challenges Grid */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-700 mx-auto"></div>
          <div className="text-xs text-slate-500 mt-2">Loading Jharkhand Challenges...</div>
        </div>
      ) : challenges.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">No Challenges Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search criteria or district filter to view more challenges.
          </p>
          <button
            onClick={() => {
              setDistrict('All');
              setCategory('All');
              setStatus('All');
              setUrgency('All');
              setSearch('');
            }}
            className="bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden"
            >
              {/* Card Thumbnail */}
              {c.images && c.images.length > 0 ? (
                <img
                  src={c.images[0]}
                  alt={c.title}
                  className="w-full h-44 object-cover"
                />
              ) : (
                <div className="w-full h-44 bg-emerald-950/10 flex items-center justify-center text-emerald-900 font-bold text-xs">
                  JanSamadhan Jharkhand
                </div>
              )}

              {/* Card Body */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-1.5 mb-2">
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

                  <h3 className="font-bold text-sm text-slate-900 leading-snug line-clamp-2 hover:text-emerald-700">
                    <Link href={`/challenges/${c.id}`}>{c.title}</Link>
                  </h3>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {c.description}
                  </p>
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-800">
                      By {c.postedBy?.name || 'Citizen'} ({c.postedBy?.userType || 'User'})
                    </span>
                    <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded">
                      {c.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1 text-emerald-700 font-bold">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{c.supportCount} Supports</span>
                    </span>
                    <span className="flex items-center gap-1 text-blue-700 font-bold">
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>{c.solutionCount} Solutions</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-3 bg-slate-50 border-t border-slate-100">
                <Link
                  href={`/challenges/${c.id}`}
                  className="block w-full text-center bg-white hover:bg-emerald-50 text-emerald-800 text-xs font-bold py-2 rounded-xl border border-emerald-200 transition-colors"
                >
                  View Details & Participate
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default function ChallengesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <Suspense fallback={<div className="p-8 text-center text-xs">Loading Explorer...</div>}>
        <ChallengeExplorerContent />
      </Suspense>
      <Footer />
    </div>
  );
}
