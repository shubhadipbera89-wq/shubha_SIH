'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import {
  ShieldAlert,
  Users,
  CheckCircle2,
  AlertCircle,
  BarChart2,
  PieChart,
  Edit,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { CHALLENGE_STATUSES, SOLUTION_STATUSES } from '@/lib/constants';

export default function AdminPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [stats, setStats] = useState<any>(null);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [solutionsList, setSolutionsList] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'analytics' | 'challenges' | 'solutions' | 'users'>('analytics');

  const fetchAdminData = () => {
    fetch('/api/admin/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.stats) setStats(data.stats);
      })
      .catch(console.error);

    fetch('/api/challenges')
      .then((res) => res.json())
      .then((data) => {
        if (data.challenges) setChallenges(data.challenges);
      })
      .catch(console.error);

    fetch('/api/solutions')
      .then((res) => res.json())
      .then((data) => {
        if (data.solutions) setSolutionsList(data.solutions);
      })
      .catch(console.error);

    fetch('/api/admin/users')
      .then((res) => res.json())
      .then((data) => {
        if (data.users) setUsersList(data.users);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'ADMIN') {
        router.push('/dashboard');
        return;
      }
      fetchAdminData();
    }
  }, [user, authLoading, router]);

  const handleUpdateStatus = async (challengeId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/challenges/${challengeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateSolutionStatus = async (solutionId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/solutions/${solutionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rose-700"></div>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'ADMIN') return null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Header */}
        <div className="bg-slate-900 rounded-3xl p-6 lg:p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950 text-rose-400 text-xs font-bold border border-rose-800">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>JanSamadhan Administrative Control Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Jharkhand Admin Portal
            </h1>
            <p className="text-xs text-slate-300">
              Review challenges, change status workflows, manage users, & monitor district analytics.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'analytics' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('challenges')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'challenges' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300'
              }`}
            >
              Manage Challenges
            </button>
            <button
              onClick={() => setActiveTab('solutions')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'solutions' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300'
              }`}
            >
              Manage Solutions
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'users' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300'
              }`}
            >
              Manage Users
            </button>
          </div>
        </div>

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-xs font-bold text-slate-500">Total Users</div>
                <div className="text-2xl font-black text-slate-900">{stats?.totalUsers || 0}</div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-xs font-bold text-slate-500">Total Challenges</div>
                <div className="text-2xl font-black text-emerald-700">{stats?.totalChallenges || 0}</div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-xs font-bold text-slate-500">Total Solutions</div>
                <div className="text-2xl font-black text-amber-600">{stats?.totalSolutions || 0}</div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-xs font-bold text-slate-500">Resolved Issues</div>
                <div className="text-2xl font-black text-rose-600">{stats?.resolvedChallenges || 0}</div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-xs font-bold text-slate-500">Universities</div>
                <div className="text-2xl font-black text-purple-700">{stats?.totalUniversities || 0}</div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-xs font-bold text-slate-500">Industry Partners</div>
                <div className="text-2xl font-black text-blue-700">{stats?.totalIndustries || 0}</div>
              </div>
            </div>

            {/* Breakdown Tables */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-emerald-600" />
                  District-Wise Challenge Distribution
                </h3>
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {stats?.districtBreakdown?.map((d: any) => (
                    <div key={d.district} className="flex justify-between text-xs py-1 border-b border-slate-100">
                      <span className="font-medium text-slate-700">{d.district}</span>
                      <span className="font-bold text-emerald-800">{d.count} Challenges</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-purple-600" />
                  Category-Wise Challenge Breakdown
                </h3>
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {stats?.categoryBreakdown?.map((c: any) => (
                    <div key={c.category} className="flex justify-between text-xs py-1 border-b border-slate-100">
                      <span className="font-medium text-slate-700">{c.category}</span>
                      <span className="font-bold text-purple-800">{c.count} Issues</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'challenges' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-extrabold text-slate-900">Manage & Review Challenges</h2>
            <div className="space-y-3">
              {challenges.map((c) => (
                <div key={c.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{c.title}</div>
                    <div className="text-slate-500 mt-0.5">{c.category} · {c.district} · Urgency: {c.urgency}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-600">Status:</span>
                    <select
                      value={c.status}
                      onChange={(e) => handleUpdateStatus(c.id, e.target.value)}
                      className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-bold text-emerald-800"
                    >
                      {CHALLENGE_STATUSES.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'solutions' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-extrabold text-slate-900">Manage & Review Technical Solutions</h2>
            <div className="space-y-3">
              {solutionsList.length === 0 ? (
                <div className="text-xs text-slate-500 py-6 text-center">No solutions submitted yet.</div>
              ) : (
                solutionsList.map((sol) => (
                  <div key={sol.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="font-bold text-slate-900">{sol.title}</div>
                      <div className="text-slate-500 text-[11px]">
                        Target Challenge: <span className="font-semibold text-slate-700">{sol.challenge?.title || 'Unknown'}</span> ({sol.challenge?.district})
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        Submitted By: {sol.user?.name} ({sol.user?.userType}) · {sol.user?.institution || sol.user?.company || sol.user?.district}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-bold text-slate-600">Review Status:</span>
                      <select
                        value={sol.status}
                        onChange={(e) => handleUpdateSolutionStatus(sol.id, e.target.value)}
                        className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-bold text-amber-800"
                      >
                        {SOLUTION_STATUSES.map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-extrabold text-slate-900">Registered Users Management</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">Name</th>
                    <th className="py-2.5 px-3">Email</th>
                    <th className="py-2.5 px-3">User Type</th>
                    <th className="py-2.5 px-3">District</th>
                    <th className="py-2.5 px-3">Role</th>
                    <th className="py-2.5 px-3 text-right">Impact Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {usersList.map((u) => (
                    <tr key={u.id}>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{u.name}</td>
                      <td className="py-2.5 px-3 text-slate-600">{u.email}</td>
                      <td className="py-2.5 px-3 text-slate-600">{u.userType}</td>
                      <td className="py-2.5 px-3 text-slate-600">{u.district}</td>
                      <td className="py-2.5 px-3 font-bold text-emerald-800">{u.role}</td>
                      <td className="py-2.5 px-3 text-right font-black">{u.impactScore}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
