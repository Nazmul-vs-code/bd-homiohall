import React from 'react';
import { Link } from 'react-router-dom';
import { Chamber } from '../types.js';
import {
  MapPin,
  Clock,
  Calendar,
  Phone,
  Navigation,
  CheckCircle2,
  PhoneCall,
  AlertCircle,
  Building,
  Shield
} from 'lucide-react';

interface ChambersPageProps {
  chambers: Chamber[];
  onOpenAppointment: (preferredChamber?: string) => void;
}

export const ChambersPage: React.FC<ChambersPageProps> = ({
  chambers,
  onOpenAppointment
}) => {
  const daysBn = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
  const todayBn = daysBn[new Date().getDay()];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white py-14 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-2 text-xs text-emerald-300 mb-3">
            <Link to="/" className="hover:text-white transition">হোম</Link>
            <span>/</span>
            <span className="text-white font-medium">চেম্বার ও সময়সূচী</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-3">
            আমাদের চেম্বারসমূহ ও রোগী দেখার সময়
          </h1>
          <p className="text-emerald-200 text-sm sm:text-base max-w-2xl leading-relaxed">
            চাঁদপুরের মতলব ও হাজীগঞ্জ—উভয় চেম্বারেই ডা. তামজীদ হোসেন নিয়মিত রোগী দেখেন। সরাসরি সাক্ষাতের পূর্বে হটলাইনে সিরিয়াল নেওয়া বাঞ্ছনীয়।
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Today status banner */}
        <div className="mb-10 bg-emerald-800 text-white p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
            <div>
              <span className="text-xs text-emerald-200">আজকের দিন: </span>
              <span className="text-sm font-bold text-white">{todayBn}</span>
            </div>
          </div>
          <div className="text-xs text-emerald-100 text-center sm:text-right">
            <span>জরুরি বা আজকের সিরিয়ালের জন্য সরাসরি কল করুন: </span>
            <a href="tel:+8801714990001" className="font-sans-en font-bold text-white underline hover:text-emerald-200">
              01714-990001
            </a>
          </div>
        </div>

        {/* Chambers Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {chambers.map((chamber) => {
            const isOpenToday = chamber.visitingDaysBn?.includes(todayBn) || chamber.visitingDaysBn?.includes('প্রতিদিন');

            return (
              <div
                key={chamber.id}
                className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  {/* Top bar */}
                  <div className="bg-emerald-900 text-white p-6 flex items-start justify-between gap-4">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-800 text-emerald-200 text-[11px] font-bold mb-2">
                        <Building className="w-3 h-3" />
                        <span>বাংলাদেশ হোমিও হল</span>
                      </div>
                      <h3 className="text-2xl font-bold text-white">{chamber.nameBn}</h3>
                      {chamber.nameEn && (
                        <p className="text-xs text-emerald-300 font-sans-en mt-0.5">{chamber.nameEn}</p>
                      )}
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        isOpenToday
                          ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/40'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isOpenToday ? '• আজ রোগী দেখা হবে' : '• পরবর্তী সূচি অনুযায়ী'}
                    </span>
                  </div>

                  {/* Chamber details */}
                  <div className="p-6 space-y-6">
                    {/* Address */}
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">ঠিকানা:</span>
                        <p className="text-sm font-semibold text-slate-800 mt-0.5">{chamber.addressBn}</p>
                        {chamber.addressEn && (
                          <p className="text-xs text-slate-500 font-sans-en mt-0.5">{chamber.addressEn}</p>
                        )}
                      </div>
                    </div>

                    {/* Visiting Days & Hours */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                      <div className="flex items-start gap-2.5">
                        <Calendar className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-1" />
                        <div>
                          <span className="text-[11px] font-bold text-slate-500 block">রোগী দেখার দিন:</span>
                          <span className="text-xs font-bold text-slate-900">{chamber.visitingDaysBn}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <Clock className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-1" />
                        <div>
                          <span className="text-[11px] font-bold text-slate-500 block">রোগী দেখার সময়:</span>
                          <span className="text-xs font-bold text-slate-900">{chamber.visitingHoursBn}</span>
                        </div>
                      </div>
                    </div>

                    {/* Hotlines */}
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">চেম্বার হটলাইন:</span>
                        <div className="flex items-center gap-3 font-sans-en font-bold text-sm text-slate-800 mt-0.5">
                          <a href={`tel:${chamber.phone || '+8801714990001'}`} className="hover:text-emerald-700 transition">
                            {chamber.phone || '+88 01714-990001'}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="p-6 bg-slate-50/80 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => onOpenAppointment(chamber.nameBn)}
                    className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>এই চেম্বারের সিরিয়াল নিন</span>
                  </button>

                  <a
                    href={`tel:${chamber.phone || '+8801714990001'}`}
                    className="py-3 px-5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs sm:text-sm border border-slate-300 flex items-center justify-center gap-2 transition"
                  >
                    <PhoneCall className="w-4 h-4 text-emerald-700" />
                    <span>কল করুন</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Patient visiting instructions */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
            <Shield className="w-4 h-4 text-emerald-700" />
            <span>রোগীদের জন্য জরুরি পরামর্শ ও তথ্য</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            চেম্বারে আসার পূর্বে করণীয়
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>পূর্বের প্রেসক্রিপশন ও মেডিকেল টেস্ট রিপোর্ট সঙ্গে আনুন।</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>রোগীর বিস্তারিত লক্ষণ ও সমস্যার শুরু সম্পর্কে স্পষ্ট ধারণা দিন।</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>সরাসরি সাক্ষাতের আগে হটলাইনে কল করে সিরিয়াল নম্বর সংগ্রহ করুন।</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>দূরবর্তী রোগীদের ক্ষেত্রে প্রয়োজনে টেলিমেডিসিন পরামর্শ নেওয়া যেতে পারে।</span>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
};
