import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SiteSettings, DoctorProfile } from '../types.js';
import { Calendar, Phone, CheckCircle2, Award, HeartHandshake, ShieldCheck, ChevronRight, ChevronLeft } from 'lucide-react';

interface HeroProps {
  settings: SiteSettings;
  doctor: DoctorProfile;
  onOpenAppointment: () => void;
}

export const Hero: React.FC<HeroProps> = ({ settings, doctor, onOpenAppointment }) => {
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [docImgError, setDocImgError] = useState(false);

  // Safe fallback images if empty
  const heroImages = (settings.heroImages && settings.heroImages.length > 0)
    ? settings.heroImages
    : [
        "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80"
      ];

  // Auto transition between the 3 images every 5 seconds
  useEffect(() => {
    if (isPaused || heroImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIdx((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, heroImages.length]);

  const goToNext = () => {
    setCurrentImageIdx((prev) => (prev + 1) % heroImages.length);
  };

  const goToPrev = () => {
    setCurrentImageIdx((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" as const }
    }
  };

  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 text-white pt-10 pb-20 lg:pt-16 lg:pb-28">
      {/* Background Decorative Ambient Mesh & Lively Breathing Glow Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-10 right-1/4 w-[500px] h-[500px] bg-emerald-500 rounded-full blur-[100px] transform -translate-y-1/2"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-5 left-5 w-[420px] h-[420px] bg-red-600 rounded-full blur-[90px]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1.2px,transparent_1.2px)] [background-size:28px_28px] opacity-20"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headlines & CTAs (7 cols) */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 flex flex-col items-start"
          >
            {/* Clinic Badge */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-emerald-400/60 text-white text-xs sm:text-sm font-medium mb-5 backdrop-blur-md shadow-lg shadow-black/40">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
              <span className="text-white font-semibold">{settings.taglineBn || "একটি জটিল ব্যাধি হোমিওপ্যাথিক চিকিৎসা কেন্দ্র"}</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 variants={itemVariants} className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.25] mb-4 drop-shadow-md">
              {settings.heroHeadlineBn || "দীর্ঘদিনের জটিল ও পুরনো রোগের বিশ্বস্ত হোমিওপ্যাথিক সমাধান"}
            </motion.h1>

            {/* Slogan & Supporting Description */}
            <motion.p variants={itemVariants} className="text-slate-100 text-base sm:text-lg leading-relaxed mb-6 max-w-2xl font-normal drop-shadow-sm">
              {settings.heroDescriptionBn || "প্রিন্সিপাল ডা. তামজীদ হোসেন এবং সহকারী অধ্যাপক ডা. মোঃ আশরাফ আলীর সরাসরি পরিচালনায় আধুনিক ও বিজ্ঞানসম্মত চিকিৎসা সেবা।"}
            </motion.p>

            {/* Key Clinical Pillars Chip row */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-2 sm:gap-3 mb-8 text-xs sm:text-sm text-white font-medium">
              <div className="flex items-center gap-1.5 bg-slate-900/80 border border-emerald-400/60 px-3.5 py-1.5 rounded-xl shadow-md backdrop-blur-md hover:border-emerald-300 transition">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="text-white">নিরাপদ ও কার্যকর</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900/80 border border-emerald-400/60 px-3.5 py-1.5 rounded-xl shadow-md backdrop-blur-md hover:border-emerald-300 transition">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="text-white">১০০% পার্শ্বপ্রতিক্রিয়াহীন</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900/80 border border-emerald-400/60 px-3.5 py-1.5 rounded-xl shadow-md backdrop-blur-md hover:border-red-400 transition">
                <HeartHandshake className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span className="text-white">মানবিক ও দীর্ঘস্থায়ী সুফল</span>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onOpenAppointment}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-base text-white bg-red-600 hover:bg-red-700 active:bg-red-800 shadow-xl shadow-red-950/40 hover:shadow-red-900/60 transition-all duration-200 cursor-pointer"
              >
                <Calendar className="w-5 h-5 text-white animate-pulse" />
                <span>{settings.ctaAppointmentTextBn || "সিরিয়াল বা সাক্ষাতের আবেদন করুন"}</span>
              </motion.button>

              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={`tel:${settings.emergencyHotline || "+8801714990001"}`}
                className="relative inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-base text-white bg-slate-900/90 hover:bg-slate-800 border border-emerald-400/60 transition-all duration-200 shadow-lg group"
              >
                <Phone className="w-5 h-5 text-red-400 group-hover:rotate-12 transition-transform duration-300" />
                <span className="font-sans-en text-white">{settings.emergencyHotline || "+88 01714-990001"}</span>
              </motion.a>
            </motion.div>

            {/* Doctor Info Card Preview in Hero with Real Photo */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="flex items-center gap-4 bg-slate-900/95 border border-emerald-500/60 rounded-2xl p-3.5 sm:p-4 backdrop-blur-md w-full max-w-xl shadow-xl"
            >
              <div className="relative flex-shrink-0">
                {!docImgError ? (
                  <img
                    src={doctor.imageUrl || "/dr-tamjid-hossain.jpg"}
                    alt={doctor.nameBn}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover object-top border-2 border-emerald-400/80 shadow-md"
                    onError={() => setDocImgError(true)}
                  />
                ) : (
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-emerald-800 border-2 border-emerald-400/80 shadow-md flex items-center justify-center text-white font-bold text-base">
                    ডা.
                  </div>
                )}
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">{doctor.nameBn}</h3>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-red-600 text-white font-sans-en shadow-sm">
                    {doctor.registrationNo}
                  </span>
                </div>
                <p className="text-amber-300 text-xs sm:text-sm truncate font-semibold mt-0.5">
                  {doctor.qualifications}
                </p>
                <p className="text-slate-200 text-[11px] sm:text-xs truncate font-normal mt-0.5">
                  {doctor.designationBn}
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: 3-Image Animated Carousel Showcase (5 cols) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-5 relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Visual Frame wrapper */}
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Decorative behind backdrop */}
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-emerald-600 to-red-600 opacity-30 blur-lg"></div>

              {/* Main Image Container */}
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-[5/4] shadow-2xl border-2 border-emerald-600/40 bg-emerald-950">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImageIdx}
                    initial={{ opacity: 0, scale: 1.06 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <img
                      src={heroImages[currentImageIdx]}
                      alt={`বাংলাদেশ হোমিও হল চিত্র ${currentImageIdx + 1}`}
                      className="w-full h-full object-cover"
                      loading="eager"
                    />
                    {/* Gradient Overlay for text readability & brand mood */}
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent"></div>
                  </motion.div>
                </AnimatePresence>

                {/* Floating Badge Inside Image (Top Left) */}
                <div className="absolute top-4 left-4 bg-slate-950/90 backdrop-blur-md border border-emerald-400/50 rounded-lg px-3 py-1.5 shadow-lg flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white tracking-wide">১৮+ বছরের বিশ্বস্ত সেবা</span>
                </div>

                {/* Floating Badge Inside Image (Bottom Left) */}
                <div className="absolute bottom-4 left-4 right-16 bg-slate-950/95 backdrop-blur-md border border-emerald-400/50 rounded-xl p-2.5 sm:p-3 shadow-lg">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-xs font-bold text-white truncate">মতলব, হাজীগঞ্জ ও চাঁদপুর চেম্বার</span>
                  </div>
                  <p className="text-[11px] text-slate-200 font-medium truncate mt-0.5">
                    সরাসরি অভিজ্ঞ চিকিৎসকবৃন্দের তত্ত্বাবধানে রোগী দেখা হয়
                  </p>
                </div>

                {/* Next / Prev Controls */}
                <button
                  onClick={goToPrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition backdrop-blur-sm"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition backdrop-blur-sm"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Carousel Indicators / Thumbnails */}
              <div className="flex items-center justify-center gap-2.5 mt-4">
                {heroImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIdx(idx)}
                    className={`transition-all duration-300 rounded-full ${
                      currentImageIdx === idx
                        ? 'w-8 h-2.5 bg-red-500 shadow-md'
                        : 'w-2.5 h-2.5 bg-emerald-700/60 hover:bg-emerald-500'
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Floating External Trust Stamp */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -right-4 sm:-right-6 bg-white text-slate-900 border-2 border-emerald-600 rounded-2xl p-3 sm:p-3.5 shadow-xl flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 flex-shrink-0">
                  <ShieldCheck className="w-6 h-6 text-emerald-700" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 leading-tight">চিকিৎসক রেজিঃ ২৬১৭৬</p>
                  <p className="text-[11px] text-slate-500">বাংলাদেশ সরকার অনুমোদিত</p>
                </div>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
