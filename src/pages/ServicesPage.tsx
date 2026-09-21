import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Treatment } from '../types.js';
import {
  Search,
  Calendar,
  ArrowRight,
  HelpCircle,
  Sparkles,
  Image as ImageIcon,
  CheckCircle2
} from 'lucide-react';

interface ServicesPageProps {
  treatments: Treatment[];
  onOpenAppointment: (serviceName?: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  treatments,
  onOpenAppointment
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

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
      t.titleEn?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category?.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedCategory === 'all') return matchesSearch;
    return matchesSearch && (t.category === selectedCategory || !t.category);
  });

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white py-12 sm:py-16 px-4 relative overflow-hidden">
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
            পার্শ্বপ্রতিক্রিয়াহীন, বিজ্ঞানসম্মত ও স্থায়ী নিরাময়ের লক্ষ্যে খাঁটি জার্মান ওষুধের মাধ্যমে পুরনো ও জটিল রোগের আধুনিক চিকিৎসা ও পরামর্শ।
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Search & Category Filter */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm mb-8 space-y-4">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="রোগ বা চিকিৎসার নাম লিখে খুঁজুন (যেমন: পাইলস, চর্মরোগ, হাঁপানি, টনসিল)..."
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

        {/* Treatments Grid with Real Photos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredTreatments.map((treatment) => {
            const cardImg = treatment.imageUrl || 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80';
            const imgCount = 1 + (treatment.images?.length || 0);

            return (
              <div
                key={treatment.id}
                onClick={() => {
                  navigate(`/services/${treatment.id}`);
                  window.scrollTo(0, 0);
                }}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  {/* Photo Container */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={cardImg}
                      alt={treatment.titleBn}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Dark gradient for legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

                    {/* Category badge */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-950/85 backdrop-blur-sm text-emerald-200 text-[11px] font-semibold border border-emerald-600/40 shadow-xs">
                        {treatment.category || 'হোমিওপ্যাথিক সেবা'}
                      </span>
                    </div>

                    {/* Image indicator */}
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium flex items-center gap-1">
                        <ImageIcon className="w-3 h-3 text-emerald-300" />
                        <span>ছবি ও বিস্তারিত</span>
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <p className="text-[11px] text-emerald-200 font-sans-en font-medium truncate">
                        {treatment.titleEn}
                      </p>
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className="p-5 sm:p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-800 transition-colors leading-snug">
                      {treatment.titleBn}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-2">
                      {treatment.descriptionBn}
                    </p>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/services/${treatment.id}`);
                      window.scrollTo(0, 0);
                    }}
                    className="text-xs font-bold text-emerald-800 hover:text-emerald-950 transition cursor-pointer flex items-center gap-1 group-hover:underline"
                  >
                    <span>বিস্তারিত দেখুন</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenAppointment(treatment.titleBn);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
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
    </div>
  );
};

