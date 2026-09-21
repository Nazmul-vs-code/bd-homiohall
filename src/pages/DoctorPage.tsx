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
  CreditCard,
  Plus,
  Edit,
  Camera,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { VisitingCardModal } from '../components/VisitingCardModal.js';
import { AddEditDoctorModal } from '../components/AddEditDoctorModal.js';
import { DoctorPhotoUploadModal } from '../components/DoctorPhotoUploadModal.js';

interface DoctorPageProps {
  doctor: DoctorProfile;
  doctors?: DoctorProfile[];
  chambers: Chamber[];
  onOpenAppointment: (doctorName?: string) => void;
  onRefreshData?: () => void;
  isOwnerLoggedIn?: boolean;
}

export const DoctorPage: React.FC<DoctorPageProps> = ({
  doctor,
  doctors = [],
  chambers,
  onOpenAppointment,
  onRefreshData,
  isOwnerLoggedIn
}) => {
  // Ensure we have at least one doctor
  const allDoctors = doctors && doctors.length > 0 ? doctors : [doctor];
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(
    allDoctors[0]?.id || allDoctors[0]?.nameBn || 'lead'
  );

  // Modals state
  const [isVisitingCardOpen, setIsVisitingCardOpen] = useState(false);
  const [visitingCardDoctor, setVisitingCardDoctor] = useState<DoctorProfile>(allDoctors[0]);
  const [isAddDoctorModalOpen, setIsAddDoctorModalOpen] = useState(false);
  const [doctorToEdit, setDoctorToEdit] = useState<DoctorProfile | null>(null);

  // Photo upload modal for currently active doctor
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // The active doctor currently displayed in detail
  const activeDoctor =
    allDoctors.find((d) => (d.id || d.nameBn) === selectedDoctorId) || allDoctors[0];

  const handleOpenVisitingCard = (doc: DoctorProfile) => {
    setVisitingCardDoctor(doc);
    setIsVisitingCardOpen(true);
  };

  const handleEditDoctor = (doc: DoctorProfile) => {
    setDoctorToEdit(doc);
    setIsAddDoctorModalOpen(true);
  };

  const handleAddNewDoctor = () => {
    setDoctorToEdit(null);
    setIsAddDoctorModalOpen(true);
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
            <span className="text-white font-medium">অভিজ্ঞ চিকিৎসকবৃন্দ</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-3">
                আমাদের অভিজ্ঞ চিকিৎসক প্যানেল
              </h1>
              <p className="text-slate-100 text-sm sm:text-base max-w-2xl leading-relaxed font-normal">
                চাঁদপুর হোমিওপ্যাথিক মেডিকেল কলেজ ও হাসপাতালের শীর্ষস্থানীয় চিকিৎসকবৃন্দের সরাসরি তত্ত্বাবধানে আধুনিক ও ক্লাসিক্যাল হোমিওপ্যাথিক চিকিৎসাসেবা।
              </p>
            </div>

            {/* Admin Add Doctor Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleAddNewDoctor}
                className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg hover:shadow-red-900/40 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>নতুন চিকিৎসক যোগ করুন</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Doctors Navigation Cards Grid / Scroll */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-700" />
              <h2 className="text-xl font-bold text-slate-900">চিকিৎসক নির্বাচন করুন</h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold font-sans-en">
                {allDoctors.length} জন
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              বিস্তারিত দেখতে যে কোনো চিকিৎসকের কার্ডে ক্লিক করুন
            </p>
          </div>

          {/* Grid of Doctor Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {allDoctors.map((doc) => {
              const isSelected = (doc.id || doc.nameBn) === (activeDoctor.id || activeDoctor.nameBn);
              return (
                <div
                  key={doc.id || doc.nameBn}
                  onClick={() => setSelectedDoctorId(doc.id || doc.nameBn)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-emerald-50/70 border-emerald-600 shadow-md ring-2 ring-emerald-600/30'
                      : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="relative flex-shrink-0">
                      <img
                        src={doc.imageUrl || '/dr-tamjid-hossain.jpg'}
                        alt={doc.nameBn}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover object-top border-2 border-emerald-500 shadow-md"
                      />
                      {doc.isLead && (
                        <span className="absolute -top-2 -left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                          প্রধান
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-slate-900 leading-snug">{doc.nameBn}</h3>
                      <p className="text-xs text-emerald-800 font-semibold mt-1 truncate font-sans-en">
                        {doc.qualifications}
                      </p>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-1">
                        {doc.designationBn}
                      </p>
                      <p className="text-[11px] text-red-600 font-bold mt-1 font-sans-en">
                        {doc.registrationNo}
                      </p>
                    </div>
                  </div>

                  {/* Buttons on card */}
                  <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between gap-2 text-xs">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenVisitingCard(doc);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-900 text-white font-bold hover:bg-emerald-800 transition flex items-center gap-1.5"
                    >
                      <CreditCard className="w-3.5 h-3.5 text-amber-300" />
                      <span>ভিজিটিং কার্ড</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditDoctor(doc);
                        }}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-800 hover:bg-slate-100 transition"
                        title="তথ্য এডিট করুন"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <span className={`text-xs font-bold ${isSelected ? 'text-emerald-700' : 'text-slate-400'}`}>
                        {isSelected ? '✓ নির্বাচিত' : 'বিস্তারিত'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Doctor Detailed Profile Section */}
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left: Doctor Photo Card */}
            <div className="lg:col-span-5">
              <div className="sticky top-28 space-y-6">
                <div className="relative rounded-3xl overflow-hidden bg-slate-900 border-4 border-white shadow-xl group">
                  <img
                    src={activeDoctor.imageUrl || '/dr-tamjid-hossain.jpg'}
                    alt={activeDoctor.nameBn}
                    className="w-full h-[450px] object-cover object-top hover:scale-102 transition-transform duration-500"
                  />

                  {/* Registration Ribbon */}
                  <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1.5 font-sans-en z-10">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{activeDoctor.registrationNo}</span>
                  </div>

                  {/* Photo upload trigger */}
                  <button
                    onClick={() => setIsUploadOpen(true)}
                    className="absolute top-4 right-4 bg-black/60 hover:bg-black/85 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1.5 transition backdrop-blur-sm z-10 border border-white/20 cursor-pointer"
                    title="আসল ছবি পরিবর্তন করুন"
                  >
                    <Camera className="w-3.5 h-3.5 text-emerald-300" />
                    <span>ছবি পরিবর্তন</span>
                  </button>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-transparent flex flex-col justify-end p-6 text-white pointer-events-none">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold w-fit mb-2 backdrop-blur-sm pointer-events-auto">
                      <Award className="w-3.5 h-3.5" />
                      <span>{activeDoctor.experienceYears || 15}+ বছরের সুদীর্ঘ অভিজ্ঞতা</span>
                    </div>
                    <h3 className="text-2xl font-bold">{activeDoctor.nameBn}</h3>
                    <p className="text-amber-300 text-xs font-sans-en mt-0.5 font-semibold">
                      {activeDoctor.qualifications}
                    </p>
                    <p className="text-xs text-slate-200 mt-1">{activeDoctor.designationBn}</p>
                  </div>
                </div>

                {/* Quick Serial Booking Card */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
                  <h4 className="text-base font-bold text-slate-900 mb-1">
                    {activeDoctor.nameBn}-এর সিরিয়াল নিন
                  </h4>
                  <p className="text-xs text-slate-600 mb-5 leading-relaxed">
                    সরাসরি চেম্বারে এসে অথবা অনলাইনে সিরিয়াল বুকিং সম্পন্ন করুন।
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={() => onOpenAppointment(activeDoctor.nameBn)}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold shadow-sm transition cursor-pointer"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>অনলাইন সিরিয়াল</span>
                    </button>
                    <button
                      onClick={() => handleOpenVisitingCard(activeDoctor)}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold transition cursor-pointer"
                    >
                      <CreditCard className="w-4 h-4 text-amber-300" />
                      <span>ভিজিটিং কার্ড দেখুন</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Detailed Bio & Qualifications */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                    {activeDoctor.roleBn || 'হোমিওপ্যাথিক কনসালটেন্ট'}
                  </span>
                  {activeDoctor.isLead && (
                    <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold">
                      প্রধান চিকিৎসক
                    </span>
                  )}
                </div>
                <h2 className="text-3xl font-bold text-slate-900">
                  {activeDoctor.nameBn}{' '}
                  {activeDoctor.nameEn && (
                    <span className="text-lg font-normal text-slate-500 font-sans-en">
                      ({activeDoctor.nameEn})
                    </span>
                  )}
                </h2>
                <p className="text-emerald-800 font-semibold text-sm sm:text-base font-sans-en bg-emerald-50 px-3 py-1.5 rounded-lg inline-block border border-emerald-200/60 mt-3">
                  {activeDoctor.qualifications}
                </p>
              </div>

              {/* Credential Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">প্রাতিষ্ঠানিক পদবী</h4>
                  <p className="text-xs text-slate-700 mt-1 leading-snug">
                    {activeDoctor.designationBn}
                  </p>
                  {activeDoctor.designation && (
                    <p className="text-[11px] text-slate-400 font-sans-en mt-0.5">
                      {activeDoctor.designation}
                    </p>
                  )}
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                  <div className="w-9 h-9 rounded-lg bg-red-100 text-red-800 flex items-center justify-center mb-3">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">ক্লিনিক্যাল দায়িত্ব</h4>
                  <p className="text-xs text-slate-700 mt-1 leading-snug">
                    {activeDoctor.roleBn}
                  </p>
                  {activeDoctor.role && (
                    <p className="text-[11px] text-slate-400 font-sans-en mt-0.5">
                      {activeDoctor.role}
                    </p>
                  )}
                </div>
              </div>

              {/* Specialties / Diseases Treated */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-red-600" />
                  <span>বিশেষায়িত চিকিৎসা ক্ষেত্রসমূহ</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeDoctor.specialties && activeDoctor.specialties.length > 0 ? (
                    activeDoctor.specialties.map((spec, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200"
                      >
                        {spec}
                      </span>
                    ))
                  ) : (
                    ['বন্ধ্যাত্ব', 'পাইলস', 'টিউমার', 'চর্মরোগ', 'টনসিল', 'কিডনি পাথর', 'পলিপাস', 'জটিল ও পুরাতন রোগ'].map(
                      (spec, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200"
                        >
                          {spec}
                        </span>
                      )
                    )
                  )}
                </div>
              </div>

              {/* Bio & Philosophy */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h4 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>চিকিৎসা দর্শন ও রোগীর প্রতি অঙ্গীকার</span>
                </h4>
                <p className="text-slate-700 text-sm leading-relaxed">
                  {activeDoctor.bioBn}
                </p>
              </div>

              {/* Direct Serial Hotline */}
              <div className="bg-emerald-950 text-white rounded-2xl p-6 shadow-md border border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-base font-bold text-white">জরুরি সিরিয়ালের হটলাইন</h4>
                  <p className="text-xs text-emerald-200 mt-1">
                    সরাসরি চিকিৎসকের সহকারীর সাথে কথা বলে সিরিয়াল নিশ্চিত করতে পারেন
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {activeDoctor.phones && activeDoctor.phones.length > 0 ? (
                    activeDoctor.phones.map((p, idx) => (
                      <a
                        key={idx}
                        href={`tel:${p.replace(/\s+/g, '')}`}
                        className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm font-sans-en transition"
                      >
                        <Phone className="w-4 h-4" />
                        <span>{p}</span>
                      </a>
                    ))
                  ) : (
                    <a
                      href="tel:+8801714990001"
                      className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm font-sans-en transition"
                    >
                      <Phone className="w-4 h-4" />
                      <span>+88 01714-990001</span>
                    </a>
                  )}
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>

      {/* Modals */}
      <VisitingCardModal
        isOpen={isVisitingCardOpen}
        onClose={() => setIsVisitingCardOpen(false)}
        doctor={visitingCardDoctor}
      />

      <AddEditDoctorModal
        isOpen={isAddDoctorModalOpen}
        onClose={() => setIsAddDoctorModalOpen(false)}
        onSuccess={() => {
          if (onRefreshData) onRefreshData();
        }}
        doctorToEdit={doctorToEdit}
      />

      <DoctorPhotoUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={(newUrl) => {
          if (onRefreshData) onRefreshData();
        }}
        currentImageUrl={activeDoctor.imageUrl || '/dr-tamjid-hossain.jpg'}
      />
    </div>
  );
};
