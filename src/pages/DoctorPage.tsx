import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DoctorProfile, Chamber } from '../types.js';
import {
  Award,
  BookOpen,
  Stethoscope,
  ShieldCheck,
  CheckCircle,
  Calendar,
  Phone,
  GraduationCap,
  Clock,
  MapPin,
  HeartPulse,
  UserCheck,
  Building,
  Sparkles,
  ArrowRight,
  Camera,
  Upload
} from 'lucide-react';
import { DoctorPhotoUploadModal } from '../components/DoctorPhotoUploadModal.js';

interface DoctorPageProps {
  doctor: DoctorProfile;
  chambers: Chamber[];
  onOpenAppointment: () => void;
  onPhotoUpdated?: (url: string) => void;
}

export const DoctorPage: React.FC<DoctorPageProps> = ({
  doctor,
  chambers,
  onOpenAppointment,
  onPhotoUpdated
}) => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState(doctor.imageUrl || "/dr-tamjid-hossain.jpg");
  const [imgError, setImgError] = useState(false);

  React.useEffect(() => {
    if (doctor.imageUrl) {
      setImgSrc(doctor.imageUrl);
      setImgError(false);
    }
  }, [doctor.imageUrl]);

  const handlePhotoSuccess = (newUrl: string) => {
    setImgSrc(newUrl);
    setImgError(false);
    if (onPhotoUpdated) onPhotoUpdated(newUrl);
  };
  return (
    <div className="bg-white min-h-screen">
      {/* Page Header / Breadcrumb */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white py-14 px-4 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-emerald-700/20 blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-2 text-xs text-emerald-300 mb-3">
            <Link to="/" className="hover:text-white transition">হোম</Link>
            <span>/</span>
            <span className="text-white font-medium">চিকিৎসক পরিচিতি</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-3">
            ডা. তামজীদ হোসেন
          </h1>
          <p className="text-emerald-200 text-sm sm:text-base max-w-2xl leading-relaxed">
            প্রিন্সিপাল, চাঁদপুর হোমিওপ্যাথিক মেডিকেল কলেজ ও হাসপাতাল। দীর্ঘ ২৫ বছরেরও বেশি সময় ধরে আধুনিক ও ক্লাসিক্যাল হোমিওপ্যাথিক চিকিৎসার মাধ্যমে হাজারো রোগীর আরোগ্য নিশ্চিত করেছেন।
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Photo & Key Profile Card */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 space-y-6">
              <div className="relative rounded-3xl overflow-hidden bg-emerald-950 border-4 border-emerald-100 shadow-xl group">
                {!imgError ? (
                  <img
                    src={imgSrc}
                    alt={doctor.nameBn}
                    className="w-full h-[460px] object-cover object-top hover:scale-102 transition-transform duration-500"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="w-full h-[460px] flex flex-col items-center justify-center p-6 text-center text-emerald-100 bg-gradient-to-b from-emerald-950 to-emerald-900">
                    <div className="w-24 h-24 rounded-full bg-emerald-800/60 border-2 border-emerald-500 flex items-center justify-center mb-4 shadow-lg">
                      <Stethoscope className="w-12 h-12 text-emerald-300" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{doctor.nameBn}</h3>
                    <p className="text-emerald-300 text-xs font-sans-en mt-1">{doctor.qualifications}</p>
                    <button
                      onClick={() => setIsUploadOpen(true)}
                      className="mt-6 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg inline-flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      <span>আসল ছবি আপলোড করুন</span>
                    </button>
                  </div>
                )}

                {/* Instant Upload Button overlay */}
                <button
                  onClick={() => setIsUploadOpen(true)}
                  className="absolute top-4 right-4 bg-black/60 hover:bg-black/85 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1.5 transition backdrop-blur-sm z-10 border border-white/20"
                  title="আসল ছবি পরিবর্তন করুন"
                >
                  <Camera className="w-3.5 h-3.5 text-emerald-400" />
                  <span>আসল ছবি</span>
                </button>

                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/95 via-transparent to-transparent flex flex-col justify-end p-6 text-white pointer-events-none">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/90 text-white text-xs font-bold w-fit mb-2 backdrop-blur-sm pointer-events-auto">
                    <Award className="w-3.5 h-3.5" />
                    <span>২৫+ বছরের চিকিৎসা ও শিক্ষকতা অভিজ্ঞতা</span>
                  </div>
                  <h3 className="text-2xl font-bold">{doctor.nameBn}</h3>
                  <p className="text-emerald-200 text-xs font-sans-en mt-0.5">{doctor.qualifications}</p>
                  <p className="text-xs text-emerald-300 font-sans-en mt-1 font-bold">রেজিস্ট্রেশন নং: {doctor.registrationNo}</p>
                </div>
              </div>

              {/* Quick Serial Booking Card */}
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200/80 shadow-sm text-center">
                <h4 className="text-base font-bold text-slate-900 mb-2">ডা. তামজীদ হোসেনের সিরিয়াল নিন</h4>
                <p className="text-xs text-slate-600 mb-5 leading-relaxed">
                  মতলব অথবা হাজীগঞ্জ চেম্বারের সরাসরি সাক্ষাৎ ও কনসালটেশনের জন্য অগ্রিম সিরিয়াল বুকিং সম্পন্ন করুন।
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    to="/appointment"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold shadow-sm transition"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>অনলাইন সিরিয়াল</span>
                  </Link>
                  <a
                    href="tel:+8801714990001"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-sm font-semibold border border-slate-300 transition"
                  >
                    <Phone className="w-4 h-4 text-emerald-700" />
                    <span>01714-990001</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Biography & Academic Leadership */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Academic Leadership */}
            <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200/70">
              <div className="flex items-center gap-2.5 text-emerald-800 font-bold text-xs uppercase tracking-wider mb-2">
                <Building className="w-4 h-4 text-emerald-700" />
                <span>একাডেমিক ও প্রাতিষ্ঠানিক নেতৃত্ব</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                চাঁদপুর হোমিওপ্যাথিক মেডিকেল কলেজ ও হাসপাতালের প্রিন্সিপাল
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed mb-6">
                ডা. তামজীদ হোসেন শুধু একজন অভিজ্ঞ চিকিৎসকই নন, তিনি চাঁদপুর হোমিওপ্যাথিক মেডিকেল কলেজ ও হাসপাতালের সম্মানিত প্রিন্সিপাল হিসেবে দীর্ঘকাল ধরে বহু নতুন চিকিৎসক তৈরিতে অগ্রণী ভূমিকা পালন করছেন। তাঁর অ্যাকাডেমিক দক্ষতা ও চিকিৎসাদর্শনের সমন্বয়ে হোমিওপ্যাথিক চিকিৎসা পেয়েছে বিজ্ঞানভিত্তিক পূর্ণতা।
              </p>

              {/* Qualifications grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs mb-1">
                    <GraduationCap className="w-4 h-4" />
                    <span>ডিগ্রি ও শিক্ষাগত অর্জন</span>
                  </div>
                  <p className="text-slate-900 font-bold text-sm font-sans-en">{doctor.qualifications}</p>
                  <p className="text-xs text-slate-500 mt-0.5">বাংলাদেশ হোমিওপ্যাথিক বোর্ড অনুমোদিত</p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs mb-1">
                    <UserCheck className="w-4 h-4" />
                    <span>সরকারি রেজিস্ট্রেশন</span>
                  </div>
                  <p className="text-slate-900 font-bold text-sm font-sans-en">Reg: {doctor.registrationNo}</p>
                  <p className="text-xs text-slate-500 mt-0.5">বৈধ নিবন্ধিত প্র্যাকটিশনার</p>
                </div>
              </div>
            </div>

            {/* Treatment Philosophy */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider">
                <HeartPulse className="w-4 h-4" />
                <span>চিকিৎসা পদ্ধতি ও রোগ আরোগ্য দর্শন</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                লক্ষণভিত্তিক গভীর রোগ-নির্ণয় ও স্থায়ী আরোগ্য
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                ডা. তামজীদ হোসেন বিশ্বাস করেন হোমিওপ্যাথিক চিকিৎসা কোনো সাময়িক উপশম নয়, এটি রোগীর সামগ্রিক শারীরিক ও মানসিক লক্ষণের সমন্বয়ে গঠিত মূল কারণের নির্মূল। প্রতিটি রোগীর জন্য পর্যাপ্ত সময় নিয়ে ব্যক্তিগত হিস্ট্রি ও কেস টেকিংয়ের মাধ্যমে জার্মানির প্রামাণ্য ওষুধ নির্বাচন করা হয়।
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                {[
                  'প্রতিটি রোগীর বিস্তারিত কেস হিস্ট্রি গ্রহণ',
                  '১০০% খাঁটি ও গুণগত মানসম্পন্ন জার্মান ঔষধ',
                  'কোনো প্রকার ক্ষতিকর পার্শ্বপ্রতিক্রিয়াহীন চিকিৎসা',
                  'পুরনো ও দীর্ঘমেয়াদী জটিল রোগে বিশেষ পারদর্শিতা',
                  'অপারেশনবিহীন বহু রোগের হোমিওপ্যাথিক সমাধান',
                  'সুলভ চিকিৎসা ব্যয় ও সহানুভূতিশীল পরামর্শ'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chambers Schedule Summary */}
            <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200/70">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                  <Clock className="w-4 h-4" />
                  <span>চেম্বার ও নিয়মিত রোগী দেখার সময়সূচী</span>
                </div>
                <Link to="/chambers" className="text-xs text-emerald-800 font-bold hover:underline flex items-center gap-1">
                  <span>বিস্তারিত চেম্বার পাতা</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {chambers.map((chamber) => (
                  <div key={chamber.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                      <MapPin className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span>{chamber.nameBn}</span>
                    </div>
                    <p className="text-xs text-slate-600 pl-6">{chamber.addressBn}</p>
                    <div className="pl-6 pt-1 text-xs space-y-1 text-slate-700">
                      <div><strong className="text-emerald-800">দিন:</strong> {chamber.visitingDaysBn}</div>
                      <div><strong className="text-emerald-800">সময়:</strong> {chamber.visitingHoursBn}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      <DoctorPhotoUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={handlePhotoSuccess}
        currentImageUrl={imgSrc}
      />
    </div>
  );
};
