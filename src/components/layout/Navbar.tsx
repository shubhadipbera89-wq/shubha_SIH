'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Shield,
  Bell,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  PlusCircle,
  Award,
  Users,
  Building2,
  GraduationCap,
  Sparkles,
  ChevronDown,
  LayoutDashboard,
  ShieldAlert,
} from 'lucide-react';

import { Logo } from '@/components/Logo';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetch('/api/notifications')
        .then((res) => res.json())
        .then((data) => {
          if (data.notifications) setNotifications(data.notifications);
        })
        .catch(console.error);
    }
  }, [user]);

  const handleMarkAllRead = async () => {
    try {
      const res = await fetch('/api/notifications', { method: 'PUT' });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Challenges', href: '/challenges' },
    { name: 'Solutions', href: '/solutions' },
    { name: 'Universities', href: '/universities' },
    { name: 'Industry', href: '/industry' },
    { name: 'Collaborate', href: '/collaborate' },
    { name: 'AI Engine', href: '/ai-dashboard' },
    { name: 'Leaderboard', href: '/leaderboard' },
    { name: 'About', href: '/about' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-sm">
      {/* Top Banner Tagline */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-emerald-50 px-4 py-1.5 text-xs text-center font-medium border-b border-emerald-700/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-emerald-200">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            Official Civic Innovation Crowdsourcing Portal of Jharkhand
          </span>
          <p className="mx-auto sm:mx-0 font-normal tracking-wide text-amber-200/90 italic">
            "A digital crowdsourcing platform connecting citizens, universities and industry to identify, solve and implement real world societal challenges"
          </p>
          <span className="hidden md:inline font-mono text-[11px] text-emerald-300">
            JHARKHAND SAMADHAN NET
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Logo withLink variant="inline" size="sm" />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200/60'
                      : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* User & Action Buttons */}
          <div className="flex items-center gap-2.5">
            {/* Report Challenge Primary CTA */}
            <Link
              href="/challenges/new"
              className="hidden sm:inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-sm hover:shadow transition-all"
            >
              <PlusCircle className="w-4 h-4 text-amber-300" />
              <span>Report Challenge</span>
            </Link>

            {user ? (
              <div className="flex items-center gap-2">
                {/* Notifications Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setNotificationsOpen(!notificationsOpen);
                      setUserDropdownOpen(false);
                    }}
                    className="p-2 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-slate-100 relative transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    {user.unreadNotifications && user.unreadNotifications > 0 ? (
                      <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                        {user.unreadNotifications}
                      </span>
                    ) : null}
                  </button>

                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                        <span className="font-semibold text-xs text-slate-900">Notifications</span>
                        <button
                          type="button"
                          onClick={handleMarkAllRead}
                          className="text-[10px] text-emerald-700 font-medium hover:underline"
                        >
                          Mark all read
                        </button>
                      </div>
                      <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-center text-xs text-slate-400">
                            No notifications yet
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <Link
                              key={n.id}
                              href={n.link || '/dashboard'}
                              onClick={() => setNotificationsOpen(false)}
                              className={`block p-3 hover:bg-slate-50 transition-colors ${
                                !n.read ? 'bg-emerald-50/50' : ''
                              }`}
                            >
                              <div className="font-medium text-xs text-slate-900">{n.title}</div>
                              <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                                {n.message}
                              </div>
                            </Link>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setUserDropdownOpen(!userDropdownOpen);
                      setNotificationsOpen(false);
                    }}
                    className="flex items-center gap-2 p-1.5 rounded-lg border border-slate-200 hover:border-emerald-300 bg-slate-50 transition-colors"
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-7 h-7 rounded-full object-cover border border-emerald-400"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                        {user.name.charAt(0)}
                      </div>
                    )}
                    <span className="text-xs font-semibold text-slate-800 hidden md:inline max-w-[100px] truncate">
                      {user.name}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <div className="font-semibold text-xs text-slate-900 truncate">{user.name}</div>
                        <div className="text-[11px] text-slate-500 truncate">{user.userType} · {user.district}</div>
                        <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 w-fit">
                          <Award className="w-3 h-3 text-amber-600" />
                          <span>Impact Score: {user.impactScore} pts</span>
                        </div>
                      </div>

                      <div className="py-1">
                        <Link
                          href="/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-800"
                        >
                          <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                          <span>My Dashboard</span>
                        </Link>
                        <Link
                          href="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-800"
                        >
                          <UserIcon className="w-4 h-4 text-emerald-600" />
                          <span>My Profile</span>
                        </Link>
                        {user.role === 'ADMIN' && (
                          <Link
                            href="/admin"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs text-rose-700 hover:bg-rose-50 font-semibold"
                          >
                            <ShieldAlert className="w-4 h-4 text-rose-600" />
                            <span>Admin Portal</span>
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-slate-100 pt-1">
                        <button
                          onClick={logout}
                          className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="text-xs font-semibold text-slate-700 hover:text-emerald-700 px-3 py-2 rounded-lg transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="text-xs font-semibold bg-emerald-800 hover:bg-emerald-900 text-white px-3.5 py-2 rounded-lg shadow-sm transition-colors"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-emerald-700"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-800"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/challenges/new"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center bg-emerald-700 text-white text-xs font-semibold py-2.5 rounded-lg shadow-sm"
            >
              + Report a Challenge
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
