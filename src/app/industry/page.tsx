'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import {
  Building2,
  MapPin,
  ExternalLink,
  Award,
  ShieldCheck,
  HeartHandshake,
  Search,
  Plus,
  X,
} from 'lucide-react';
import { JHARKHAND_DISTRICTS } from '@/lib/constants';

export default function IndustryPage() {
  const { user } = useAuth();
  const [industries, setIndustries] = useState<any[]>([]);
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
    sector: 'Mining & Heavy Industries',
    resourcesOffered: 'CSR Grants, Pilot Testing Facilities, Engineering Mentorship',
    mentorshipAreas: 'Industrial Safety, Environmental Clean-up, Water Management',
    description: '',
    website: '',
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=300&q=80',
  });

  const fetchIndustries = useCallback(() => {
    setLoading(true);
    fetch(`/api/industry?district=${districtFilter}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.industries) setIndustries(data.industries);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, [districtFilter]);

  useEffect(() => {
    fetchIndustries();
  }, [fetchIndustries]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/industry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          resourcesOffered: form.resourcesOffered.split(',').map((s) => s.trim()).filter(Boolean),
          mentorshipAreas: form.mentorshipAreas.split(',').map((s) => s.trim()).filter(Boolean),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setModalOpen(false);
        fetchIndustries();
        alert('Industry partner profile registered successfully!');
      } else {
        alert(data.error || 'Failed to register industry partner');
      }
    } catch (err: any) {
      alert(err.message || 'Error submitting registration');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredIndustries = industries.filter((ind) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      ind.name.toLowerCase().includes(q) ||
      ind.sector?.toLowerCase().includes(q) ||
      ind.district.toLowerCase().includes(q) ||
      ind.description?.toLowerCase().includes(q)
    );
  });

  const canRegister = user && (user.userType === 'Industry Professional' || user.role === 'ADMIN');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Header */}
        <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>Corporate CSR & Industrial Development Network</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Jharkhand Industry Partners
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Leading industrial conglomerates, PSUs, and technology enterprises providing CSR funding, resources, and technical mentorship for civic innovation.
            </p>
          </div>

          {canRegister && (
            <button
              onClick={() => setModalOpen(true)}
              className="bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow flex items-center gap-2 self-start sm:self-auto shrink-0 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Register Industry Partner</span>
            </button>
          )}
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search companies by name, sector, or mentorship area..."
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

        {/* Industry Cards Grid */}
        {loading ? (
          <div className="py-16 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700 mx-auto"></div>
          </div>
        ) : filteredIndustries.length === 0 ? (
          <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center text-xs text-slate-500">
            No industry partners found matching your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredIndustries.map((ind) => (
              <div
                key={ind.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    {ind.logo ? (
                      <img
                        src={ind.logo}
                        alt={ind.name}
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                        <Building2 className="w-6 h-6" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900 leading-snug">{ind.name}</h3>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2">
                        <span className="font-semibold text-blue-700">{ind.sector}</span>
                        <span>· {ind.district} District</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {ind.description}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400">CSR Offerings & Resources</span>
                    <div className="flex flex-wrap gap-1">
                      {ind.resourcesOffered?.map((res: string) => (
                        <span
                          key={res}
                          className="text-[10px] font-medium bg-blue-50 text-blue-800 px-2 py-0.5 rounded-md border border-blue-100"
                        >
                          {res}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Mentorship Expertise</span>
                    <div className="flex flex-wrap gap-1">
                      {ind.mentorshipAreas?.map((ma: string) => (
                        <span
                          key={ma}
                          className="text-[10px] font-medium bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-100"
                        >
                          {ma}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                  {ind.website && (
                    <a
                      href={ind.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-700 font-bold hover:underline flex items-center gap-1"
                    >
                      Corporate Portal <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <Link
                    href={`/challenges?search=${encodeURIComponent(ind.name.split(' ')[0])}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg transition-colors ml-auto"
                  >
                    View Supported CSR Projects
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Register Industry Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                Register Industry Partner / CSR Unit
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Company / Enterprise Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Jindal Steel & Power Ltd"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Corporate Code / ID *</label>
                  <input
                    type="text"
                    required
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    placeholder="e.g. JSPL-JH"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">District Base *</label>
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
                <label className="block font-bold text-slate-800 mb-1">Industry Sector *</label>
                <input
                  type="text"
                  required
                  value={form.sector}
                  onChange={(e) => setForm({ ...form, sector: e.target.value })}
                  placeholder="e.g. Steel, Renewable Energy, Mining, IT & Software"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Resources Offered (comma-separated)</label>
                <input
                  type="text"
                  value={form.resourcesOffered}
                  onChange={(e) => setForm({ ...form, resourcesOffered: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Mentorship & Expertise Areas (comma-separated)</label>
                <input
                  type="text"
                  value={form.mentorshipAreas}
                  onChange={(e) => setForm({ ...form, mentorshipAreas: e.target.value })}
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
                  placeholder="Corporate sustainability commitments, CSR grant criteria, and innovation focus..."
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
                  className="px-5 py-2 bg-blue-700 text-white rounded-xl font-bold hover:bg-blue-800 disabled:opacity-50"
                >
                  {submitting ? 'Registering...' : 'Register Industry'}
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
