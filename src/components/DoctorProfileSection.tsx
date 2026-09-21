import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { DoctorProfile } from '../types.js';
import {
  Award,
  BookOpen,
  Stethoscope,
  ShieldCheck,
  CheckCircle,
  Calendar,
  Phone,
  Camera,
  Upload,
  CreditCard,
  ArrowRight,
  HeartPulse
} from 'lucide-react';
import { DoctorPhotoUploadModal } from './DoctorPhotoUploadModal.js';
import { VisitingCardModal } from './VisitingCardModal.js';

interface DoctorProfileSectionProps {
  doctor: DoctorProfile;
  doctors?: DoctorProfile[];
  onOpenAppointment: (doctorName?: string) => void;
  onPhotoUpdated?: (url: string) => void;
}

export const DoctorProfileSection: React.FC<DoctorProfileSectionProps> = ({
  doctor,
  doctors = [],
  onOpenAppointment,
  onPhotoUpdated
}) => {
  const allDoctors = doctors && doctors.length > 0 ? doctors : [doctor];
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(
    allDoctors[0]?.id || allDoctors[0]?.nameBn || 'lead'
  );

  const activeDoc =
    allDoctors.find((d) => (d.id || d.nameBn) === selectedDoctorId) || allDoctors[0];

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isVisitingCardOpen, setIsVisitingCardOpen] = useState(false);
  const [cardDoctor, setCardDoctor] = useState<DoctorProfile>(activeDoc);

  const handlePhotoSuccess = (newUrl: string) => {
    if (onPhotoUpdated) onPhotoUpdated(newUrl);
  };

  const handleShowVisitingCard = (doc: DoctorProfile) => {
    setCardDoctor(doc);
    setIsVisitingCardOpen(true);
  };

  return (
    <section id="doctor" className="py-20 bg-white border-b border-slate-100 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-red-50 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Award className="w-3.5 h-3.5 text-emerald-700" />
            <span>অভিজ্ঞ ও বিশেষজ্ঞ চিকিৎসকবৃন্দ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
            আমাদের স্বনামধন্য চিকিৎসক প্যানেল
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            চাঁদপুর হোমিওপ্যাথিক মেডিকেল কলেজ ও হাসপাতালের অভিজ্ঞ শিক্ষক ও চিকিৎসকবৃন্দের প্রত্যক্ষ তত্ত্বাবধানে প্রতিটি রোগীকে গভীর পর্যবেক্ষণ ও ক্লাসিক্যাল চিকিৎসাসেবা প্রদান করা হয়।
          </p>
        </div>

        {/* Multi-Doctor Selector Tabs / Cards (if > 1 doctor) */}
        {allDoctors.length > 1 && (
          <div className="mb-12">
            <div className="flex items-center justify-center gap-3 overflow-x-auto pb-2">
              {allDoctors.map((doc) => {
                const isSelected = (doc.id || doc.nameBn) === (activeDoc.id || activeDoc.nameBn);
                return (
                  <button
                    key={doc.id || doc.nameBn}
                    onClick={() => setSelectedDoctorId(doc.id || doc.nameBn)}
                    className={`px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-3 transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-emerald-900 text-white border-emerald-800 shadow-md ring-2 ring-emerald-600/40'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-emerald-50 hover:text-emerald-950'
                    }`}
                  >
                    <img
                      src={doc.imageUrl || '/dr-tamjid-hossain.jpg'}
                      alt={doc.nameBn}
                      className="w-8 h-8 rounded-full object-cover object-top border border-white/50"
                    />
                    <div className="text-left">
                      <div className="flex items-center gap-1.5">
                        <span>{doc.nameBn}</span>
                        {doc.isLead && (
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${isSelected ? 'bg-red-600 text-white' : 'bg-red-100 text-red-800'}`}>
                            প্রধান
                          </span>
                        )}
                      </div>
                      <p className={`text-[10px] font-sans-en ${isSelected ? 'text-emerald-200' : 'text-slate-500'}`}>
                        {doc.designationBn}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Doctor Main Profile Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left: Doctor Portrait & Trust Badge (5 cols) */}
          <motion.div
            key={activeDoc.id || activeDoc.nameBn}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-sm lg:max-w-none">
              {/* Decorative Frame */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-emerald-600 to-emerald-800 rounded-3xl opacity-20 blur-sm transform -rotate-1"></div>
              
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 border-4 border-white shadow-2xl group">
                <img
                  src={activeDoc.imageUrl || '/dr-tamjid-hossain.jpg'}
                  alt={activeDoc.nameBn}
                  className="w-full h-[460px] object-cover object-top hover:scale-102 transition-transform duration-500"
                />
                
                {/* Registration Ribbon */}
                <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1.5 font-sans-en z-10">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{activeDoc.registrationNo}</span>
                </div>

                {/* Instant Upload Button overlay */}
                <button
                  onClick={() => setIsUploadOpen(true)}
                  className="absolute top-4 right-4 bg-black/60 hover:bg-black/85 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1.5 transition backdrop-blur-sm z-10 border border-white/20 cursor-pointer"
                  title="আসল ছবি পরিবর্তন করুন"
                >
                  <Camera className="w-3.5 h-3.5 text-emerald-400" />
                  <span>আসল ছবি</span>
                </button>

                {/* Bottom Overlay Label */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-5 text-white z-10">
                  <h3 className="text-xl font-bold">{activeDoc.nameBn}</h3>
                  {activeDoc.nameEn && (
                    <p className="text-emerald-300 text-xs font-sans-en font-medium mt-0.5">{activeDoc.nameEn}</p>
                  )}
                  <p className="text-slate-300 text-xs mt-1 font-sans-en">{activeDoc.qualifications}</p>
                </div>
              </div>

              {/* Float Experience Pill */}
              <div className="absolute -bottom-5 -right-4 bg-emerald-800 text-white rounded-xl p-3 shadow-xl border-2 border-white flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-700 flex items-center justify-center font-bold text-lg font-sans-en">
                  {activeDoc.experienceYears || 15}+
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
            key={`info-${activeDoc.id || activeDoc.nameBn}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 flex flex-col gap-6"
          >
            <div>
              <span className="text-xs font-bold text-red-600 tracking-wider uppercase">
                {activeDoc.roleBn}
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 mb-2">
                {activeDoc.nameBn}{' '}
                {activeDoc.nameEn && (
                  <span className="text-lg font-normal text-slate-500 font-sans-en">({activeDoc.nameEn})</span>
                )}
              </h3>
              <p className="text-emerald-800 font-semibold text-sm sm:text-base font-sans-en bg-emerald-50 px-3 py-1.5 rounded-lg inline-block border border-emerald-200/60 mb-4">
                {activeDoc.qualifications}
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
                  {activeDoc.designationBn}
                </p>
                {activeDoc.designation && (
                  <p className="text-[11px] text-slate-400 font-sans-en mt-0.5">
                    {activeDoc.designation}
                  </p>
                )}
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 hover:border-emerald-300 hover:bg-emerald-50/40 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-red-100 text-red-800 flex items-center justify-center mb-3">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">ক্লিনিক্যাল দায়িত্ব</h4>
                <p className="text-xs text-slate-700 mt-1 leading-snug">
                  {activeDoc.roleBn}
                </p>
                {activeDoc.role && (
                  <p className="text-[11px] text-slate-400 font-sans-en mt-0.5">
                    {activeDoc.role}
                  </p>
                )}
              </div>

            </div>

            {/* Doctor Bio */}
            <div className="bg-emerald-50/50 rounded-xl p-5 border border-emerald-100">
              <h4 className="text-sm font-bold text-emerald-950 mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>চিকিৎসা দর্শন ও রোগীর প্রতি অঙ্গীকার</span>
              </h4>
              <p className="text-slate-700 text-sm leading-relaxed">
                {activeDoc.bioBn}
              </p>
            </div>

            {/* Quick CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onOpenAppointment(activeDoc.nameBn)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-white bg-red-600 hover:bg-red-700 shadow-md hover:shadow-lg transition cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>সরাসরি সিরিয়াল নিন</span>
              </button>

              <button
                onClick={() => handleShowVisitingCard(activeDoc)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-emerald-900 bg-emerald-100 hover:bg-emerald-200 transition border border-emerald-300 cursor-pointer"
              >
                <CreditCard className="w-4 h-4 text-emerald-700" />
                <span>ভিজিটিং কার্ড দেখুন</span>
              </button>

              <Link
                to="/doctor"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-xs text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition border border-slate-200"
              >
                <span>সকল চিকিৎসকের তালিকা</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </motion.div>

        </div>
      </div>

      {/* Modals */}
      <VisitingCardModal
        isOpen={isVisitingCardOpen}
        onClose={() => setIsVisitingCardOpen(false)}
        doctor={cardDoctor}
      />

      <DoctorPhotoUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={handlePhotoSuccess}
        currentImageUrl={activeDoc.imageUrl || '/dr-tamjid-hossain.jpg'}
      />
    </section>
  );
};
