import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Treatment, Chamber, DoctorProfile } from '../types.js';
import {
  Calendar,
  Phone,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Clock,
  MapPin,
  Sparkles,
  Award,
  ChevronRight,
  Maximize2,
  X,
  Stethoscope,
  HeartPulse,
  Share2,
  ChevronLeft
} from 'lucide-react';

interface ServiceDetailPageProps {
  treatments: Treatment[];
  chambers: Chamber[];
  doctors?: DoctorProfile[];
  onOpenAppointment: (serviceName?: string, chamberName?: string) => void;
}

// Curated contextual medical & clinical homeopathy galleries for each service condition
const serviceGalleries: Record<string, string[]> = {
  't-1': [
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80'
  ],
  't-2': [
    'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80'
  ],
  't-3': [
    'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80'
  ],
  't-4': [
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80'
  ],
  't-5': [
    'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1512290900672-1f5597753e15?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80'
  ],
  't-6': [
    'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80'
  ],
  't-7': [
    'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80'
  ],
  't-8': [
    'https://images.unsplash.com/photo-1583912267670-6575ad4e84b2?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=1200&q=80'
  ],
  't-9': [
    'https://images.unsplash.com/photo-1512290900672-1f5597753e15?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80'
  ],
  't-10': [
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80'
  ],
  't-11': [
    'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=1200&q=80'
  ],
  't-12': [
    'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1512290900672-1f5597753e15?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80'
  ],
  't-13': [
    'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=1200&q=80'
  ]
};

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({
  treatments,
  chambers,
  doctors = [],
  onOpenAppointment
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find treatment by id or fallback search
  const treatment = treatments.find((t) => t.id === id) || treatments.find((t) => t.id?.toLowerCase() === id?.toLowerCase());

  // Image list preparation: collect all images from treatment + tailored gallery
  const allImages: string[] = React.useMemo(() => {
    if (!treatment) return [];
    const set = new Set<string>();
    if (treatment.imageUrl) set.add(treatment.imageUrl);
    if (treatment.images && Array.isArray(treatment.images)) {
      treatment.images.forEach(img => { if (img) set.add(img); });
    }
    
    // Add curated images for this service ID
    const curated = serviceGalleries[treatment.id];
    if (curated && Array.isArray(curated)) {
      curated.forEach(img => set.add(img));
    }

    // Fallback medical images if less than 3 images exist
    if (set.size < 3) {
      set.add('https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80');
      set.add('https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80');
      set.add('https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=1200&q=80');
    }
    return Array.from(set);
  }, [treatment]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveImageIndex(0);
  }, [id]);

  if (!treatment) {
    return (
      <div className="bg-slate-50 min-h-[70vh] flex items-center justify-center p-4">
        <div className="bg-white p-8 sm:p-12 rounded-2xl border border-slate-200 text-center max-w-md w-full shadow-sm">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">চিকিৎসা সেবাটি পাওয়া যায়নি</h2>
          <p className="text-slate-600 text-sm mb-6">
            আপনি যে সেবাটি খুঁজছেন তা হয়তো সরানো হয়েছে অথবা লিংকটি সঠিক নয়।
          </p>
          <Link
            to="/services"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>সকল চিকিৎসাসমূহে ফিরে যান</span>
          </Link>
        </div>
      </div>
    );
  }

  // Related treatments
  const relatedTreatments = treatments
    .filter((t) => t.id !== treatment.id && (t.category === treatment.category || t.isActive))
    .slice(0, 3);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${treatment.titleBn} - বাংলাদেশ হোমিও হল`,
        text: treatment.descriptionBn,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* Top Breadcrumb & Page Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white pt-8 pb-12 px-4 sm:px-6 lg:px-8 border-b border-emerald-800/50">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-emerald-300 mb-4 flex-wrap">
            <Link to="/" className="hover:text-white transition">হোম</Link>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-500" />
            <Link to="/services" className="hover:text-white transition">চিকিৎসাসমূহ</Link>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-white font-medium truncate max-w-xs">{treatment.titleBn}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 text-emerald-200 border border-emerald-600/40 text-xs font-semibold mb-3">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>{treatment.category || 'বিশেষায়িত হোমিওপ্যাথিক চিকিৎসা'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                {treatment.titleBn}
              </h1>
              {treatment.titleEn && (
                <p className="text-emerald-300 font-sans-en text-sm sm:text-base mt-1">
                  {treatment.titleEn}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-2 transition border border-white/20"
                title="শেয়ার করুন"
              >
                <Share2 className="w-4 h-4" />
                <span>{copiedLink ? 'লিংক কপি হয়েছে!' : 'শেয়ার করুন'}</span>
              </button>

              <button
                onClick={() => onOpenAppointment(treatment.titleBn)}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>সিরিয়াল বুক করুন</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (7/12 on large screen): Image Showcase & Detailed Clinical Info */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            
            {/* 1. All Images Interactive Showcase */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                  <h2 className="text-sm sm:text-base font-bold text-slate-900">
                    চিকিৎসা ও ক্লিনিক্যাল ছবির গ্যালারি ({allImages.length}টি ছবি)
                  </h2>
                </div>
                <span className="text-xs text-slate-400">
                  ছবি {activeImageIndex + 1} / {allImages.length}
                </span>
              </div>

              {/* Main Featured Large Image View */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-[16/10] sm:aspect-[16/9] shadow-inner group">
                <img
                  src={allImages[activeImageIndex]}
                  alt={`${treatment.titleBn} - ছবি ${activeImageIndex + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Dark Gradient Overlay for Badging */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                {/* Lightbox trigger button */}
                <button
                  onClick={() => setIsLightboxOpen(true)}
                  className="absolute bottom-4 right-4 px-3 py-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white text-xs font-medium backdrop-blur-sm flex items-center gap-1.5 transition shadow-sm"
                  aria-label="বড় আকারে দেখুন"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>পূর্ণ স্ক্রিন ভিউ</span>
                </button>

                {/* Navigation Arrows on large image */}
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1))}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-sm transition"
                      aria-label="পূর্ববর্তী ছবি"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setActiveImageIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-sm transition"
                      aria-label="পরবর্তী ছবি"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-emerald-900/80 text-white text-xs font-semibold backdrop-blur-sm border border-emerald-600/40">
                    {treatment.titleBn}
                  </span>
                </div>
              </div>

              {/* Thumbnails Strip */}
              {allImages.length > 1 && (
                <div className="mt-4 flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative flex-shrink-0 w-20 h-16 sm:w-24 sm:h-18 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        activeImageIndex === idx
                          ? 'border-emerald-600 ring-2 ring-emerald-600/30 scale-105'
                          : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`থাম্বনেইল ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {activeImageIndex === idx && (
                        <div className="absolute inset-0 bg-emerald-600/10" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Detailed Clinical Description */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-emerald-700" />
                  <span>চিকিৎসার বিবরণ ও নিরাময় পদ্ধতি</span>
                </h3>
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {treatment.descriptionBn}
                </p>
                {treatment.descriptionEn && (
                  <p className="text-slate-500 font-sans-en text-xs sm:text-sm leading-relaxed mt-3 pt-3 border-t border-slate-100">
                    {treatment.descriptionEn}
                  </p>
                )}
              </div>

              {/* Key Homeopathic Principles & Safety */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                  <div className="flex items-center gap-2.5 text-emerald-950 font-bold text-sm mb-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>১০০% প্রাকৃতিক ও পার্শ্বপ্রতিক্রিয়াহীন</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    কোনোরূপ ক্ষতিকারক কেমিক্যাল বা পার্শ্বপ্রতিক্রিয়া ছাড়া শরীরের স্বাভাবিক প্রতিরোধ ক্ষমতা জাগিয়ে দীর্ঘস্থায়ী আরোগ্য নিশ্চিত করা হয়।
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100">
                  <div className="flex items-center gap-2.5 text-blue-950 font-bold text-sm mb-1.5">
                    <Award className="w-4 h-4 text-blue-700" />
                    <span>খাঁটি জার্মান ঔষধের ব্যবহার</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    আমরা জার্মানির স্বনামধন্য প্রস্তুতকারক (Schwabe / Dr. Reckeweg) এর সরাসরি আমদানিকৃত সর্বোচ্চ মানের মূল ওষুধ ব্যবহার করি।
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100">
                  <div className="flex items-center gap-2.5 text-amber-950 font-bold text-sm mb-1.5">
                    <HeartPulse className="w-4 h-4 text-amber-700" />
                    <span>ব্যক্তিগতকৃত কেস হিস্ট্রি বিশ্লেষণ</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    রোগীর মানসিক অবস্থা, খাদ্যাভ্যাস ও শারীরিক ধাত অনুযায়ী স্বতন্ত্র ওষুধ ও মাত্রা নির্ধারণ করা হয়।
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100">
                  <div className="flex items-center gap-2.5 text-purple-950 font-bold text-sm mb-1.5">
                    <CheckCircle2 className="w-4 h-4 text-purple-700" />
                    <span>অপারেশন ছাড়া স্থায়ী সুফল</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    পাইলস, টনসিল, পলিপাস বা সিস্টের মতো ক্ষেত্রে অপ্রয়োজনীয় অস্ত্রোপচার এড়িয়ে প্রাকৃতিক উপশম নিশ্চিত করা হয়।
                  </p>
                </div>
              </div>

              {/* Patient Guidelines */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80">
                <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-700" />
                  <span>রোগীর প্রতি গুরুত্বপূর্ণ পরামর্শ ও করণীয়</span>
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-700 font-bold">•</span>
                    <span>সাক্ষাতের সময় পূর্ববর্তী মেডিকেল টেস্ট রিপোর্ট, প্রেসক্রিপশন ও ওষুধের বিবরণ সাথে নিয়ে আসুন।</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-700 font-bold">•</span>
                    <span>সরাসরি চেম্বারে আসার পূর্বে অনলাইন বা ফোন কলের মাধ্যমে সিরিয়াল নম্বর ও সময়সূচি নিশ্চিত করুন।</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-700 font-bold">•</span>
                    <span>ঔষধ সেবনের নিয়ম ও খাদ্যাভ্যাসের নির্দেশাবলী চিকিৎসকের পরামর্শ অনুযায়ী অক্ষরে অক্ষরে মেনে চলুন।</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* 3. Doctors Available for this Service */}
            {doctors && doctors.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      পরামর্শ ও চিকিৎসাপ্রদানকারী অভিজ্ঞ চিকিৎসকবৃন্দ
                    </h3>
                    <p className="text-xs text-slate-500">
                      সরাসরি সাক্ষাৎ ও তত্ত্বাবধানে সেবা নিতে পারেন
                    </p>
                  </div>
                  <Link
                    to="/doctor"
                    className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
                  >
                    <span>প্রোফাইল দেখুন</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {doctors.map((doc) => (
                    <div
                      key={doc.id || doc.nameBn}
                      className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-emerald-300 transition flex items-center gap-4"
                    >
                      <img
                        src={doc.imageUrl || '/dr-tamjid-hossain.jpg'}
                        alt={doc.nameBn}
                        className="w-16 h-16 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-bold text-slate-900 truncate">
                          {doc.nameBn}
                        </h4>
                        <p className="text-[11px] text-emerald-800 font-medium truncate">
                          {doc.designationBn || doc.roleBn}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate mt-0.5">
                          {doc.registrationNo}
                        </p>
                        <button
                          onClick={() => onOpenAppointment(treatment.titleBn, doc.nameBn)}
                          className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700"
                        >
                          <span>এই চিকিৎসকের সিরিয়াল নিন</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Column (5/12 on large screen): Sticky Appointment & Chamber Widget */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6 lg:sticky lg:top-24">
            
            {/* Quick Serial Booking Card */}
            <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 text-white rounded-3xl p-6 shadow-xl border border-emerald-800 relative overflow-hidden">
              <div className="relative z-10">
                <span className="px-3 py-1 rounded-full bg-red-600 text-white text-[11px] font-bold uppercase tracking-wider inline-block mb-3">
                  অনলাইন বুকিং
                </span>
                <h3 className="text-xl font-bold mb-2">
                  এই সেবার জন্য সিরিয়াল নিন
                </h3>
                <p className="text-xs text-emerald-200 leading-relaxed mb-6">
                  &ldquo;{treatment.titleBn}&rdquo; সেবার জন্য অগ্রিম সিরিয়াল নিশ্চিত করে আপনার পছন্দের দিনে দ্রুত চিকিৎসা পরামর্শ গ্রহণ করুন।
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2.5 text-xs text-emerald-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>কোনো অগ্রিম বুকিং ফি নেই</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-emerald-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>মতলব ও হাজীগঞ্জ উভয় চেম্বারে প্রযোজ্য</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-emerald-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>এসএমএস বা ফোনে নিশ্চিতকরণ বার্তা</span>
                  </div>
                </div>

                <button
                  onClick={() => onOpenAppointment(treatment.titleBn)}
                  className="w-full py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>এখনই সিরিয়াল বুক করুন</span>
                </button>

                <div className="mt-4 pt-4 border-t border-emerald-800/80 text-center">
                  <p className="text-xs text-emerald-300 mb-2">জরুরি সিরিয়াল ও সরাসরি ফোনের জন্য:</p>
                  <a
                    href="tel:+8801714990001"
                    className="inline-flex items-center justify-center gap-2 text-sm font-bold text-white bg-white/10 hover:bg-white/20 py-2 px-4 rounded-xl transition border border-white/20 w-full"
                  >
                    <Phone className="w-4 h-4 text-emerald-400" />
                    <span>+৮৮ ০১৭১৪-৯৯০০০১</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Chamber Locations & Visiting Times */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-700" />
                <span>চেম্বার ও সাক্ষাতের সময়সূচী</span>
              </h3>

              <div className="space-y-4">
                {chambers && chambers.map((ch) => (
                  <div key={ch.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900">{ch.nameBn}</h4>
                      <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                        সরাসরি ভিজিট
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {ch.addressBn}
                    </p>
                    <div className="text-xs text-slate-700 pt-1 border-t border-slate-200/60 flex flex-col gap-1">
                      <div className="flex items-center gap-1 text-slate-500">
                        <Clock className="w-3.5 h-3.5 text-emerald-700" />
                        <span className="font-medium text-slate-800">{ch.visitingDaysBn}</span>
                      </div>
                      <div className="text-[11px] text-slate-600 pl-4">
                        {ch.visitingHoursBn}
                      </div>
                    </div>
                    <div className="pt-2 flex items-center justify-between gap-2">
                      <a
                        href={`tel:${ch.phone.replace(/[^0-9+]/g, '')}`}
                        className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3 text-red-600" />
                        <span>{ch.phone}</span>
                      </a>
                      <button
                        onClick={() => onOpenAppointment(treatment.titleBn, ch.nameBn)}
                        className="text-[11px] font-bold text-red-600 hover:text-red-700"
                      >
                        চেম্বারে সিরিয়াল &rarr;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Bottom: Related Services Grid */}
        {relatedTreatments.length > 0 && (
          <div className="mt-16 pt-12 border-t border-slate-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                  অন্যান্য বিশেষায়িত চিকিৎসা সেবাসমূহ
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  প্রাকৃতিক ও স্থায়ী আরোগ্যের জন্য আমাদের অন্যান্য সেবা অনুসন্ধান করুন
                </p>
              </div>
              <Link
                to="/services"
                className="text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
              >
                <span>সকল সেবা</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedTreatments.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => {
                    navigate(`/services/${rel.id}`);
                    window.scrollTo(0, 0);
                  }}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    {/* Card Image */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                      <img
                        src={rel.imageUrl || 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80'}
                        alt={rel.titleBn}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-900/80 backdrop-blur-sm text-white text-[11px] font-semibold">
                          {rel.category || 'হোমিওপ্যাথি'}
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <h4 className="text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors mb-1">
                        {rel.titleBn}
                      </h4>
                      {rel.titleEn && (
                        <p className="text-xs text-slate-400 font-sans-en mb-2.5">{rel.titleEn}</p>
                      )}
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {rel.descriptionBn}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-100">
                    <span className="text-xs font-bold text-emerald-800 flex items-center gap-1 group-hover:underline">
                      <span>বিস্তারিত দেখুন</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenAppointment(rel.titleBn);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition"
                    >
                      সিরিয়াল
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Full Screen Lightbox Modal for Gallery Images */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition z-10"
            aria-label="বন্ধ করুন"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            className="relative max-w-5xl w-full max-h-[85vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={allImages[activeImageIndex]}
              alt={`${treatment.titleBn} - বড় ছবি`}
              className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
            />

            <div className="mt-4 flex items-center justify-between w-full text-white px-2">
              <div className="text-sm font-semibold">
                {treatment.titleBn} (ছবি {activeImageIndex + 1} / {allImages.length})
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1))}
                  className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-xs font-semibold transition"
                >
                  পূর্ববর্তী
                </button>
                <button
                  onClick={() => setActiveImageIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0))}
                  className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-xs font-semibold transition"
                >
                  পরবর্তী
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
