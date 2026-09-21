import React from 'react';
import { Link } from 'react-router-dom';
import { Treatment, Chamber } from '../types.js';
import { AppointmentSection } from '../components/AppointmentSection.js';
import { Calendar, Phone, Clock, ShieldCheck, MapPin, CheckCircle2, Award } from 'lucide-react';

interface AppointmentPageProps {
  treatments: Treatment[];
  chambers: Chamber[];
  preselectedService?: string;
  preselectedChamber?: string;
}

export const AppointmentPage: React.FC<AppointmentPageProps> = ({
  treatments,
  chambers,
  preselectedService,
  preselectedChamber
}) => {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white py-14 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-2 text-xs text-emerald-300 mb-3">
            <Link to="/" className="hover:text-white transition">হোম</Link>
            <span>/</span>
            <span className="text-white font-medium">অনলাইন সিরিয়াল</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-3">
            অনলাইনে ডাক্তারের সিরিয়াল বুকিং
          </h1>
          <p className="text-emerald-200 text-sm sm:text-base max-w-2xl leading-relaxed">
            ডা. তামজীদ হোসেনের মতলব ও হাজীগঞ্জ চেম্বারের জন্য নিচের ফর্মটি পূরণ করে সহজ ও দ্রুত সিরিয়াল নিশ্চিত করুন।
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Quick Hotline Call Notice */}
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-red-950">
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div>
              <span className="font-bold">জরুরি প্রয়োজনে সরাসরি ফোনে সিরিয়ালের জন্য:</span>{' '}
              <span>আমাদের হটলাইনে কল করে তাৎক্ষণিক সিরিয়াল বুকিং করতে পারেন।</span>
            </div>
          </div>
          <div className="flex items-center gap-2 font-sans-en font-bold text-red-700">
            <a href="tel:+8801714990001" className="hover:underline bg-white px-3 py-1.5 rounded-lg border border-red-300">
              01714-990001
            </a>
            <a href="tel:+8801614990001" className="hover:underline bg-white px-3 py-1.5 rounded-lg border border-red-300">
              01614-990001
            </a>
          </div>
        </div>

        {/* The Full Appointment Booking Section */}
        <AppointmentSection
          treatments={treatments}
          chambers={chambers}
          preselectedService={preselectedService}
          preselectedChamber={preselectedChamber}
        />

        {/* 3 Step Process Guide */}
        <div className="mt-12 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-6 text-center">
            অনলাইন সিরিয়াল গ্রহণের সহজ ধাপসমূহ
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center mx-auto mb-3 text-sm">
                ১
              </div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">চেম্বার ও রোগ নির্বাচন</h4>
              <p className="text-xs text-slate-500">
                মতলব বা হাজীগঞ্জ চেম্বার এবং আপনার যে রোগের চিকিৎসা চান তা নির্বাচন করুন।
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center mx-auto mb-3 text-sm">
                ২
              </div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">রোগীর তথ্য প্রদান</h4>
              <p className="text-xs text-slate-500">
                রোগীর নাম, সচল মোবাইল নম্বর এবং সংক্ষিপ্ত সমস্যার বিবরণ লিখে সাবমিট করুন।
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center mx-auto mb-3 text-sm">
                ৩
              </div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">সিরিয়াল নিশ্চিতকরণ</h4>
              <p className="text-xs text-slate-500">
                স্ক্রিনে তাৎক্ষণিক কনফার্মেশন কোড পাবেন এবং ক্লিনিক সহকারী ফোন করে সময় নিশ্চিত করবেন।
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
