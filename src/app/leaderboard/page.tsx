'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Award, Trophy, Medal, Flame, Users, GraduationCap, Building2, ShieldCheck, Sparkles } from 'lucide-react';
import { BADGES } from '@/lib/constants';

export default function LeaderboardPage() {
  const [topUsers, setTopUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/collaborate')
      .then((res) => res.json())
      .then((data) => {
        if (data.users) setTopUsers(data.users.slice(0, 10));
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 rounded-3xl p-6 lg:p-8 text-slate-950 shadow-xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/10 text-slate-950 text-xs font-black">
            <Trophy className="w-4 h-4 text-slate-950" />
            <span>Jharkhand Civic Gamification & Impact Recognition</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            JanSamadhan Leaderboards & Badges
          </h1>
          <p className="text-xs sm:text-sm text-slate-900 font-medium max-w-2xl leading-relaxed">
            Honoring citizens, researchers, universities, and industries who create measurable societal impact across Jharkhand's 24 districts.
          </p>
        </div>

        {/* Badges Showcase Grid */}
        <div className="space-y-4">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            Impact Badges & Honors
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {BADGES.map((b) => (
              <div
                key={b.type}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2 text-center hover:scale-[1.02] transition-transform"
              >
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto font-bold">
                  <Award className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="font-extrabold text-xs text-slate-900">{b.name}</h3>
                <span className="text-[10px] font-extrabold uppercase bg-amber-50 text-amber-900 px-2 py-0.5 rounded border border-amber-200 inline-block">
                  {b.type}
                </span>
                <p className="text-[11px] text-slate-500 leading-snug">{b.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top Leaderboard Table */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-500" />
            Top Contributors & Problem Solvers
          </h2>

          {loading ? (
            <div className="py-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-700 mx-auto"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Rank</th>
                    <th className="py-3 px-4">Contributor</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">District</th>
                    <th className="py-3 px-4 text-right">Impact Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {topUsers.map((u, index) => (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-black text-amber-600">
                        {index === 0 ? '🥇 #1' : index === 1 ? '🥈 #2' : index === 2 ? '🥉 #3' : `#${index + 1}`}
                      </td>
                      <td className="py-3 px-4 flex items-center gap-2">
                        {u.avatar ? (
                          <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-full object-cover" />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-[10px]">
                            {u.name.charAt(0)}
                          </div>
                        )}
                        <span className="font-bold text-slate-900">{u.name}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{u.userType}</td>
                      <td className="py-3 px-4 text-slate-600">{u.district}</td>
                      <td className="py-3 px-4 text-right font-black text-emerald-800 text-sm">
                        {u.impactScore} pts
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
