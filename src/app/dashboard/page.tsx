'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import {
  Shield,
  Award,
  PlusCircle,
  Search,
  Users,
  Lightbulb,
  Bookmark,
  Bell,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  MapPin,
  Sparkles,
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      fetch('/api/profile')
        .then((res) => res.json())
        .then((data) => {
          if (data.profile) setProfileData(data.profile);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-700"></div>
        </div>
      </div>
    );
  }

  if (!user || !profileData) return null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Personalized Welcome Banner */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl p-6 lg:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10 pointer-events-none jharkhand-tribal-pattern w-full h-full"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 text-amber-300 text-xs font-semibold border border-emerald-700">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{user.userType} · {user.district} District</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Welcome to JanSamadhan, <span className="text-amber-400">{user.name}</span>
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
                Thank you for contributing to Jharkhand's crowdsourced civic innovation ecosystem.
              </p>
            </div>

            {/* Impact Score Box */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center shrink-0 min-w-[160px]">
              <div className="text-[11px] uppercase font-bold text-amber-300 tracking-wider">
                Impact Score
              </div>
              <div className="text-3xl font-black text-white my-1 flex items-center justify-center gap-1">
                <Award className="w-6 h-6 text-amber-400" />
                <span>{profileData.impactScore}</span>
              </div>
              <div className="text-[10px] text-emerald-200">Community Points</div>
            </div>
          </div>
        </div>

        {/* Personalized Dashboard Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <div className="text-xs font-bold text-slate-500">My Challenges</div>
            <div className="text-2xl font-black text-slate-900">
              {profileData.reportedChallenges?.length || 0}
            </div>
            <div className="text-[10px] text-emerald-700 font-medium">Reported Issues</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <div className="text-xs font-bold text-slate-500">My Solutions</div>
            <div className="text-2xl font-black text-emerald-700">
              {profileData.submittedSolutions?.length || 0}
            </div>
            <div className="text-[10px] text-slate-500 font-medium">Proposals</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <div className="text-xs font-bold text-slate-500">Collaborations</div>
            <div className="text-2xl font-black text-blue-700">
              {profileData.collaborations?.length || 0}
            </div>
            <div className="text-[10px] text-slate-500 font-medium">Active Teams</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <div className="text-xs font-bold text-slate-500">Saved</div>
            <div className="text-2xl font-black text-amber-600">
              {profileData.supportedChallenges?.length || 0}
            </div>
            <div className="text-[10px] text-slate-500 font-medium">Supported</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <div className="text-xs font-bold text-slate-500">Notifications</div>
            <div className="text-2xl font-black text-rose-600">
              {user.unreadNotifications || 0}
            </div>
            <div className="text-[10px] text-slate-500 font-medium">Unread</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <div className="text-xs font-bold text-slate-500">Badges</div>
            <div className="text-2xl font-black text-purple-700">
              {profileData.achievements?.length || 0}
            </div>
            <div className="text-[10px] text-purple-600 font-bold">Earned</div>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/challenges/new"
              className="p-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-700 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <PlusCircle className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900">Report New Challenge</div>
                <div className="text-[11px] text-slate-500">Submit societal issue</div>
              </div>
            </Link>

            <Link
              href="/challenges"
              className="p-4 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-lg bg-amber-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900">Submit Solution</div>
                <div className="text-[11px] text-slate-500">Solve open problems</div>
              </div>
            </Link>

            <Link
              href="/collaborate"
              className="p-4 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-700 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900">Find Collaborators</div>
                <div className="text-[11px] text-slate-500">Build project team</div>
              </div>
            </Link>

            <Link
              href="/challenges"
              className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-800 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <Search className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900">Browse Challenges</div>
                <div className="text-[11px] text-slate-500">Filter by 24 districts</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Two Column Layout: My Activity Feed & Recent Challenges */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: My Reported Challenges */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-900">
                My Reported Challenges
              </h2>
              <Link href="/challenges/new" className="text-xs font-bold text-emerald-700 hover:underline">
                + Report New
              </Link>
            </div>

            {profileData.reportedChallenges?.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-500 space-y-3">
                <p>You haven't reported any challenges yet.</p>
                <Link
                  href="/challenges/new"
                  className="inline-block bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl"
                >
                  Report First Challenge
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {profileData.reportedChallenges?.map((c: any) => (
                  <div
                    key={c.id}
                    className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-300 transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                        {c.category} · {c.district}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {c.status}
                      </span>
                    </div>

                    <h3 className="font-bold text-xs text-slate-900 hover:text-emerald-700">
                      <Link href={`/challenges/${c.id}`}>{c.title}</Link>
                    </h3>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                      <span>{c.supportCount} Supporters</span>
                      <span>{c.solutionCount} Solutions</span>
                      <Link
                        href={`/challenges/${c.id}`}
                        className="font-bold text-emerald-700 flex items-center gap-1 hover:underline"
                      >
                        View <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Activity Feed */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-base font-extrabold text-slate-900">Recent Platform Activity</h2>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="space-y-3 divide-y divide-slate-100">
                <div className="pt-2 text-xs space-y-1">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Solution Shortlisted</span>
                  </div>
                  <p className="text-slate-700 font-medium">
                    Tata Steel CSR shortlisted Mine Water Reclamation proposal in Dhanbad.
                  </p>
                  <div className="text-[10px] text-slate-400">2 hours ago</div>
                </div>

                <div className="pt-3 text-xs space-y-1">
                  <div className="flex items-center gap-2 text-amber-700 font-bold text-[11px]">
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>New Solution Proposal</span>
                  </div>
                  <p className="text-slate-700 font-medium">
                    BIT Mesra researchers submitted Solar Cold Pod model for Gumla farmers.
                  </p>
                  <div className="text-[10px] text-slate-400">5 hours ago</div>
                </div>

                <div className="pt-3 text-xs space-y-1">
                  <div className="flex items-center gap-2 text-blue-700 font-bold text-[11px]">
                    <Users className="w-3.5 h-3.5" />
                    <span>Collaboration Joined</span>
                  </div>
                  <p className="text-slate-700 font-medium">
                    Prof. Alok Kumar joined Saranda Tele-medicine research team.
                  </p>
                  <div className="text-[10px] text-slate-400">1 day ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
