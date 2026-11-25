'use client';

import React from 'react';
import Link from 'next/link';

interface LogoProps {
  variant?: 'badge' | 'horizontal' | 'inline' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
  withLink?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'inline',
  size = 'md',
  showTagline = true,
  className = '',
  withLink = false,
}) => {
  const sizeMap = {
    sm: { icon: 'w-9 h-9', text: 'text-lg', badge: 'w-12 h-12', tag: 'text-[9px]' },
    md: { icon: 'w-11 h-11', text: 'text-xl', badge: 'w-20 h-20', tag: 'text-[10px]' },
    lg: { icon: 'w-16 h-16', text: 'text-2xl', badge: 'w-28 h-28', tag: 'text-xs' },
    xl: { icon: 'w-24 h-24', text: 'text-4xl', badge: 'w-40 h-40', tag: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  const logoBadge = (
    <div className={`relative rounded-full overflow-hidden shadow-xl ring-2 ring-amber-400/80 shadow-emerald-950/30 group-hover:ring-amber-300 transition-all duration-300 ${currentSize.badge}`}>
      <img
        src="/logo.png"
        alt="JanSamadhan Emblem Logo"
        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
        onError={(e) => {
          // Fallback to SVG if PNG fails to load
          e.currentTarget.src = '/logo.svg';
        }}
      />
    </div>
  );

  const content = (
    <div className={`flex items-center gap-3 ${className}`}>
      {variant === 'badge' ? (
        logoBadge
      ) : variant === 'horizontal' ? (
        <div className="relative rounded-2xl overflow-hidden shadow-lg border border-amber-400/30 bg-emerald-950 p-1">
          <img
            src="/logo.png"
            alt="JanSamadhan Logo"
            className={`object-contain ${size === 'sm' ? 'h-10' : size === 'md' ? 'h-14' : size === 'lg' ? 'h-24' : 'h-36'}`}
            onError={(e) => {
              e.currentTarget.src = '/logo.svg';
            }}
          />
        </div>
      ) : variant === 'icon' ? (
        <div className={`relative rounded-full overflow-hidden shadow-md ring-2 ring-amber-400/70 ${currentSize.icon}`}>
          <img
            src="/logo.png"
            alt="JanSamadhan Icon"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = '/logo.svg';
            }}
          />
        </div>
      ) : (
        /* Inline Logo combining the Emblem badge + responsive brand text with tricolor accent */
        <div className="flex items-center gap-3">
          <div className="relative group/logo flex-shrink-0">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-500 rounded-full opacity-50 blur-xs group-hover/logo:opacity-90 transition duration-300"></div>
            <div className={`relative rounded-full overflow-hidden border-2 border-amber-400/90 bg-emerald-950 shadow-lg ${currentSize.icon}`}>
              <img
                src="/logo.png"
                alt="JanSamadhan Emblem"
                className="w-full h-full object-cover group-hover/logo:scale-110 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.src = '/logo.svg';
                }}
              />
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-1.5 leading-none">
              <span className={`font-black tracking-tight text-slate-900 ${currentSize.text}`}>
                Jan<span className="text-emerald-700">Samadhan</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-amber-100 to-amber-50 text-amber-900 px-1.5 py-0.5 rounded border border-amber-300/80 shadow-2xs">
                Jharkhand
              </span>
            </div>

            {/* Tricolor Accent Bar */}
            <div className="flex h-[3.5px] w-full rounded-full overflow-hidden my-1 shadow-2xs">
              <div className="w-1/3 bg-amber-500"></div>
              <div className="w-1/3 bg-white border-x border-slate-300"></div>
              <div className="w-1/3 bg-emerald-600"></div>
            </div>

            {showTagline && (
              <span className={`font-bold tracking-wider uppercase text-slate-500 ${currentSize.tag}`}>
                PEOPLE • IDEAS • SOLUTIONS
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );

  if (withLink) {
    return (
      <Link href="/" className="inline-block group focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
};
