'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import {
  Users,
  Search,
  Filter,
  MapPin,
  Award,
  Send,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Sparkles,
  X,
} from 'lucide-react';
import { JHARKHAND_DISTRICTS, USER_TYPES } from '@/lib/constants';

export default function CollaboratePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'find' | 'my_requests'>('find');

  // Directory state
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [district, setDistrict] = useState('All');
  const [userType, setUserType] = useState('All');
  const [skill, setSkill] = useState('');

  // Requests state
  const [sentRequests, setSentRequests] = useState<any[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<any[]>([]);

  // Send Collab Modal state
  const [targetUser, setTargetUser] = useState<any>(null);
  const [collabMessage, setCollabMessage] = useState('');
  const [roleNeeded, setRoleNeeded] = useState('');
  const [sending, setSending] = useState(false);

  const fetchCollaborators = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (district !== 'All') params.append('district', district);
    if (userType !== 'All') params.append('userType', userType);
    if (skill) params.append('skill', skill);

    fetch(`/api/collaborate?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.users) setCollaborators(data.users);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, [search, district, userType, skill]);

  const fetchMyRequests = useCallback(() => {
    if (!user) return;
    fetch('/api/collaborate?type=my_requests')
      .then((res) => res.json())
      .then((data) => {
        if (data.sent) setSentRequests(data.sent);
        if (data.received) setReceivedRequests(data.received);
      })
      .catch(console.error);
  }, [user]);

  useEffect(() => {
    if (activeTab === 'find') fetchCollaborators();
    else fetchMyRequests();
  }, [activeTab, fetchCollaborators, fetchMyRequests]);

  const handleSendRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUser || !collabMessage.trim()) return;
    setSending(true);
    try {
      const res = await fetch('/api/collaborate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: targetUser.id,
          message: collabMessage,
          roleNeeded,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setTargetUser(null);
        setCollabMessage('');
        alert('Collaboration request sent successfully!');
      } else {
        alert(data.error || 'Failed to send request');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  const handleRespondRequest = async (id: string, status: 'Accepted' | 'Rejected') => {
    try {
      const res = await fetch(`/api/collaborate/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchMyRequests();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Header */}
        <div className="border-b border-slate-200 pb-6 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
            <Users className="w-4 h-4 text-blue-600" />
            <span>Jharkhand Multi-Disciplinary Team Finder</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Find & Connect with Collaborators
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Build cross-sector project teams combining university researchers, students, industry professionals, and local community leaders.
          </p>

          {/* Navigation Tabs */}
          <div className="flex gap-2 pt-4">
            <button
              onClick={() => setActiveTab('find')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'find'
                  ? 'bg-emerald-800 text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Find Collaborators Directory
            </button>
            <button
              onClick={() => setActiveTab('my_requests')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'my_requests'
                  ? 'bg-emerald-800 text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              My Requests & Teams
            </button>
          </div>
        </div>

        {activeTab === 'find' ? (
          <>
            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name, institution, bio..."
                  className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />

                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                >
                  <option value="All">All Districts</option>
                  {JHARKHAND_DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>

                <select
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                >
                  <option value="All">All User Types</option>
                  {USER_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>

                <button
                  onClick={fetchCollaborators}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-2 rounded-xl"
                >
                  Apply Filters
                </button>
              </div>
            </div>

            {/* Collaborators Grid */}
            {loading ? (
              <div className="py-16 text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-700 mx-auto"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collaborators.map((c) => (
                  <div
                    key={c.id}
                    className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        {c.avatar ? (
                          <img
                            src={c.avatar}
                            alt={c.name}
                            className="w-12 h-12 rounded-2xl object-cover border border-emerald-400"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold">
                            {c.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <h3 className="font-extrabold text-sm text-slate-900">{c.name}</h3>
                          <div className="text-[11px] text-slate-500 font-medium">
                            {c.userType} · {c.district}
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-3">
                        {c.bio || 'Active participant on JanSamadhan Jharkhand crowdsourcing ecosystem.'}
                      </p>

                      {/* Skills Tags */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase text-slate-400">Skills:</span>
                        <div className="flex flex-wrap gap-1">
                          {c.skills?.map((sk: string) => (
                            <span key={sk} className="text-[10px] bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded">
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                        <span className="font-bold text-amber-900">Impact Score:</span>
                        <span className="font-black text-amber-800 flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-amber-600" />
                          {c.impactScore} pts
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100">
                      <button
                        onClick={() => setTargetUser(c)}
                        className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs py-2.5 rounded-xl shadow transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5 text-amber-300" />
                        <span>Send Collaboration Request</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          /* My Requests Tab */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Incoming Requests */}
            <div className="space-y-4">
              <h2 className="text-base font-extrabold text-slate-900">Incoming Collaboration Requests</h2>
              {receivedRequests.length === 0 ? (
                <div className="p-8 bg-white rounded-2xl border border-slate-200 text-xs text-slate-500 text-center">
                  No pending incoming requests.
                </div>
              ) : (
                <div className="space-y-3">
                  {receivedRequests.map((req) => (
                    <div key={req.id} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">{req.sender?.name}</span>
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                          {req.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 italic">"{req.message}"</p>
                      {req.status === 'Pending' && (
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => handleRespondRequest(req.id, 'Accepted')}
                            className="bg-emerald-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleRespondRequest(req.id, 'Rejected')}
                            className="bg-rose-100 text-rose-700 font-bold text-xs px-3.5 py-1.5 rounded-lg"
                          >
                            Decline
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sent Requests */}
            <div className="space-y-4">
              <h2 className="text-base font-extrabold text-slate-900">Sent Collaboration Requests</h2>
              {sentRequests.length === 0 ? (
                <div className="p-8 bg-white rounded-2xl border border-slate-200 text-xs text-slate-500 text-center">
                  No sent requests.
                </div>
              ) : (
                <div className="space-y-3">
                  {sentRequests.map((req) => (
                    <div key={req.id} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">To: {req.receiver?.name}</span>
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {req.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">"{req.message}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Send Collab Modal */}
      {targetUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900">Invite {targetUser.name} to Collaborate</h3>
              <button onClick={() => setTargetUser(null)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendRequestSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Invitation Message *</label>
                <textarea
                  rows={4}
                  required
                  value={collabMessage}
                  onChange={(e) => setCollabMessage(e.target.value)}
                  placeholder="Hi! I saw your profile on JanSamadhan and would love to collaborate on..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Role Needed / Expertise</label>
                <input
                  type="text"
                  value={roleNeeded}
                  onChange={(e) => setRoleNeeded(e.target.value)}
                  placeholder="e.g. Water Quality Lead / Software Dev"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTargetUser(null)}
                  className="px-4 py-2 rounded-xl border text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="px-5 py-2 rounded-xl bg-emerald-800 text-white font-bold"
                >
                  {sending ? 'Sending...' : 'Send Invitation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
