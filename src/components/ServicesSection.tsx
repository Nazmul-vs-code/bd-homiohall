import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Treatment } from '../types.js';
import {
  Sparkles,
  ArrowRight,
  Calendar,
  Image as ImageIcon
} from 'lucide-react';

interface ServicesSectionProps {
  treatments: Treatment[];
  onSelectForAppointment: (serviceName: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  treatments,
  onSelectForAppointment
}) => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Extract categories dynamically
  const categories = ['all', ...Array.from(new Set(treatments.map(t => t.category).filter(Boolean)))];

  const filteredTreatments = selectedCategory === 'all'
    ? treatments
    : treatments.filter(t => t.category === selectedCategory);

  return (
    <section id="services" className="py-20 bg-slate-50/60 relative">
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
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat === 'all' ? 'সকল সেবাসমূহ' : cat}
              </button>
            ))}
          </div>
        )}

        {/* Treatments Grid with Real Photos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTreatments.map((treatment, index) => {
            const cardImg = treatment.imageUrl || 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80';

            return (
              <motion.div
                key={treatment.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: (index % 4) * 0.06 }}
                whileHover={{ y: -4 }}
                onClick={() => {
                  navigate(`/services/${treatment.id}`);
                  window.scrollTo(0, 0);
                }}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 hover:border-emerald-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  {/* Photo Container */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={cardImg}
                      alt={treatment.titleBn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

                    {treatment.category && (
                      <span className="absolute top-3 left-3 text-[11px] font-semibold text-emerald-100 bg-emerald-950/80 backdrop-blur-sm border border-emerald-600/40 px-2.5 py-0.5 rounded-full shadow-xs">
                        {treatment.category}
                      </span>
                    )}

                    <div className="absolute bottom-2 left-3 right-3 text-white">
                      <p className="text-[10px] text-emerald-200 font-sans-en truncate font-medium">
                        {treatment.titleEn}
                      </p>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="p-5">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors mb-1.5 leading-snug">
                      {treatment.titleBn}
                    </h3>
                    <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                      {treatment.descriptionBn}
                    </p>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="p-5 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-emerald-800 group-hover:text-emerald-950 inline-flex items-center gap-1 group-hover:underline">
                    <span>বিস্তারিত</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectForAppointment(treatment.titleBn);
                    }}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Calendar className="w-3 h-3" />
                    <span>সিরিয়াল</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* View All Services Link Banner */}
        <div className="mt-12 text-center">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-bold shadow-md hover:shadow-lg transition"
          >
            <span>আমাদের সকল হোমিওপ্যাথিক চিকিৎসাসেবা দেখুন</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
};
