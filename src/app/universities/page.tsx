'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import {
  GraduationCap,
  MapPin,
  Search,
  BookOpen,
  Users,
  ExternalLink,
  Sparkles,
  Building,
  Plus,
  X,
  CheckCircle2,
} from 'lucide-react';
import { JHARKHAND_DISTRICTS } from '@/lib/constants';

export default function UniversitiesPage() {
  const { user } = useAuth();
  const [universities, setUniversities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [districtFilter, setDistrictFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Register Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    code: '',
    district: 'Ranchi',
    location: '',
    departments: 'Computer Science, Environmental Engineering, Civil Engineering',
    researchAreas: 'Water Treatment, Rural Renewable Energy, Mining Remediation',
    description: '',
    website: '',
    logo: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=300&q=80',
  });

  const fetchUniversities = useCallback(() => {
    setLoading(true);
    fetch(`/api/universities?district=${districtFilter}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.universities) setUniversities(data.universities);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, [districtFilter]);

  useEffect(() => {
    fetchUniversities();
  }, [fetchUniversities]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/universities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          departments: form.departments.split(',').map((s) => s.trim()).filter(Boolean),
          researchAreas: form.researchAreas.split(',').map((s) => s.trim()).filter(Boolean),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setModalOpen(false);
        fetchUniversities();
        alert('University profile registered successfully!');
      } else {
        alert(data.error || 'Failed to register university');
      }
    } catch (err: any) {
      alert(err.message || 'Error submitting registration');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredUniversities = universities.filter((u) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.district.toLowerCase().includes(q) ||
      u.description?.toLowerCase().includes(q)
    );
  });

  const canRegister = user && (user.userType === 'University Faculty' || user.role === 'ADMIN');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Header */}
        <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">
              <GraduationCap className="w-4 h-4 text-purple-600" />
              <span>Jharkhand Higher Education & Research Consortium</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Jharkhand University & Research Network
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Premier higher educational and technical institutes collaborating with citizens and industry to tackle societal challenges.
            </p>
          </div>

          {canRegister && (
            <button
              onClick={() => setModalOpen(true)}
              className="bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow flex items-center gap-2 self-start sm:self-auto shrink-0 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Register Institution</span>
            </button>
          )}
        </div>

        {/* Search & Filter bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search universities by name or research field..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 shrink-0">District:</span>
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
            >
              <option value="All">All Districts</option>
              {JHARKHAND_DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Universities Grid */}
        {loading ? (
          <div className="py-16 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-700 mx-auto"></div>
          </div>
        ) : filteredUniversities.length === 0 ? (
          <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center text-xs text-slate-500">
            No universities found matching your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUniversities.map((u) => (
              <div
                key={u.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    {u.logo ? (
                      <img
                        src={u.logo}
                        alt={u.name}
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 leading-snug">{u.name}</h3>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-500" />
                        <span>{u.district} District</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {u.description}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Key Research Verticals</span>
                    <div className="flex flex-wrap gap-1">
                      {u.researchAreas?.map((ra: string) => (
                        <span
                          key={ra}
                          className="text-[10px] font-medium bg-purple-50 text-purple-800 px-2 py-0.5 rounded-md border border-purple-100"
                        >
                          {ra}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div>Faculty: <span className="font-bold text-slate-900">{u.facultyCount || 40}+ Experts</span></div>
                    <div>Projects: <span className="font-bold text-emerald-800">{u.studentProjectsCount || 25}+ Projects</span></div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                  {u.website && (
                    <a
                      href={u.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-purple-700 font-bold hover:underline flex items-center gap-1"
                    >
                      Official Portal <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <Link
                    href={`/challenges?search=${encodeURIComponent(u.name.split(' ')[0])}`}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg transition-colors ml-auto"
                  >
                    View R&D Projects
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Registration Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-purple-600" />
                Register University / Department
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Institution Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. BIT Sindri, Dhanbad"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Code / Abbreviation *</label>
                  <input
                    type="text"
                    required
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    placeholder="e.g. BITS-DHN"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">District *</label>
                  <select
                    value={form.district}
                    onChange={(e) => setForm({ ...form, district: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {JHARKHAND_DISTRICTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Campus Location</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="e.g. Sindri, Dhanbad, Jharkhand 828123"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Departments (comma-separated)</label>
                <input
                  type="text"
                  value={form.departments}
                  onChange={(e) => setForm({ ...form, departments: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Research Areas (comma-separated)</label>
                <input
                  type="text"
                  value={form.researchAreas}
                  onChange={(e) => setForm({ ...form, researchAreas: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Institutional research focus, labs, and collaborative civic development..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Website URL</label>
                  <input
                    type="url"
                    value={form.website}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                    placeholder="https://..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Logo URL</label>
                  <input
                    type="url"
                    value={form.logo}
                    onChange={(e) => setForm({ ...form, logo: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-purple-700 text-white rounded-xl font-bold hover:bg-purple-800 disabled:opacity-50"
                >
                  {submitting ? 'Registering...' : 'Register Institution'}
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
