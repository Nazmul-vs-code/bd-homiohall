import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  Search,
  CheckCircle2,
  Calendar,
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { TreatmentModal } from '../components/TreatmentModal.js';

interface ServicesPageProps {
  treatments: Treatment[];
  onOpenAppointment: (serviceName?: string) => void;
}

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
  Wind,
};

export const ServicesPage: React.FC<ServicesPageProps> = ({
  treatments,
  onOpenAppointment
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);

  const categories = [
    { id: 'all', label: 'সকল সেবাসমূহ' },
    { id: 'chronic', label: 'জটিল ও ক্রনিক ব্যাধি' },
    { id: 'skin', label: 'চর্ম ও অ্যালার্জি' },
    { id: 'women_child', label: 'মহিলা ও শিশু রোগ' },
    { id: 'digestive', label: 'পরিপাক ও লিভার' },
    { id: 'respiratory', label: 'শ্বাসকষ্ট ও সাইনাস' },
  ];

  const filteredTreatments = treatments.filter((t) => {
    const matchesSearch =
      t.titleBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.descriptionBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.titleEn?.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedCategory === 'all') return matchesSearch;
    return matchesSearch && (t.category === selectedCategory || !t.category);
  });

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white py-14 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-2 text-xs text-emerald-300 mb-3">
            <Link to="/" className="hover:text-white transition">হোম</Link>
            <span>/</span>
            <span className="text-white font-medium">চিকিৎসাসেবাসমূহ</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-3">
            বিশেষায়িত হোমিওপ্যাথিক চিকিৎসাসমূহ
          </h1>
          <p className="text-emerald-200 text-sm sm:text-base max-w-2xl leading-relaxed">
            পার্শ্বপ্রতিক্রিয়াহীন, বিজ্ঞানসম্মত ও স্থায়ী নিরাময়ের লক্ষ্যে ১০০% খাঁটি জার্মান ঔষধের মাধ্যমে পুরনো ও জটিল রোগের বিশেষায়িত চিকিৎসা।
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Search & Category Filter */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8 space-y-4">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="রোগ বা চিকিৎসার নাম লিখে খুঁজুন (যেমন: পাইলস, চর্মরোগ, হাঁপানি)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-xs sm:text-sm"
            />
          </div>

          {/* Categories Pills */}
          <div className="flex flex-wrap gap-2 pt-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Treatments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTreatments.map((treatment) => {
            const IconComponent = iconMap[treatment.icon] || Stethoscope;
            return (
              <div
                key={treatment.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-4 group-hover:bg-emerald-800 group-hover:text-white transition-colors">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-800 transition-colors">
                    {treatment.titleBn}
                  </h3>
                  {treatment.titleEn && (
                    <p className="text-xs text-slate-400 font-sans-en mb-3">{treatment.titleEn}</p>
                  )}
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                    {treatment.descriptionBn}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedTreatment(treatment)}
                    className="text-xs font-bold text-emerald-800 hover:text-emerald-950 transition cursor-pointer flex items-center gap-1"
                  >
                    <span>বিস্তারিত জানুন</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onOpenAppointment(treatment.titleBn)}
                    className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>সিরিয়াল নিন</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredTreatments.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-slate-700 font-bold text-base mb-1">কোনো সেবা পাওয়া যায়নি</h4>
            <p className="text-xs text-slate-500">অন্য শব্দ দিয়ে অনুসন্ধান করে চেষ্টা করুন।</p>
          </div>
        )}

      </div>

      {/* Selected Treatment Detail Modal */}
      {selectedTreatment && (
        <TreatmentModal
          treatment={selectedTreatment}
          onClose={() => setSelectedTreatment(null)}
          onSelectForAppointment={(title: string) => {
            setSelectedTreatment(null);
            onOpenAppointment(title);
          }}
        />
      )}
    </div>
  );
};
