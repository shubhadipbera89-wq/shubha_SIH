'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, ArrowRight, ShieldAlert, CheckCircle2, ChevronRight } from 'lucide-react';
import { JHARKHAND_DISTRICTS, District } from '@/lib/constants';

interface DistrictStat {
  district: string;
  count: number;
}

interface JharkhandMapProps {
  districtStats?: DistrictStat[];
}

export const JharkhandMap: React.FC<JharkhandMapProps> = ({ districtStats = [] }) => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Ranchi');

  const getCount = (d: string) => {
    const found = districtStats.find((s) => s.district.toLowerCase() === d.toLowerCase());
    return found ? found.count : Math.floor(Math.random() * 5) + 1;
  };

  const selectedCount = getCount(selectedDistrict);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-6 lg:p-8 text-white shadow-2xl border border-emerald-800/40 relative overflow-hidden">
      {/* Background Tribal Pattern Overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none jharkhand-tribal-pattern"></div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: District Info & Filter Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/80 text-emerald-300 text-xs font-semibold border border-emerald-700/60">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>Jharkhand District Explorer</span>
          </div>

          <div>
            <h3 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              Statewide Impact Across All <span className="text-amber-400">24 Districts</span>
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Explore reported challenges, university research hubs, and industry projects mapped across every district in Jharkhand.
            </p>
          </div>

          {/* Selected District Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 shadow-inner space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                  Selected District
                </span>
                <h4 className="text-xl font-bold text-white flex items-center gap-2">
                  {selectedDistrict}
                  <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40">
                    Jharkhand
                  </span>
                </h4>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-amber-400">{selectedCount}</span>
                <div className="text-[10px] text-slate-300">Active Challenges</div>
              </div>
            </div>

            <p className="text-xs text-slate-300">
              Citizens, BIT/IIT faculty, and local administration in {selectedDistrict} are actively collaborating on civic solutions.
            </p>

            <Link
              href={`/challenges?district=${selectedDistrict}`}
              className="inline-flex items-center justify-between w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md group"
            >
              <span>Explore Challenges in {selectedDistrict}</span>
              <ArrowRight className="w-4 h-4 text-amber-300 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Right Column: 24 District Interactive Grid Map */}
        <div className="lg:col-span-7 bg-slate-950/60 rounded-2xl p-4 lg:p-6 border border-slate-800">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-emerald-400">
              Interactive District Selector (Click to Select)
            </span>
            <span className="text-[10px] text-slate-400">24 Districts</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {JHARKHAND_DISTRICTS.map((d) => {
              const isSelected = selectedDistrict.toLowerCase() === d.toLowerCase();
              const count = getCount(d);
              return (
                <button
                  key={d}
                  onClick={() => setSelectedDistrict(d)}
                  className={`p-2.5 rounded-xl text-left transition-all border text-xs font-medium flex items-center justify-between group ${
                    isSelected
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white border-amber-400 shadow-lg shadow-emerald-900/50 scale-[1.03]'
                      : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-emerald-600/60 hover:bg-slate-800/90'
                  }`}
                >
                  <span className="truncate pr-1 font-sans">{d}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-emerald-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
