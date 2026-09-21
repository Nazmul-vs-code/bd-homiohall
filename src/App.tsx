import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { SiteData, UserSession } from './types.js';
import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { FloatingContactWidget } from './components/FloatingContactWidget.js';
import { LoginModal } from './components/LoginModal.js';
import { OwnerDashboard } from './components/dashboard/OwnerDashboard.js';
import { AlertTriangle, RefreshCw, Shield, Lock, ArrowLeft } from 'lucide-react';
import { ClinicLogo } from './components/ClinicLogo.js';

// Pages
import { HomePage } from './pages/HomePage.js';
import { DoctorPage } from './pages/DoctorPage.js';
import { ServicesPage } from './pages/ServicesPage.js';
import { ChambersPage } from './pages/ChambersPage.js';
import { AppointmentPage } from './pages/AppointmentPage.js';
import { ArticlesPage } from './pages/ArticlesPage.js';
import { ContactPage } from './pages/ContactPage.js';
import { NotFoundPage } from './pages/NotFoundPage.js';

export default function App() {
  const [siteData, setSiteData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Authentication state
  const [session, setSession] = useState<UserSession | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Appointment preselection
  const [preselectedService, setPreselectedService] = useState<string>('');
  const [preselectedChamber, setPreselectedChamber] = useState<string>('');

  const navigate = useNavigate();
  const location = useLocation();

  const fetchPublicData = async () => {
    try {
      const res = await fetch('/api/public/data');
      if (!res.ok) {
        throw new Error('ক্লিনিক ডাটা লোড করতে ব্যর্থ হয়েছে');
      }
      const json = await res.json();

      let appointments = [];
      const token = localStorage.getItem('bhh_token');
      if (token) {
        try {
          const aptRes = await fetch('/api/admin/appointments', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (aptRes.ok) {
            appointments = await aptRes.json();
          }
        } catch (e) {
          // ignore
        }
      }

      setSiteData({
        settings: json.settings || json.siteSettings,
        doctor: json.doctor || json.doctorProfile,
        chambers: json.chambers || [],
        treatments: json.treatments || [],
        articles: json.articles || [],
        appointments: appointments
      });
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'ডাটাবেজ সংযোগে সমস্যা হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  // Check auth session
  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('bhh_token');
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/auth/me', { headers });
      if (res.ok) {
        const data = await res.json();
        setSession({
          user: data.user,
          expires: new Date(Date.now() + 30 * 86400000).toISOString()
        });
      }
    } catch (e) {
      // Not logged in or expired
    }
  };

  useEffect(() => {
    fetchPublicData();
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('bhh_token');
    setSession(null);
    if (location.pathname === '/dashboard') {
      navigate('/');
    }
  };

  const handleOpenAppointment = (service?: string, chamber?: string) => {
    if (service) setPreselectedService(service);
    if (chamber) setPreselectedChamber(chamber);
    navigate('/appointment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 flex flex-col items-center justify-center text-white p-6 relative overflow-hidden selection:bg-emerald-800">
        {/* Ambient background aura */}
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.2, 0.45, 0.2] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-96 h-96 rounded-full bg-emerald-500 blur-[100px] pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute w-80 h-80 rounded-full bg-red-600 blur-[90px] pointer-events-none"
        />

        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center text-center max-w-sm"
        >
          {/* Logo with gentle floating animation */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="mb-6 p-4 rounded-3xl bg-emerald-900/60 border border-emerald-600/40 backdrop-blur-md shadow-2xl"
          >
            <ClinicLogo size="lg" lightMode={true} />
          </motion.div>

          {/* Smooth ECG / Vital Line Animation */}
          <div className="w-48 h-10 flex items-center justify-center my-2 text-emerald-400">
            <svg viewBox="0 0 100 24" className="w-full h-full stroke-current fill-none stroke-2 stroke-linecap-round stroke-linejoin-round">
              <path d="M 0 12 L 25 12 L 32 4 L 40 20 L 48 2 L 56 22 L 64 12 L 100 12" className="text-emerald-400/40" />
              <motion.path
                d="M 0 12 L 25 12 L 32 4 L 40 20 L 48 2 L 56 22 L 64 12 L 100 12"
                className="text-red-500 stroke-2"
                initial={{ pathLength: 0, pathOffset: 0 }}
                animate={{ pathLength: [0.2, 0.5, 0.2], pathOffset: [0, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
              />
            </svg>
          </div>

          <motion.p
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-sm font-semibold text-emerald-100 tracking-wide mt-2"
          >
            বাংলাদেশ হোমিও হল লোড হচ্ছে...
          </motion.p>
          <p className="text-xs text-emerald-300/80 mt-1">
            ডা. তামজীদ হোসেন • আধুনিক হোমিওপ্যাথিক চিকিৎসা
          </p>

          {/* Smooth Loading Bar */}
          <div className="w-40 h-1.5 bg-emerald-950/80 rounded-full overflow-hidden mt-5 border border-emerald-800/80 shadow-inner">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-400 via-red-500 to-emerald-400 rounded-full"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  if (error || !siteData) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">সংযোগ স্থাপন করা সম্ভব হয়নি</h2>
        <p className="text-sm text-slate-600 max-w-md mb-6">{error}</p>
        <button
          onClick={() => {
            setLoading(true);
            fetchPublicData();
          }}
          className="px-6 py-2.5 rounded-xl bg-emerald-800 text-white font-bold text-sm hover:bg-emerald-900 transition flex items-center gap-2 cursor-pointer shadow-md"
        >
          <RefreshCw className="w-4 h-4" />
          <span>পুনরায় চেষ্টা করুন</span>
        </button>
      </div>
    );
  }

  // Check if viewing the dashboard route
  const isDashboardRoute = location.pathname === '/dashboard';
  if (isDashboardRoute) {
    if (session?.user?.role === 'admin') {
      return (
        <OwnerDashboard
          data={siteData}
          session={session}
          onLogout={handleLogout}
          onBackToPublicSite={() => navigate('/')}
          onRefreshData={fetchPublicData}
        />
      );
    } else {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <Shield className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">অ্যাডমিন এক্সেস প্রয়োজন</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              এই ড্যাশবোর্ডে প্রবেশের জন্য চিকিৎসক বা ক্লিনিক অ্যাডমিন হিসেবে লগইন করতে হবে। সাধারণ ইউজারদের ক্ষেত্রে অ্যাডমিন অনুমতি থাকলে প্রবেশাধিকার পাওয়া যাবে।
            </p>

            <div className="pt-2 flex flex-col gap-3">
              <button
                onClick={() => setShowLoginModal(true)}
                className="w-full py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>লগইন করুন</span>
              </button>

              <Link
                to="/"
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>প্রধান পাতায় ফিরে যান</span>
              </Link>
            </div>
          </div>

          <LoginModal
            isOpen={showLoginModal}
            onClose={() => setShowLoginModal(false)}
            onLoginSuccess={(newSession) => {
              setSession(newSession);
              setShowLoginModal(false);
            }}
          />
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans-bn selection:bg-emerald-100 selection:text-emerald-900 flex flex-col justify-between">
      
      <div>
        {/* 1. Sticky Navigation Bar with active route styling & mobile drawer */}
        <Navbar
          onOpenAppointment={() => handleOpenAppointment()}
          onOpenLogin={() => setShowLoginModal(true)}
          isOwnerLoggedIn={session?.user?.role === 'admin'}
          onGoToDashboard={() => navigate('/dashboard')}
          session={session}
          onLogout={handleLogout}
        />

        {/* 2. Multi-Route Content Area */}
        <main>
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  siteData={siteData}
                  onOpenAppointment={handleOpenAppointment}
                  preselectedService={preselectedService}
                  preselectedChamber={preselectedChamber}
                />
              }
            />

            <Route
              path="/doctor"
              element={
                <DoctorPage
                  doctor={siteData.doctor}
                  chambers={siteData.chambers}
                  onOpenAppointment={() => handleOpenAppointment()}
                />
              }
            />

            <Route
              path="/services"
              element={
                <ServicesPage
                  treatments={siteData.treatments.filter((t) => t.isActive)}
                  onOpenAppointment={(service) => handleOpenAppointment(service)}
                />
              }
            />

            <Route
              path="/chambers"
              element={
                <ChambersPage
                  chambers={siteData.chambers}
                  onOpenAppointment={(chamber) => handleOpenAppointment(undefined, chamber)}
                />
              }
            />

            <Route
              path="/appointment"
              element={
                <AppointmentPage
                  treatments={siteData.treatments.filter((t) => t.isActive)}
                  chambers={siteData.chambers}
                  preselectedService={preselectedService}
                  preselectedChamber={preselectedChamber}
                />
              }
            />

            <Route
              path="/articles"
              element={
                <ArticlesPage
                  articles={siteData.articles.filter((a) => a.isPublished)}
                />
              }
            />

            <Route
              path="/contact"
              element={
                <ContactPage
                  chambers={siteData.chambers}
                  onOpenAppointment={(chamber) => handleOpenAppointment(undefined, chamber)}
                />
              }
            />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>

      {/* 3. Global Footer with route links */}
      <Footer
        chambers={siteData.chambers}
        treatments={siteData.treatments}
        onOpenAppointment={() => handleOpenAppointment()}
        onOpenLogin={() => setShowLoginModal(true)}
      />

      {/* 4. Floating Quick Hotline & WhatsApp widget */}
      <FloatingContactWidget
        onOpenAppointment={() => handleOpenAppointment()}
      />

      {/* 5. Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={(newSession) => {
          setSession(newSession);
          setShowLoginModal(false);
        }}
      />

    </div>
  );
}
