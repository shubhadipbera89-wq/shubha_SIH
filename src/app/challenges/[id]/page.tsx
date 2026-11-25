'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import {
  Shield,
  MapPin,
  Users,
  ThumbsUp,
  Bookmark,
  Lightbulb,
  MessageSquare,
  Share2,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Sparkles,
  Building2,
  GraduationCap,
  X,
} from 'lucide-react';
import { SOLUTION_STATUSES } from '@/lib/constants';

export default function ChallengeDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { user } = useAuth();

  const [challenge, setChallenge] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Support & Save status
  const [isSupported, setIsSupported] = useState(false);
  const [supportCount, setSupportCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  // Solution Modal state
  const [solutionModalOpen, setSolutionModalOpen] = useState(false);
  const [solutionForm, setSolutionForm] = useState({
    title: '',
    description: '',
    approach: '',
    resources: '',
    estimatedCost: '',
    estimatedTimeline: '',
    expectedImpact: '',
    skillsRequired: 'Environmental Chemistry, Solar Thermal',
    teamMembers: '',
  });
  const [submittingSolution, setSubmittingSolution] = useState(false);

  // Comments state
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  const fetchChallenge = useCallback(() => {
    fetch(`/api/challenges/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else {
          setChallenge(data.challenge);
          setIsSupported(data.challenge.isSupported);
          setSupportCount(data.challenge.supportCount);
          setIsSaved(data.challenge.isSaved);
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch challenge details.');
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    fetchChallenge();
  }, [fetchChallenge]);

  const handleSupportToggle = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    try {
      const res = await fetch(`/api/challenges/${id}/support`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setIsSupported(data.isSupported);
        setSupportCount(data.supportCount);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveToggle = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    try {
      const res = await fetch(`/api/challenges/${id}/save`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setIsSaved(data.isSaved);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSolutionStatusUpdate = async (solutionId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/solutions/${solutionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchChallenge();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSolutionDelete = async (solutionId: string) => {
    if (!confirm('Are you sure you want to delete this solution?')) return;
    try {
      const res = await fetch(`/api/solutions/${solutionId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchChallenge();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSolutionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }
    setSubmittingSolution(true);
    try {
      const res = await fetch('/api/solutions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId: id,
          title: solutionForm.title,
          description: solutionForm.description,
          approach: solutionForm.approach,
          resources: solutionForm.resources,
          estimatedCost: solutionForm.estimatedCost,
          estimatedTimeline: solutionForm.estimatedTimeline,
          expectedImpact: solutionForm.expectedImpact,
          skillsRequired: solutionForm.skillsRequired.split(',').map((s) => s.trim()),
          teamMembers: solutionForm.teamMembers ? [solutionForm.teamMembers] : [],
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSolutionModalOpen(false);
        fetchChallenge(); // Reload details
      } else {
        alert(data.error || 'Failed to submit solution');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingSolution(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }
    if (!commentText.trim()) return;
    setSubmittingComment(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId: id,
          content: commentText.trim(),
        }),
      });
      if (res.ok) {
        setCommentText('');
        fetchChallenge();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      if (navigator.share) {
        navigator.share({
          title: challenge?.title || 'JanSamadhan Jharkhand Challenge',
          text: `Check out this civic innovation challenge from ${challenge?.district || 'Jharkhand'}: ${challenge?.title}`,
          url: window.location.href,
        }).catch(() => {});
      } else {
        navigator.clipboard.writeText(window.location.href);
        alert('Challenge link copied to clipboard!');
      }
    }
  };

  const handleLikeComment = async (commentId: string) => {
    try {
      const res = await fetch('/api/comments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId, action: 'like' }),
      });
      if (res.ok) {
        fetchChallenge();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    try {
      const res = await fetch(`/api/comments?id=${commentId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchChallenge();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-700"></div>
        </div>
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 max-w-md mx-auto py-16 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-lg font-bold">Challenge Not Found</h2>
          <p className="text-xs text-slate-500">{error || 'The requested challenge could not be loaded.'}</p>
          <Link href="/challenges" className="inline-block bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl">
            Return to Explorer
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Challenge Header Card */}
        <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-200 shadow-xl space-y-6">
          {/* Metadata badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-extrabold uppercase bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
              Category: {challenge.category}
            </span>
            <span className="text-xs font-extrabold uppercase bg-amber-100 text-amber-800 px-3 py-1 rounded-full flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {challenge.district} District
            </span>
            <span className="text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
              Urgency: {challenge.urgency}
            </span>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-300 ml-auto">
              Status: {challenge.status}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-snug">
            {challenge.title}
          </h1>

          {/* User Info Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 text-xs text-slate-600">
            <div className="flex items-center gap-3">
              {challenge.user?.avatar ? (
                <img
                  src={challenge.user.avatar}
                  alt={challenge.user.name}
                  className="w-10 h-10 rounded-full object-cover border border-emerald-400"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold">
                  {challenge.user?.name.charAt(0)}
                </div>
              )}
              <div>
                <div className="font-bold text-slate-900">{challenge.user?.name}</div>
                <div className="text-[11px] text-slate-500">
                  {challenge.user?.userType} · Reported on {new Date(challenge.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Interaction Buttons Bar */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleSupportToggle}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs transition-colors shadow-sm ${
                  isSupported
                    ? 'bg-emerald-700 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800'
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>{isSupported ? 'Supported' : 'Support Issue'} ({supportCount})</span>
              </button>

              <button
                onClick={handleSaveToggle}
                title="Bookmark Challenge"
                className={`p-2.5 rounded-xl border transition-colors ${
                  isSaved
                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                    : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                }`}
              >
                <Bookmark className="w-4 h-4 fill-current" />
              </button>

              <button
                onClick={handleShare}
                title="Share Challenge"
                className="p-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setSolutionModalOpen(true)}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs px-4 py-2 rounded-xl shadow-md flex items-center gap-1.5"
              >
                <Lightbulb className="w-4 h-4 text-slate-950" />
                <span>Submit Solution</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Columns: Left Main Info, Right Impact Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Info Left */}
          <div className="lg:col-span-8 space-y-8">
            {/* Image Banner */}
            {challenge.images && challenge.images.length > 0 && (
              <div className="rounded-2xl overflow-hidden shadow-md border border-slate-200 max-h-96">
                <img
                  src={challenge.images[0]}
                  alt={challenge.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Detailed Description */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-base font-extrabold text-slate-900">Problem Description</h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {challenge.description}
              </p>
            </div>

            {/* Location & Impact */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xs font-extrabold uppercase text-slate-500 mb-2 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600" /> Location Details
                </h3>
                <div className="space-y-1 text-xs text-slate-800 font-medium">
                  <div>District: <span className="font-bold">{challenge.district}</span></div>
                  <div>Block / Tehsil: <span className="font-bold">{challenge.block || 'N/A'}</span></div>
                  <div>Village / Area: <span className="font-bold">{challenge.village || 'N/A'}</span></div>
                  <div>Landmark: <span className="font-bold">{challenge.location || 'N/A'}</span></div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-extrabold uppercase text-slate-500 mb-2 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-blue-600" /> Societal Impact Metrics
                </h3>
                <div className="space-y-1 text-xs text-slate-800 font-medium">
                  <div>People Affected: <span className="font-black text-rose-600">{challenge.peopleAffected?.toLocaleString()} Citizens</span></div>
                  <div>Expected Outcome: <span className="font-semibold text-slate-600">{challenge.impact || 'Community development'}</span></div>
                </div>
              </div>
            </div>

            {/* Proposed Solutions Section */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-amber-500" />
                    Submitted Solutions ({challenge.solutions?.length || 0})
                  </h2>
                  <p className="text-xs text-slate-500">
                    Technical models proposed by Jharkhand universities, researchers, & industry leaders.
                  </p>
                </div>
                <button
                  onClick={() => setSolutionModalOpen(true)}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow"
                >
                  + Propose Solution
                </button>
              </div>

              {challenge.solutions?.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl text-xs text-slate-500 space-y-2">
                  <p>No solutions submitted yet for this challenge.</p>
                  <button
                    onClick={() => setSolutionModalOpen(true)}
                    className="font-bold text-emerald-700 hover:underline"
                  >
                    Be the first university / researcher to submit a solution!
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {challenge.solutions?.map((sol: any) => (
                    <div
                      key={sol.id}
                      className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">{sol.title}</span>
                          <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                            Status: {sol.status}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500">
                          By {sol.user?.name} ({sol.user?.userType})
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed">{sol.description}</p>

                      <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                        <div className="font-bold text-emerald-800">Proposed Technical Approach:</div>
                        <div className="text-slate-600">{sol.approach}</div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-slate-600 pt-2 border-t border-slate-200/60">
                        <div>Cost: <span className="font-bold text-slate-900">{sol.estimatedCost || 'N/A'}</span></div>
                        <div>Timeline: <span className="font-bold text-slate-900">{sol.estimatedTimeline || 'N/A'}</span></div>
                        <div>Resources: <span className="font-semibold text-slate-700">{sol.resources || 'N/A'}</span></div>
                      </div>

                      {/* Author / Admin / Owner Solution Actions */}
                      {user && (user.id === challenge.userId || user.id === sol.userId || user.role === 'ADMIN') && (
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200 text-xs">
                          {(user.id === challenge.userId || user.role === 'ADMIN') && (
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-bold text-slate-600">Review Status:</span>
                              <select
                                value={sol.status}
                                onChange={(e) => handleSolutionStatusUpdate(sol.id, e.target.value)}
                                className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-emerald-800"
                              >
                                {SOLUTION_STATUSES.map((st) => (
                                  <option key={st} value={st}>
                                    {st}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}

                          {(user.id === sol.userId || user.role === 'ADMIN') && (
                            <button
                              onClick={() => handleSolutionDelete(sol.id)}
                              className="text-rose-600 hover:text-rose-800 font-bold text-[11px] px-2.5 py-1 rounded hover:bg-rose-50 ml-auto transition-colors"
                            >
                              Delete Solution
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Discussion & Comments */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                Community Discussion ({challenge.comments?.length || 0})
              </h2>

              {/* Add comment form */}
              <form onSubmit={handleCommentSubmit} className="space-y-3">
                <textarea
                  rows={3}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={user ? "Write a comment or constructive suggestion..." : "Please log in to join the discussion..."}
                  disabled={!user}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!user || submittingComment}
                    className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-4 py-2 rounded-xl shadow flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post Comment</span>
                  </button>
                </div>
              </form>

              {/* Comments list */}
              <div className="space-y-3 pt-2 divide-y divide-slate-100">
                {challenge.comments?.map((com: any) => (
                  <div key={com.id} className="pt-3 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">
                        {com.user?.name} <span className="text-[10px] font-normal text-slate-500">({com.user?.userType})</span>
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(com.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{com.content}</p>
                    <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-500">
                      <button
                        onClick={() => handleLikeComment(com.id)}
                        className="flex items-center gap-1 hover:text-emerald-700 transition-colors"
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>{com.likes || 0}</span>
                      </button>
                      {user && (user.id === com.userId || user.role === 'ADMIN') && (
                        <button
                          onClick={() => handleDeleteComment(com.id)}
                          className="text-rose-500 hover:text-rose-700 transition-colors ml-auto"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar: Supporters & Overview */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                Challenge Overview
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Supporters Count</span>
                  <span className="font-bold text-emerald-800">{supportCount} Citizens</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Solutions Proposed</span>
                  <span className="font-bold text-amber-700">{challenge.solutions?.length || 0} Proposals</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">District</span>
                  <span className="font-bold text-slate-900">{challenge.district}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Current Status</span>
                  <span className="font-bold text-rose-600">{challenge.status}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Submit Solution Modal */}
      {solutionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full rounded-3xl p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                Submit Solution Proposal
              </h3>
              <button
                onClick={() => setSolutionModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSolutionSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Solution Title *
                </label>
                <input
                  type="text"
                  required
                  value={solutionForm.title}
                  onChange={(e) => setSolutionForm({ ...solutionForm, title: e.target.value })}
                  placeholder="e.g. Nanofiltration & Bio-Char Adsorption Column"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Brief Overview *
                </label>
                <textarea
                  rows={2}
                  required
                  value={solutionForm.description}
                  onChange={(e) => setSolutionForm({ ...solutionForm, description: e.target.value })}
                  placeholder="Summary of the solution and how it works..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Proposed Technical Approach *
                </label>
                <textarea
                  rows={3}
                  required
                  value={solutionForm.approach}
                  onChange={(e) => setSolutionForm({ ...solutionForm, approach: e.target.value })}
                  placeholder="Step by step technical methodology, materials used, implementation flow..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Estimated Cost</label>
                  <input
                    type="text"
                    value={solutionForm.estimatedCost}
                    onChange={(e) => setSolutionForm({ ...solutionForm, estimatedCost: e.target.value })}
                    placeholder="e.g. ₹1,85,000 per unit"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Timeline</label>
                  <input
                    type="text"
                    value={solutionForm.estimatedTimeline}
                    onChange={(e) => setSolutionForm({ ...solutionForm, estimatedTimeline: e.target.value })}
                    placeholder="e.g. 6 Weeks"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Required Resources</label>
                <input
                  type="text"
                  value={solutionForm.resources}
                  onChange={(e) => setSolutionForm({ ...solutionForm, resources: e.target.value })}
                  placeholder="e.g. Solar PV Panels, Filtration Membrane, Local Water Lab"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSolutionModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingSolution}
                  className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow"
                >
                  {submittingSolution ? 'Submitting...' : 'Submit Solution Proposal'}
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
