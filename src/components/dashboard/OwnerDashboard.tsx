import React, { useState } from 'react';
import { ClinicLogo } from '../ClinicLogo.js';
import { SiteData, UserSession } from '../../types.js';
import {
  LayoutDashboard,
  Calendar,
  Stethoscope,
  BookOpen,
  User,
  Sliders,
  MapPin,
  LogOut,
  ArrowLeft,
  CheckCircle,
  Clock,
  ExternalLink,
  Shield,
  Activity,
  RefreshCw,
  Users
} from 'lucide-react';
import { AppointmentsTab } from './AppointmentsTab.js';
import { TreatmentsTab } from './TreatmentsTab.js';
import { ArticlesTab } from './ArticlesTab.js';
import { DoctorTab } from './DoctorTab.js';
import { HeroSettingsTab } from './HeroSettingsTab.js';
import { ChambersTab } from './ChambersTab.js';
import { UsersTab } from './UsersTab.js';

interface OwnerDashboardProps {
  data: SiteData;
  session: UserSession;
  onLogout: () => void;
  onBackToPublicSite: () => void;
  onRefreshData: () => void;
}

type TabType = 'overview' | 'appointments' | 'treatments' | 'articles' | 'doctor' | 'hero' | 'chambers' | 'users';

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({
  data,
  session,
  onLogout,
  onBackToPublicSite,
  onRefreshData
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefreshData();
    setTimeout(() => setIsRefreshing(false), 400);
  };

  const token = localStorage.getItem('bhh_token') || 'local_owner_token';

  const pendingAppointments = data.appointments.filter(a => a.status === 'pending').length;
  const contactedAppointments = data.appointments.filter(a => a.status === 'contacted').length;
  const completedAppointments = data.appointments.filter(a => a.status === 'completed').length;

  const tabs = [
    { id: 'overview', label: 'ওভারভিউ', icon: LayoutDashboard },
    { id: 'appointments', label: 'সিরিয়াল ও রোগী', icon: Calendar, badge: pendingAppointments },
    { id: 'treatments', label: 'চিকিৎসা সেবাসমূহ', icon: Stethoscope },
    { id: 'articles', label: 'স্বাস্থ্য নিবন্ধ', icon: BookOpen },
    { id: 'doctor', label: 'চিকিৎসক প্রোফাইল', icon: User },
    { id: 'hero', label: 'হিরো ও ব্যানার', icon: Sliders },
    { id: 'chambers', label: 'চেম্বার ও সময়', icon: MapPin },
    { id: 'users', label: 'ইউজার ও রোল (MongoDB)', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans-bn">
      
      {/* Top Navbar */}
      <header className="bg-emerald-950 text-white border-b border-emerald-900 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToPublicSite}
              className="p-2 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 hover:text-white transition flex items-center gap-1.5 text-xs font-semibold"
              title="ওয়েবসাইটে ফিরে যান"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">পাবলিক সাইট দেখুন</span>
            </button>
            <ClinicLogo size="sm" lightMode={true} />
            <span className="hidden md:inline text-xs font-semibold px-2 py-0.5 rounded bg-emerald-800 text-emerald-300 border border-emerald-700">
              অ্যাডমিন পোর্টাল
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="p-2 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 transition"
              title="রিফ্রেশ করুন"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>

            <div className="hidden sm:flex items-center gap-2 border-l border-emerald-800 pl-3">
              <div className="w-8 h-8 rounded-full bg-emerald-800 border border-emerald-600 flex items-center justify-center font-bold text-xs">
                ডা.
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white truncate max-w-[140px]">{session.user.name}</p>
                <p className="text-[10px] text-emerald-300 font-sans-en truncate max-w-[140px]">{session.user.email}</p>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="p-2 rounded-xl bg-red-900/70 hover:bg-red-800 text-red-100 hover:text-white transition flex items-center gap-1.5 text-xs font-bold"
              title="লগআউট"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">প্রস্থান</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        
        {/* Navigation Tabs Bar */}
        <div className="bg-white rounded-2xl p-2 shadow-sm border border-slate-200 mb-8 overflow-x-auto flex items-center gap-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[11px] font-sans-en font-bold">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Rendering */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              <div 
                onClick={() => setActiveTab('appointments')}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">মোট আবেদন</span>
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <Calendar className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-slate-900 font-sans-en">{data.appointments.length}</p>
                <p className="text-xs text-slate-400 mt-1">সর্বমোট সিরিয়াল আবেদন</p>
              </div>

              <div 
                onClick={() => setActiveTab('appointments')}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">অপেক্ষমাণ (Pending)</span>
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-amber-600 font-sans-en">{pendingAppointments}</p>
                <p className="text-xs text-slate-400 mt-1">যোগাযোগ বাকি রয়েছে</p>
              </div>

              <div 
                onClick={() => setActiveTab('treatments')}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">চিকিৎসা সেবা</span>
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-slate-900 font-sans-en">{data.treatments.length}</p>
                <p className="text-xs text-slate-400 mt-1">ওয়েবসাইটে কনফিগারকৃত সেবা</p>
              </div>

              <div 
                onClick={() => setActiveTab('articles')}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">স্বাস্থ্য নিবন্ধ</span>
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
                    <BookOpen className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-slate-900 font-sans-en">{data.articles.length}</p>
                <p className="text-xs text-slate-400 mt-1">প্রকাশিত শিক্ষণীয় আর্টিকেল</p>
              </div>

            </div>

            {/* Quick Overview Section with Recent Appointments and Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Recent Patient Inquiries (8 cols) */}
              <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                  <h3 className="text-base font-bold text-slate-900">সাম্প্রতিক রোগী ও সিরিয়াল আবেদন</h3>
                  <button
                    onClick={() => setActiveTab('appointments')}
                    className="text-xs font-bold text-emerald-800 hover:text-emerald-950"
                  >
                    সকল আবেদন দেখুন →
                  </button>
                </div>

                {data.appointments.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">কোনো আবেদন এখনো নেই।</p>
                ) : (
                  <div className="space-y-3">
                    {data.appointments.slice(0, 5).map((apt) => (
                      <div
                        key={apt.id}
                        className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                      >
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{apt.fullName}</p>
                          <p className="text-slate-500 mt-0.5">সেবা: {apt.serviceName} • চেম্বার: {apt.preferredChamber || "মতলব"}</p>
                        </div>
                        <div className="text-right">
                          <a href={`tel:${apt.phone}`} className="font-bold text-emerald-800 font-sans-en block">
                            {apt.phone}
                          </a>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${
                            apt.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : apt.status === 'contacted'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {apt.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions & System Info (4 cols) */}
              <div className="lg:col-span-4 space-y-5">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <h3 className="text-base font-bold text-slate-900">সরাসরি অ্যাকশন</h3>
                  
                  <button
                    onClick={() => setActiveTab('treatments')}
                    className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 border border-slate-200/80 transition text-xs font-bold text-slate-800"
                  >
                    + নতুন চিকিৎসা সেবা যুক্ত করুন
                  </button>

                  <button
                    onClick={() => setActiveTab('articles')}
                    className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 border border-slate-200/80 transition text-xs font-bold text-slate-800"
                  >
                    + নতুন স্বাস্থ্য নিবন্ধ প্রকাশ করুন
                  </button>

                  <button
                    onClick={() => setActiveTab('hero')}
                    className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 border border-slate-200/80 transition text-xs font-bold text-slate-800"
                  >
                    হিরো ব্যানার ও ৩টি ছবি পরিবর্তন করুন
                  </button>
                </div>

                <div className="bg-emerald-950 text-emerald-100 p-5 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white">বাংলাদেশ হোমিও হল সিস্টেম</span>
                  </div>
                  <p className="text-[11px] text-emerald-300/80 leading-relaxed">
                    ডাটাবেজ কানেকশন সক্রিয়। সমস্ত পরিবর্তন পাবলিক ওয়েবসাইটে সাথে সাথে কার্যকর হয়।
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <AppointmentsTab
            appointments={data.appointments}
            onRefresh={handleRefresh}
            token={token}
          />
        )}

        {activeTab === 'treatments' && (
          <TreatmentsTab
            treatments={data.treatments}
            onRefresh={handleRefresh}
            token={token}
          />
        )}

        {activeTab === 'articles' && (
          <ArticlesTab
            articles={data.articles}
            onRefresh={handleRefresh}
            token={token}
          />
        )}

        {activeTab === 'doctor' && (
          <DoctorTab
            doctor={data.doctor}
            onRefresh={handleRefresh}
            token={token}
          />
        )}

        {activeTab === 'hero' && (
          <HeroSettingsTab
            settings={data.settings}
            onRefresh={handleRefresh}
            token={token}
          />
        )}

        {activeTab === 'chambers' && (
          <ChambersTab
            chambers={data.chambers}
            onRefresh={handleRefresh}
            token={token}
          />
        )}

        {activeTab === 'users' && (
          <UsersTab
            token={token}
          />
        )}

      </div>
    </div>
  );
};
