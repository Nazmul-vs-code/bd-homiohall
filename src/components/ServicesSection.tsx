import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Treatment } from '../types.js';
import {
  Stethoscope,
  HeartPulse,
  Baby,
  ShieldAlert,
  Activity,
  Sparkles,
  ShieldCheck,
  PlusCircle,
  SunMedium,
  Thermometer,
  FileText,
  Zap,
  Wind,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';
import { TreatmentModal } from './TreatmentModal.js';

interface ServicesSectionProps {
  treatments: Treatment[];
  onSelectForAppointment: (serviceName: string) => void;
}

// Icon mapper
const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Stethoscope,
  HeartPulse,
  Baby,
  ShieldAlert,
  Activity,
  Sparkles,
  ShieldCheck,
  PlusCircle,
  SunMedium,
  Thermometer,
  FileText,
  Zap,
  Wind
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  treatments,
  onSelectForAppointment
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeModalTreatment, setActiveModalTreatment] = useState<Treatment | null>(null);

  // Extract categories dynamically
  const categories = ['all', ...Array.from(new Set(treatments.map(t => t.category).filter(Boolean)))];

  const filteredTreatments = selectedCategory === 'all'
    ? treatments
    : treatments.filter(t => t.category === selectedCategory);

  return (
    <section id="services" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>বিশেষায়িত চিকিৎসা সেবাসমূহ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
            জটিল ও দীর্ঘস্থায়ী রোগের পরীক্ষিত সমাধান
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            কোনরূপ পার্শ্বপ্রতিক্রিয়া ছাড়া রোগ প্রতিরোধ ক্ষমতা বৃদ্ধি এবং মূল থেকে রোগ নির্মূলে আমাদের ক্লিনিকের বিশেষায়িত সেবা ও পরামর্শসমূহ।
          </p>
        </div>

        {/* Category Pill Filters */}
        {categories.length > 2 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedCategory(cat as string)}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'all' ? 'সকল সেবাসমূহ' : cat}
              </button>
            ))}
          </div>
        )}

        {/* Treatments Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTreatments.map((treatment, index) => {
            const IconComponent = iconMap[treatment.icon] || Stethoscope;
            return (
              <motion.div
                key={treatment.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (index % 4) * 0.08 }}
                whileHover={{ y: -5 }}
                className="group bg-slate-50 hover:bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-emerald-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top row: Icon and Category tag */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 group-hover:bg-emerald-700 group-hover:text-white transition-colors duration-300 flex items-center justify-center shadow-sm">
                      <IconComponent className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    {treatment.category && (
                      <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-md">
                        {treatment.category}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-900 transition-colors mb-1 leading-snug">
                    {treatment.titleBn}
                  </h3>
                  <p className="text-xs font-semibold text-slate-400 font-sans-en mb-3 line-clamp-1">
                    {treatment.titleEn}
                  </p>

                  {/* Description */}
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-3 mb-4">
                    {treatment.descriptionBn}
                  </p>
                </div>

                {/* Bottom Actions */}
                <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setActiveModalTreatment(treatment)}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>বিস্তারিত জানুন</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onSelectForAppointment(treatment.titleBn)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-sm transition-colors cursor-pointer"
                  >
                    সিরিয়াল নিন
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* Detail Modal */}
      <TreatmentModal
        treatment={activeModalTreatment}
        onClose={() => setActiveModalTreatment(null)}
        onSelectForAppointment={onSelectForAppointment}
      />
    </section>
  );
};
