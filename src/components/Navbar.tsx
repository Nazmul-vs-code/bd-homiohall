import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { ClinicLogo } from './ClinicLogo.js';
import {
  Phone,
  Calendar,
  Menu,
  X,
  Shield,
  Lock,
  User,
  Home,
  Stethoscope,
  Sparkles,
  MapPin,
  BookOpen,
  Mail,
  ChevronRight,
  PhoneCall
} from 'lucide-react';
import { UserSession } from '../types.js';

interface NavbarProps {
  onOpenAppointment: () => void;
  onOpenLogin: () => void;
  isOwnerLoggedIn: boolean;
  onGoToDashboard: () => void;
  session?: UserSession | null;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAppointment,
  onOpenLogin,
  isOwnerLoggedIn,
  onGoToDashboard,
  session,
  onLogout
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isAdmin = session?.user?.role === 'admin';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const navLinks = [
    { name: 'প্রধান পাতা', path: '/', icon: Home },
    { name: 'চিকিৎসকবৃন্দ', path: '/doctor', icon: Stethoscope },
    { name: 'সেবাসমূহ', path: '/services', icon: Sparkles },
    { name: 'চেম্বার ও সময়সূচী', path: '/chambers', icon: MapPin },
    { name: 'অনলাইন সিরিয়াল', path: '/appointment', icon: Calendar },
    { name: 'স্বাস্থ্য নিবন্ধ', path: '/articles', icon: BookOpen },
    { name: 'যোগাযোগ', path: '/contact', icon: Mail },
  ];

