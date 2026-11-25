'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, MapPin, Mail, Phone, ExternalLink, Heart } from 'lucide-react';
import { JHARKHAND_DISTRICTS } from '@/lib/constants';

import { Logo } from '@/components/Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-emerald-900/40 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <Logo variant="badge" size="lg" showTagline={false} />
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Jan<span className="text-emerald-400">Samadhan</span></h3>
              <p className="text-[10px] font-semibold text-amber-400 uppercase tracking-widest">People • Ideas • Solutions</p>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              "A digital crowdsourcing platform connecting citizens, universities and industry to identify, solve and implement real world societal challenges in Jharkhand."
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Government of Jharkhand · Ranchi Secretariat</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Platform Links</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/challenges" className="hover:text-emerald-400 transition-colors">Explore Challenges</Link></li>
              <li><Link href="/challenges/new" className="hover:text-emerald-400 transition-colors">Report a Problem</Link></li>
              <li><Link href="/solutions" className="hover:text-emerald-400 transition-colors">Submit Solutions</Link></li>
              <li><Link href="/universities" className="hover:text-emerald-400 transition-colors">Jharkhand University Network</Link></li>
              <li><Link href="/industry" className="hover:text-emerald-400 transition-colors">Corporate CSR & Mentorship</Link></li>
              <li><Link href="/collaborate" className="hover:text-emerald-400 transition-colors">Find Project Collaborators</Link></li>
              <li><Link href="/leaderboard" className="hover:text-emerald-400 transition-colors">Impact Leaderboards & Badges</Link></li>
            </ul>
          </div>

          {/* Jharkhand Districts Directory */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Jharkhand 24 Districts</h4>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-slate-400">
              {JHARKHAND_DISTRICTS.slice(0, 14).map((d) => (
                <Link key={d} href={`/challenges?district=${d}`} className="hover:text-emerald-300 truncate">
                  • {d}
                </Link>
              ))}
              <span className="text-emerald-400 font-medium">+10 More</span>
            </div>
          </div>

          {/* Contact & Helplines */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Civic Helpline & Support</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400" />
                <span>support@jansamadhan.jharkhand.gov.in</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Toll-Free Helpline: 1800-345-6789</span>
              </div>
              <div className="pt-2">
                <span className="text-[11px] bg-emerald-950 text-emerald-300 border border-emerald-800/80 px-2.5 py-1 rounded inline-block">
                  Jharkhand Department of Higher Education & Innovation
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} JanSamadhan Jharkhand. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="hover:underline">Terms of Service</Link>
            <span className="flex items-center gap-1 text-slate-400">
              Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Jharkhand
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
