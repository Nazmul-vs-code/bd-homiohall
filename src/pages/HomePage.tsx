import React from 'react';
import { Link } from 'react-router-dom';
import { SiteData } from '../types.js';
import { Hero } from '../components/Hero.js';
import { TrustPhilosophy } from '../components/TrustPhilosophy.js';
import { DoctorProfileSection } from '../components/DoctorProfileSection.js';
import { ServicesSection } from '../components/ServicesSection.js';
import { ChambersSection } from '../components/ChambersSection.js';
import { AppointmentSection } from '../components/AppointmentSection.js';
import { ArticlesSection } from '../components/ArticlesSection.js';
import { ArrowRight, Calendar, ShieldCheck, Stethoscope, MapPin, Award, CheckCircle2, PhoneCall } from 'lucide-react';

interface HomePageProps {
  siteData: SiteData;
  onOpenAppointment: (service?: string, chamber?: string) => void;
  preselectedService?: string;
  preselectedChamber?: string;
}

export const HomePage: React.FC<HomePageProps> = ({
  siteData,
  onOpenAppointment,
  preselectedService,
  preselectedChamber
}) => {
  return (
    <div className="space-y-0">
      {/* 1. Hero Section */}
      <Hero
        settings={siteData.settings}
        doctor={siteData.doctor}
        onOpenAppointment={() => onOpenAppointment()}
      />

      {/* 2. Quick Highlight Banner: Why Bangladesh Homoeo Hall */}
      <section className="bg-emerald-900 text-white py-6 border-y border-emerald-800 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
            <div className="flex flex-col items-center p-3 rounded-xl bg-emerald-800/50 border border-emerald-700/50">
              <Award className="w-6 h-6 text-amber-300 mb-1.5" />
              <span className="text-xl sm:text-2xl font-bold font-sans-en text-white">২৫+ বছর</span>
              <span className="text-xs text-emerald-200">চিকিৎসা ও শিক্ষকতা অভিজ্ঞতা</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-xl bg-emerald-800/50 border border-emerald-700/50">
              <Stethoscope className="w-6 h-6 text-emerald-300 mb-1.5" />
              <span className="text-xl sm:text-2xl font-bold font-sans-en text-white">প্রিন্সিপাল</span>
              <span className="text-xs text-emerald-200">চাঁদপুর হোমিও মেডিকেল কলেজ</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-xl bg-emerald-800/50 border border-emerald-700/50">
              <ShieldCheck className="w-6 h-6 text-amber-300 mb-1.5" />
              <span className="text-xl sm:text-2xl font-bold text-white">১০০% নির্ভেজাল</span>
              <span className="text-xs text-emerald-200">জার্মান হোমিওপ্যাথিক ঔষধ</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-xl bg-emerald-800/50 border border-emerald-700/50">
              <MapPin className="w-6 h-6 text-emerald-300 mb-1.5" />
              <span className="text-xl sm:text-2xl font-bold text-white">২টি চেম্বার</span>
              <span className="text-xs text-emerald-200">মতলব ও হাজীগঞ্জ, চাঁদপুর</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Treatment Philosophy & Commitments */}
      <TrustPhilosophy />

      {/* 4. Doctor Profile Section */}
      <DoctorProfileSection
        doctor={siteData.doctor}
        doctors={siteData.doctors || [siteData.doctor]}
        onOpenAppointment={(docName) => onOpenAppointment(docName)}
      />

      {/* Quick link banner to full doctor page */}
      <div className="bg-slate-50 py-4 border-b border-slate-200 text-center">
        <Link
          to="/doctor"
          className="inline-flex items-center gap-2 text-sm font-bold text-emerald-800 hover:text-emerald-950 transition hover:underline"
        >
          <span>আমাদের সকল চিকিৎসকের শিক্ষাগত যোগ্যতা, সম্মাননা, চেম্বার ও ভিজিটিং কার্ড দেখুন</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 5. Services Section */}
      <ServicesSection
        treatments={siteData.treatments.filter((t) => t.isActive)}
        onSelectForAppointment={(serviceName) => onOpenAppointment(serviceName)}
      />

      {/* Quick link to all services */}
      <div className="bg-emerald-50/60 py-4 border-b border-emerald-100 text-center">
        <Link
          to="/services"
          className="inline-flex items-center gap-2 text-sm font-bold text-emerald-800 hover:text-emerald-950 transition hover:underline"
        >
          <span>আমাদের সকল বিশেষায়িত চিকিৎসা ও রোগের তালিকা বিস্তারিত দেখুন</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 6. Chambers Section */}
      <ChambersSection
        chambers={siteData.chambers}
        onOpenAppointment={(chamberName) => onOpenAppointment(undefined, chamberName)}
      />

      {/* 7. Appointment Booking Section */}
      <AppointmentSection
        treatments={siteData.treatments.filter((t) => t.isActive)}
        chambers={siteData.chambers}
        preselectedService={preselectedService}
        preselectedChamber={preselectedChamber}
      />

      {/* 8. Articles Section */}
      <ArticlesSection articles={siteData.articles.filter((a) => a.isPublished)} />
    </div>
  );
};
