import React, { useState } from 'react';
import { motion } from 'motion/react';
import { DoctorProfile } from '../types.js';
import { Award, BookOpen, Stethoscope, ShieldCheck, CheckCircle, Calendar, Phone, Camera, Upload } from 'lucide-react';
import { DoctorPhotoUploadModal } from './DoctorPhotoUploadModal.js';

interface DoctorProfileSectionProps {
  doctor: DoctorProfile;
  onOpenAppointment: () => void;
  onPhotoUpdated?: (url: string) => void;
}

export const DoctorProfileSection: React.FC<DoctorProfileSectionProps> = ({ doctor, onOpenAppointment, onPhotoUpdated }) => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState(doctor.imageUrl || "/dr-tamjid-hossain.jpg");
  const [imgError, setImgError] = useState(false);

  // Sync if prop changes
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
    <section id="doctor" className="py-20 bg-white border-b border-slate-100 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-red-50 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Award className="w-3.5 h-3.5 text-emerald-700" />
            <span>প্রধান চিকিৎসক ও বিশেষজ্ঞ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
            অভিজ্ঞ ও স্বনামধন্য চিকিৎসক পরিচিতি
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            দীর্ঘদিনের চিকিৎসা ও শিক্ষকতা অভিজ্ঞতার আলোকে ডা. তামজীদ হোসেন প্রতিটি রোগীকে ব্যক্তিগত পর্যবেক্ষণ ও গবেষণালব্ধ হোমিওপ্যাথিক চিকিৎসাসেবা প্রদান করেন।
          </p>
        </div>

        {/* Doctor Main Profile Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left: Doctor Portrait & Trust Badge (5 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-sm lg:max-w-none">
              {/* Decorative Frame */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-emerald-600 to-emerald-800 rounded-3xl opacity-20 blur-sm transform -rotate-1"></div>
              
              <div className="relative rounded-2xl overflow-hidden bg-emerald-950 border-4 border-white shadow-2xl group">
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
                
                {/* Registration Ribbon */}
                <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1.5 font-sans-en z-10">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{doctor.registrationNo}</span>
                </div>

                {/* Instant Upload Button overlay */}
                <button
                  onClick={() => setIsUploadOpen(true)}
                  className="absolute top-4 right-4 bg-black/60 hover:bg-black/85 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1.5 transition backdrop-blur-sm z-10 border border-white/20"
                  title="আসল ছবি পরিবর্তন করুন"
                >
                  <Camera className="w-3.5 h-3.5 text-emerald-400" />
                  <span>আসল ছবি</span>
                </button>

                {/* Bottom Overlay Label */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-5 text-white z-10">
                  <h3 className="text-xl font-bold">{doctor.nameBn}</h3>
                  <p className="text-emerald-300 text-xs font-sans-en font-medium mt-0.5">{doctor.nameEn}</p>
                  <p className="text-slate-300 text-xs mt-1 font-sans-en">{doctor.qualifications}</p>
                </div>
              </div>

              {/* Float Experience Pill */}
              <div className="absolute -bottom-5 -right-4 bg-emerald-800 text-white rounded-xl p-3 shadow-xl border-2 border-white flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-700 flex items-center justify-center font-bold text-lg font-sans-en">
                  18+
                </div>
                <div>
                  <p className="text-xs font-bold leading-tight">বছরের সুদীর্ঘ অভিজ্ঞতা</p>
                  <p className="text-[11px] text-emerald-200">সফল ক্লিনিক্যাল প্র্যাকটিস</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Credentials, Designations & Philosophy (7 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 flex flex-col gap-6"
          >
            <div>
              <span className="text-xs font-bold text-red-600 tracking-wider uppercase">
                {doctor.roleBn}
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 mb-2">
                {doctor.nameBn} <span className="text-lg font-normal text-slate-500 font-sans-en">({doctor.nameEn})</span>
              </h3>
              <p className="text-emerald-800 font-semibold text-sm sm:text-base font-sans-en bg-emerald-50 px-3 py-1.5 rounded-lg inline-block border border-emerald-200/60 mb-4">
                {doctor.qualifications}
              </p>
            </div>

            {/* Credential Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 hover:border-emerald-300 hover:bg-emerald-50/40 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">প্রাতিষ্ঠানিক পদবী</h4>
                <p className="text-xs text-slate-700 mt-1 leading-snug">
                  {doctor.designationBn}
                </p>
                <p className="text-[11px] text-slate-400 font-sans-en mt-0.5">
                  {doctor.designation}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 hover:border-emerald-300 hover:bg-emerald-50/40 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-red-100 text-red-800 flex items-center justify-center mb-3">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">ক্লিনিক্যাল দায়িত্ব</h4>
                <p className="text-xs text-slate-700 mt-1 leading-snug">
                  {doctor.roleBn}
                </p>
                <p className="text-[11px] text-slate-400 font-sans-en mt-0.5">
                  {doctor.role}
                </p>
              </div>

            </div>

            {/* Doctor Bio */}
            <div className="bg-emerald-50/50 rounded-xl p-5 border border-emerald-100">
              <h4 className="text-sm font-bold text-emerald-950 mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>চিকিৎসা দর্শন ও রোগীর প্রতি অঙ্গীকার</span>
              </h4>
              <p className="text-slate-700 text-sm leading-relaxed">
                {doctor.bioBn}
              </p>
            </div>

            {/* Quick CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onOpenAppointment}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-white bg-red-600 hover:bg-red-700 shadow-md hover:shadow-lg transition cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>সরাসরি সাক্ষাতের সিরিয়াল নিন</span>
              </button>

              <a
                href="tel:+8801714990001"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-emerald-800 bg-emerald-100/70 hover:bg-emerald-200/70 transition border border-emerald-200"
              >
                <Phone className="w-4 h-4 text-red-600" />
                <span>হটলাইন: +88 01714-990001</span>
              </a>
            </div>

          </motion.div>

        </div>
      </div>

      <DoctorPhotoUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={handlePhotoSuccess}
        currentImageUrl={imgSrc}
      />
    </section>
  );
};
