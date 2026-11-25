'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import {
  User as UserIcon,
  MapPin,
  Building,
  Award,
  Edit,
  Mail,
  Phone,
  Globe,
  Sparkles,
  CheckCircle2,
  X,
  Lightbulb,
  ThumbsUp,
} from 'lucide-react';
import { JHARKHAND_DISTRICTS, USER_TYPES } from '@/lib/constants';

export default function ProfilePage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'challenges' | 'solutions' | 'supported' | 'achievements'>('challenges');

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    mobile: '',
    district: '',
    city: '',
    bio: '',
    institution: '',
    company: '',
    website: '',
    avatar: '',
    skillsInput: '',
    interestsInput: '',
  });
  const [updating, setUpdating] = useState(false);

  const fetchProfile = () => {
    fetch('/api/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data.profile) {
          setProfile(data.profile);
          setEditForm({
            name: data.profile.name || '',
            mobile: data.profile.mobile || '',
            district: data.profile.district || 'Ranchi',
            city: data.profile.city || '',
            bio: data.profile.bio || '',
            institution: data.profile.institution || '',
            company: data.profile.company || '',
            website: data.profile.website || '',
            avatar: data.profile.avatar || '',
            skillsInput: data.profile.skills?.join(', ') || '',
            interestsInput: data.profile.interests?.join(', ') || '',
          });
        }
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchProfile();
  }, [user, router]);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const skills = editForm.skillsInput.split(',').map((s) => s.trim()).filter(Boolean);
      const interests = editForm.interestsInput.split(',').map((i) => i.trim()).filter(Boolean);

      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editForm,
          skills,
          interests,
        }),
      });

      if (res.ok) {
        setEditModalOpen(false);
        fetchProfile();
        refreshUser();
      } else {
        alert('Failed to update profile');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-700"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Profile Card Header */}
        <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-200 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-emerald-500 shadow-md"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-emerald-800 text-white font-bold text-2xl flex items-center justify-center border-2 border-emerald-500 shadow-md">
                  {profile.name.charAt(0)}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{profile.name}</h1>
                  <span className="text-xs font-bold uppercase bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
                    {profile.userType}
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-medium mt-1 flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    {profile.district} District, Jharkhand
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {profile.email}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setEditModalOpen(true)}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow flex items-center gap-1.5 transition-colors"
            >
              <Edit className="w-4 h-4 text-amber-300" />
              <span>Edit Profile</span>
            </button>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed border-t border-slate-100 pt-4">
            {profile.bio || 'Active stakeholder on JanSamadhan Jharkhand civic crowdsourcing network.'}
          </p>

          {/* Skills & Interests Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="font-bold text-slate-500 block mb-1">Skills & Technical Expertise:</span>
              <div className="flex flex-wrap gap-1">
                {profile.skills?.map((sk: string) => (
                  <span key={sk} className="bg-slate-100 text-slate-800 font-medium px-2.5 py-0.5 rounded">
                    {sk}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span className="font-bold text-slate-500 block mb-1">Areas of Interest:</span>
              <div className="flex flex-wrap gap-1">
                {profile.interests?.map((inte: string) => (
                  <span key={inte} className="bg-emerald-50 text-emerald-800 font-medium px-2.5 py-0.5 rounded border border-emerald-200">
                    {inte}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Activity Views */}
        <div className="space-y-4">
          <div className="flex gap-2 border-b border-slate-200 pb-2">
            <button
              onClick={() => setActiveTab('challenges')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors ${
                activeTab === 'challenges' ? 'bg-emerald-800 text-white' : 'bg-white text-slate-700'
              }`}
            >
              Reported Challenges ({profile.reportedChallenges?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('solutions')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors ${
                activeTab === 'solutions' ? 'bg-emerald-800 text-white' : 'bg-white text-slate-700'
              }`}
            >
              Solutions Submitted ({profile.submittedSolutions?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('achievements')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors ${
                activeTab === 'achievements' ? 'bg-emerald-800 text-white' : 'bg-white text-slate-700'
              }`}
            >
              Badges & Achievements ({profile.achievements?.length || 0})
            </button>
          </div>

          {activeTab === 'challenges' && (
            <div className="space-y-3">
              {profile.reportedChallenges?.map((c: any) => (
                <div key={c.id} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
                  <div className="font-bold text-sm text-slate-900">
                    <Link href={`/challenges/${c.id}`}>{c.title}</Link>
                  </div>
                  <div className="text-xs text-slate-500">{c.category} · {c.district} · Status: {c.status}</div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'solutions' && (
            <div className="space-y-3">
              {profile.submittedSolutions?.map((s: any) => (
                <div key={s.id} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
                  <div className="font-bold text-sm text-slate-900">{s.title}</div>
                  <div className="text-xs text-slate-500">Status: {s.status}</div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {profile.achievements?.map((ach: any) => (
                <div key={ach.id} className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
                  <Award className="w-8 h-8 text-amber-500" />
                  <div className="font-bold text-xs text-slate-900">{ach.name}</div>
                  <div className="text-[11px] text-slate-500">{ach.description}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Edit Profile Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-xl w-full rounded-3xl p-6 space-y-4 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900">Edit Profile Details</h3>
              <button onClick={() => setEditModalOpen(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Bio</label>
                <textarea
                  rows={3}
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">District</label>
                  <select
                    value={editForm.district}
                    onChange={(e) => setEditForm({ ...editForm, district: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {JHARKHAND_DISTRICTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">City / Town</label>
                  <input
                    type="text"
                    value={editForm.city}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Skills (Comma separated)</label>
                <input
                  type="text"
                  value={editForm.skillsInput}
                  onChange={(e) => setEditForm({ ...editForm, skillsInput: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Avatar Image URL</label>
                <input
                  type="url"
                  value={editForm.avatar}
                  onChange={(e) => setEditForm({ ...editForm, avatar: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2 rounded-xl bg-emerald-800 text-white font-bold"
                >
                  {updating ? 'Saving...' : 'Save Profile'}
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
