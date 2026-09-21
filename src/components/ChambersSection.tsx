import React from 'react';
import { motion } from 'motion/react';
import { Chamber } from '../types.js';
import { MapPin, Clock, Calendar, Phone, Navigation, CheckCircle2 } from 'lucide-react';

interface ChambersSectionProps {
  chambers: Chamber[];
  onOpenAppointment: (preferredChamber?: string) => void;
}

export const ChambersSection: React.FC<ChambersSectionProps> = ({ chambers, onOpenAppointment }) => {
  // Check which chamber is open today based on Bangladeshi day of week
  const daysBn = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
  const todayBn = daysBn[new Date().getDay()];

  return (
    <section id="chambers" className="py-20 bg-slate-50 relative overflow-hidden border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            <MapPin className="w-3.5 h-3.5 text-emerald-700" />
            <span>চেম্বার ও রোগী দেখার সময়সূচী</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
            আমাদের চেম্বারসমূহ ও নিয়মিত সময়
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            চাঁদপুরের মতলব ও হাজীগঞ্জ—উভয় চেম্বারেই ডা. তামজীদ হোসেন নিয়মিত রোগী দেখেন। সরাসরি সাক্ষাতের পূর্বে হটলাইনে সিরিয়াল নেওয়া বাঞ্ছনীয়।
          </p>
        </div>

        {/* Chamber Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {chambers.map((chamber, index) => {
            const isOpenToday = chamber.visitingDaysBn?.includes(todayBn);

            return (
              <motion.div
                key={chamber.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-slate-100 hover:border-emerald-300 relative flex flex-col justify-between"
              >
                <div>
                  {/* Top Status & Name */}
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
                        <h3 className="text-2xl font-bold text-slate-900">
                          {chamber.nameBn}
                        </h3>
                      </div>
                      <p className="text-xs font-semibold text-slate-400 font-sans-en mt-0.5">
                        {chamber.nameEn}
                      </p>
                    </div>

                    {isOpenToday ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
                        <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                        আজ চেম্বার খোলা
                      </span>
                    ) : (
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                        নির্ধারিত দিনে খোলা
                      </span>
                    )}
                  </div>

                  {/* Address Box */}
                  <div className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-100">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                          চেম্বারের ঠিকানা
                        </h4>
                        <p className="text-sm font-semibold text-slate-900 leading-snug">
                          {chamber.addressBn}
                        </p>
                        <p className="text-xs text-slate-500 font-sans-en mt-1 leading-snug">
                          {chamber.addressEn}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Schedule Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    
                    {/* Visiting Days */}
                    <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
                      <div className="flex items-center gap-2 text-emerald-800 mb-1.5">
                        <Calendar className="w-4 h-4 text-emerald-700" />
                        <span className="text-xs font-bold uppercase tracking-wider">সাক্ষাতের দিনসমূহ</span>
                      </div>
                      <p className="text-sm font-bold text-slate-900">
                        {chamber.visitingDaysBn}
                      </p>
                      <p className="text-xs text-slate-500 font-sans-en mt-0.5">
                        {chamber.visitingDaysEn}
                      </p>
                    </div>

                    {/* Visiting Hours */}
                    <div className="p-4 rounded-xl bg-red-50/50 border border-red-100">
                      <div className="flex items-center gap-2 text-red-800 mb-1.5">
                        <Clock className="w-4 h-4 text-red-700" />
                        <span className="text-xs font-bold uppercase tracking-wider">রোগী দেখার সময়</span>
                      </div>
                      <p className="text-sm font-bold text-slate-900">
                        {chamber.visitingHoursBn}
                      </p>
                      <p className="text-xs text-slate-500 font-sans-en mt-0.5">
                        {chamber.visitingHoursEn}
                      </p>
                    </div>

                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <a
                    href={`tel:${chamber.phone}`}
                    className="inline-flex items-center gap-2 text-sm font-bold text-emerald-800 hover:text-emerald-950 font-sans-en bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200/60"
                  >
                    <Phone className="w-4 h-4 text-red-600" />
                    <span>{chamber.phone}</span>
                  </a>

                  <div className="flex items-center gap-2">
                    {chamber.mapUrl && (
                      <a
                        href={chamber.mapUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
                      >
                        <Navigation className="w-3.5 h-3.5 text-emerald-700" />
                        <span>গুগল ম্যাপ</span>
                      </a>
                    )}

                    <button
                      onClick={() => onOpenAppointment(chamber.nameBn)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition shadow-sm cursor-pointer"
                    >
                      সিরিয়াল বুক করুন
                    </button>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