  return (
    <>
      {/* 1. Top Announcement & Hotline Bar */}
      <div className="bg-emerald-950 text-emerald-100 text-xs py-2 px-4 border-b border-emerald-900/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* Medical College Affiliation */}
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
            <span className="text-emerald-300 font-medium text-[11px] sm:text-xs">
              চাঁদপুর হোমিওপ্যাথিক মেডিকেল কলেজের প্রিন্সিপালের তত্ত্বাবধানে পরিচালিত
            </span>
          </div>

          {/* Quick Hotline & Auth */}
          <div className="flex items-center gap-3 font-sans-en text-[11px] sm:text-xs">
            <div className="flex items-center gap-1.5 font-medium">
              <PhoneCall className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
              <span className="text-emerald-200">হটলাইন:</span>
              <a href="tel:+8801714990001" className="text-white hover:text-red-300 transition font-bold">
                01714-990001
              </a>
              <span className="text-emerald-700">|</span>
              <a href="tel:+8801614990001" className="text-white hover:text-red-300 transition font-bold">
                01614-990001
              </a>
            </div>

            {session?.user ? (
              <div className="flex items-center gap-2">
                {isAdmin ? (
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-1 text-[11px] bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-2.5 py-0.5 rounded transition shadow-xs"
                  >
                    <Shield className="w-3 h-3 text-emerald-300" />
                    <span>অ্যাডমিন ড্যাশবোর্ড</span>
                  </Link>
                ) : (
                  <div className="inline-flex items-center gap-1 text-[11px] bg-emerald-900 text-emerald-200 px-2 py-0.5 rounded border border-emerald-700/60">
                    <User className="w-3 h-3 text-emerald-400" />
                    <span className="truncate max-w-[100px]">{session.user.name}</span>
                  </div>
                )}

                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="text-[10px] text-emerald-400 hover:text-red-300 transition cursor-pointer"
                  >
                    লগআউট
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="inline-flex items-center gap-1 text-[11px] text-emerald-300 hover:text-white transition cursor-pointer bg-emerald-900/80 hover:bg-emerald-800 px-2 py-0.5 rounded border border-emerald-700/40"
                title="লগইন বা একাউন্ট তৈরি"
              >
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>লগইন / নিবন্ধন</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <header
        className={`sticky top-[33px] sm:top-[33px] z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/98 backdrop-blur-md shadow-md py-2.5 border-b border-slate-200'
            : 'bg-white py-3 sm:py-3.5 border-b border-slate-100 shadow-xs'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* Logo & Brand Identity */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <ClinicLogo size="md" />
          </Link>

          {/* Desktop Nav Links (Visible on Large Screens lg+) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === '/'}
                  className={({ isActive }) =>
                    `inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-emerald-100 text-emerald-900 shadow-xs font-bold'
                        : 'text-slate-700 hover:text-emerald-800 hover:bg-slate-50'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-800' : 'text-slate-400'}`} />
                      <span>{link.name}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Right CTAs */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            
            {/* Quick Hotline Call Button */}
            <a
              href="tel:+8801714990001"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 rounded-xl transition border border-slate-200"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-700" />
              <span className="font-sans-en font-bold">+88 01714-990001</span>
            </a>

            {/* Primary Appointment Button */}
            <Link
              to="/appointment"
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 shadow-sm hover:shadow-md transition-all rounded-xl cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>সিরিয়াল নিন</span>
            </Link>

            {/* Mobile / Tablet Menu Button (Visible below lg) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:text-emerald-800 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-red-600" /> : <Menu className="w-5 h-5 text-emerald-800" />}
            </button>
          </div>
        </div>

        {/* 3. Horizontal Scrollable Quick Sub-Nav for Mobile & Tablet (Always easily accessible!) */}
        <div className="lg:hidden border-t border-slate-100 bg-slate-50/90 px-3 py-1.5 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 min-w-max">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === '/'}
                  className={({ isActive }) =>
                    `inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-emerald-800 text-white shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200/80'
                    }`
                  }
                >
                  <Icon className="w-3 h-3 flex-shrink-0" />
                  <span>{link.name}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </header>

      {/* 4. Mobile Drawer Overlay & Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs lg:hidden flex flex-col justify-end">
          <div
            className="fixed inset-0"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative bg-white rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto p-6 space-y-6 z-10 border-t border-slate-200 animate-in slide-in-from-bottom duration-200">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <ClinicLogo size="sm" />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Links list */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-1 block">
                মূল মেনু ও পাতাসমূহ
              </span>
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    end={link.path === '/'}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between p-3 rounded-xl text-sm font-semibold transition ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-3">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-700' : 'text-slate-400'}`} />
                          <span>{link.name}</span>
                        </div>
                        <ChevronRight className={`w-4 h-4 ${isActive ? 'text-emerald-700' : 'text-slate-300'}`} />
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>

            {/* Serial Action CTA */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
              <div className="text-xs text-emerald-950 font-bold">
                ডা. তামজীদ হোসেনের সিরিয়াল বুকিং
              </div>
              <Link
                to="/appointment"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition"
              >
                <Calendar className="w-4 h-4" />
                <span>অনলাইন সিরিয়াল পেজে যান</span>
              </Link>
            </div>

            {/* Direct Hotlines */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                সিরিয়াল ও জরুরি হটলাইন:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-sans-en">
                <a
                  href="tel:+8801714990001"
                  className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-800 text-xs font-bold transition border border-slate-200"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-700" />
                  <span>01714-990001</span>
                </a>
                <a
                  href="tel:+8801614990001"
                  className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-800 text-xs font-bold transition border border-slate-200"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-700" />
                  <span>01614-990001</span>
                </a>
              </div>
            </div>

            {/* Auth / Dashboard link */}
            <div className="pt-2 border-t border-slate-100 text-center">
              {session?.user ? (
                <div className="space-y-2">
                  {isAdmin ? (
                    <Link
                      to="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="inline-flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold"
                    >
                      <Shield className="w-4 h-4 text-emerald-300" />
                      <span>অ্যাডমিন ম্যানেজমেন্ট ড্যাশবোর্ড</span>
                    </Link>
                  ) : (
                    <div className="text-xs text-slate-600">
                      লগইনকৃত: <strong className="text-emerald-800">{session.user.name}</strong>
                    </div>
                  )}

                  {onLogout && (
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onLogout();
                      }}
                      className="text-xs text-red-600 hover:underline cursor-pointer"
                    >
                      লগআউট করুন
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenLogin();
                  }}
                  className="inline-flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-800 text-xs font-bold border border-slate-200 cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-emerald-700" />
                  <span>লগইন / নতুন অ্যাকাউন্ট তৈরি</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
};
