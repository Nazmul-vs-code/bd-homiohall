import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Treatment, Chamber, DoctorProfile } from '../types.js';
import {
  Calendar,
  Phone,
  Lock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Sparkles,
  User,
  Upload,
  Image as ImageIcon,
  X,
  FileCheck,
  Check,
  ShieldCheck,
  Heart,
  Baby,
  UserCheck,
  ExternalLink
} from 'lucide-react';
import { PATIENT_TYPE_OPTIONS, PatientType, getTreatmentsByPatientType } from '../data/patientTypes.js';

interface AppointmentSectionProps {
  treatments: Treatment[];
  chambers: Chamber[];
  doctors?: DoctorProfile[];
  preselectedService?: string;
  preselectedChamber?: string;
  preselectedDoctor?: string;
}

export const AppointmentSection: React.FC<AppointmentSectionProps> = ({
  treatments,
  chambers,
  doctors = [],
  preselectedService = '',
  preselectedChamber = '',
  preselectedDoctor = ''
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [patientType, setPatientType] = useState<PatientType | ''>('');
  const [serviceName, setServiceName] = useState(preselectedService);
  const [preferredChamber, setPreferredChamber] = useState(preselectedChamber || 'মতলব চেম্বার');
  const [preferredDoctor, setPreferredDoctor] = useState(preselectedDoctor || (doctors[0]?.nameBn || 'ডা. তামজীদ হোসেন'));
  const [problemDescription, setProblemDescription] = useState('');

  // Medical Report File Upload States
  const [reportFile, setReportFile] = useState<File | null>(null);
  const [reportPreview, setReportPreview] = useState<string | null>(null);
  const [reportImageUrl, setReportImageUrl] = useState<string>('');
  const [uploadingReport, setUploadingReport] = useState(false);
  const [reportUploadError, setReportUploadError] = useState('');
  const [reportUploadSuccess, setReportUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Form submission states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successData, setSuccessData] = useState<{ id: string; message: string; reportUrl?: string } | null>(null);

  // Keep track if user touched service dropdown before selecting patient type
  const [serviceAttempted, setServiceAttempted] = useState(false);

  // Available services filtered strictly by selected patient type
  const availableTreatments = getTreatmentsByPatientType(treatments, patientType);

  // Reset or adjust service selection if patient type changes
  useEffect(() => {
    if (patientType) {
      const allowed = getTreatmentsByPatientType(treatments, patientType);
      const isCurrentServiceAllowed = allowed.some((t) => t.titleBn === serviceName);
      if (!isCurrentServiceAllowed && serviceName) {
        setServiceName('');
      }
    } else {
      setServiceName('');
    }
  }, [patientType, treatments]);

  useEffect(() => {
    if (preselectedService) {
      // Determine probable patient type from preselected service if not chosen
      const titleLower = preselectedService.toLowerCase();
      if (
        titleLower.includes('গর্ভকালীন') ||
        titleLower.includes('মাসিক') ||
        titleLower.includes('শ্বেতস্রাব') ||
        titleLower.includes('স্তন ও জরায়ু')
      ) {
        setPatientType('female');
      } else if (titleLower.includes('যৌন দুর্বলতা') || titleLower.includes('অণ্ডকোষ')) {
        setPatientType('male');
      } else if (titleLower.includes('টনসিল') || titleLower.includes('কৃমি')) {
        // can be child or male or female
      }
      setServiceName(preselectedService);
    }
  }, [preselectedService]);

  useEffect(() => {
    if (preselectedChamber) {
      setPreferredChamber(preselectedChamber);
    }
  }, [preselectedChamber]);

  useEffect(() => {
    if (preselectedDoctor) {
      setPreferredDoctor(preselectedDoctor);
    }
  }, [preselectedDoctor]);

  // Handle PNG report selection and auto-upload to ImgBB
  const handleReportFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setReportUploadError('');
    setReportUploadSuccess(false);

    const file = e.target.files?.[0];
    if (!file) return;

    // Strict validation: Only PNG format
    const isPng = file.type === 'image/png' || file.name.toLowerCase().endsWith('.png');
    if (!isPng) {
      setReportUploadError('শুধুমাত্র পিএনজি (.png) ফরম্যাটের রিপোর্ট ফাইল আপলোড করা যাবে। অনুগ্রহ করে PNG ফাইল নির্বাচন করুন।');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Size limit: 32MB max
    if (file.size > 32 * 1024 * 1024) {
      setReportUploadError('ফাইলের আকার সর্বোচ্চ ৩২ মেগাবাইট (32 MB) হতে পারবে।');
      return;
    }

    setReportFile(file);

    // Read preview & base64
    const reader = new FileReader();
    reader.onload = async () => {
      const base64DataUri = reader.result as string;
      setReportPreview(base64DataUri);

      // Trigger automatic upload to ImgBB via backend
      try {
        setUploadingReport(true);
        const res = await fetch('/api/public/upload-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: base64DataUri,
            name: `report_${Date.now()}_${file.name.replace(/\.[^/.]+$/, '')}`
          })
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'ImgBB সার্ভারে রিপোর্ট আপলোড হতে ব্যর্থ হয়েছে।');
        }

        setReportImageUrl(data.url);
        setReportUploadSuccess(true);
      } catch (err: any) {
        setReportUploadError(err.message || 'রিপোর্ট আপলোডে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
      } finally {
        setUploadingReport(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveReport = () => {
    setReportFile(null);
    setReportPreview(null);
    setReportImageUrl('');
    setReportUploadSuccess(false);
    setReportUploadError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Validations
    if (!fullName.trim() || fullName.trim().length < 2) {
      setErrorMsg('অনুগ্রহ করে আপনার সঠিক পূর্ণ নাম লিখুন।');
      return;
    }

    if (!phone.trim() || phone.trim().length < 9) {
      setErrorMsg('অনুগ্রহ করে আপনার সচল মোবাইল নাম্বার (যেমন: 017xxxxxxxx) লিখুন।');
      return;
    }

    if (!patientType) {
      setErrorMsg('অনুগ্রহ করে রোগীর ধরন (পুরুষ, মহিলা অথবা শিশু) নির্বাচন করুন।');
      return;
    }

    if (!serviceName) {
      setErrorMsg('অনুগ্রহ করে কাঙ্ক্ষিত স্বাস্থ্যসেবা নির্বাচন করুন।');
      return;
    }

    if (uploadingReport) {
      setErrorMsg('রিপোর্ট আপলোড সম্পন্ন হওয়া পর্যন্ত কিছুক্ষণ অপেক্ষা করুন...');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/public/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phone: phone.trim(),
          patientType,
          serviceName,
          preferredChamber,
          preferredDoctor,
          problemDescription: problemDescription.trim(),
          reportImageUrl: reportImageUrl || ''
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'সিরিয়াল আবেদনে সমস্যা হয়েছে। অনুগ্রহ করে ফোন করুন।');
      }

      setSuccessData({
        id: data.appointment.id,
        message: data.message || 'আপনার সিরিয়াল আবেদন সফলভাবে গ্রহণ করা হয়েছে।',
        reportUrl: reportImageUrl || undefined
      });

      // Reset fields
      setFullName('');
      setPhone('');
      setPatientType('');
      setServiceName('');
      setProblemDescription('');
      handleRemoveReport();
    } catch (err: any) {
      setErrorMsg(err.message || 'নেটওয়ার্ক সংযোগে সমস্যা। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="appointment" className="py-16 sm:py-20 bg-emerald-950 text-white relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-emerald-600 rounded-full blur-3xl transform -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-600 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* Left Column: Explanatory & Direct hotline */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-500/30 text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-4 w-fit">
              <Sparkles className="w-3.5 h-3.5 text-red-400" />
              <span>অনলাইন সিরিয়াল বুকিং</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
              আপনার ব্যক্তিগত তথ্য দিয়ে সহজে সিরিয়াল নিশ্চিত করুন
            </h2>

            <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed mb-6">
              রোগীর ধরন (পুরুষ/মহিলা/শিশু) নির্বাচন করলে চিকিৎসকের সম্পর্কিত সেবাসমূহ দৃশ্যমান হবে। পূর্ববর্তী যেকোনো মেডিকেল পরীক্ষার রিপোর্ট (PNG ফরম্যাটে) আপলোড করে দিতে পারেন।
            </p>

            {/* Privacy Badge */}
            <div className="flex items-center gap-3 bg-emerald-900/60 border border-emerald-700/50 rounded-2xl p-4 mb-8">
              <div className="w-10 h-10 rounded-xl bg-emerald-800 flex items-center justify-center text-emerald-300 flex-shrink-0">
                <Lock className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">১০০% গোপনীয়তার নিশ্চয়তা</h4>
                <p className="text-xs text-emerald-200/90 mt-0.5">
                  আপনার শারীরিক সমস্যা ও রিপোর্টের সকল তথ্য শুধুমাত্র অভিজ্ঞ চিকিৎসকের পর্যবেক্ষণে থাকবে।
                </p>
              </div>
            </div>

            {/* Direct Telephone Serial Banner */}
            <div className="border-t border-emerald-800/80 pt-6">
              <p className="text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-2">
                সরাসরি হটলাইনে সিরিয়ালের জন্য:
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="tel:+8801714990001"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white font-sans-en font-bold text-sm border border-emerald-700/60 transition"
                >
                  <Phone className="w-4 h-4 text-red-400" />
                  <span>+88 01714-990001</span>
                </a>
                <a
                  href="tel:+8801614990001"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white font-sans-en font-bold text-sm border border-emerald-700/60 transition"
                >
                  <Phone className="w-4 h-4 text-red-400" />
                  <span>+88 01614-990001</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Appointment Form */}
          <div className="lg:col-span-7">
            <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-100">
              
              <AnimatePresence mode="wait">
                {successData ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="py-8 text-center"
                  >
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                      <CheckCircle className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                      সিরিয়াল আবেদন গৃহীত হয়েছে!
                    </h3>
                    <p className="text-slate-600 text-sm max-w-md mx-auto mb-4 leading-relaxed">
                      {successData.message}
                    </p>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 max-w-xs mx-auto mb-4">
                      <span className="text-xs text-slate-500 font-semibold block">আবেদন রেফারেন্স আইডি</span>
                      <span className="text-sm font-bold text-emerald-800 font-sans-en">{successData.id}</span>
                    </div>

                    {successData.reportUrl && (
                      <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 rounded-xl max-w-md mx-auto flex items-center justify-center gap-2 text-xs text-emerald-900">
                        <FileCheck className="w-4 h-4 text-emerald-700" />
                        <span>আপনার প্রেসক্রিপশন / রিপোর্ট সফলভাবে সংযুক্ত হয়েছে।</span>
                        <a
                          href={successData.reportUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold underline text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-0.5 ml-1"
                        >
                          দেখুন <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}

                    <button
                      onClick={() => setSuccessData(null)}
                      className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-emerald-800 text-white hover:bg-emerald-900 transition"
                    >
                      আরেকটি সিরিয়াল বুক করুন
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div className="border-b border-slate-100 pb-3">
                      <h3 className="text-xl font-bold text-slate-900">
                        রোগীর তথ্য ও অ্যাপয়েন্টমেন্ট ফরম
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        * চিহ্নিত ঘরগুলো পূরণ করা বাধ্যতামূলক
                      </p>
                    </div>

                    {errorMsg && (
                      <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-800">
                        <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    {/* Patient Name & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          রোগীর পূর্ণ নাম *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            placeholder="রোগীর নাম লিখুন"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm bg-slate-50/50"
                          />
                          <User className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-400" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          সচল মোবাইল নাম্বার *
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            required
                            placeholder="০১৭১৪-৯৯০০০১"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm bg-slate-50/50 font-sans-en"
                          />
                          <Phone className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-400" />
                        </div>
                      </div>
                    </div>

                    {/* 1. GENDER / PATIENT TYPE SELECTION (MANDATORY) */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                          রোগীর ধরন (জেন্ডার নির্বাচন করুন) *
                        </label>
                        {!patientType && (
                          <span className="text-[11px] font-semibold text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>আগে নির্বাচন আবশ্যক</span>
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        {PATIENT_TYPE_OPTIONS.map((opt) => {
                          const isSelected = patientType === opt.id;
                          return (
                            <button
                              type="button"
                              key={opt.id}
                              onClick={() => {
                                setPatientType(opt.id);
                                setServiceAttempted(false);
                              }}
                              className={`p-3 sm:p-3.5 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                                isSelected
                                  ? 'border-emerald-600 bg-emerald-50/80 shadow-sm'
                                  : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-300'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1.5">
                                <div
                                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center ${
                                    isSelected
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-white text-slate-600 border border-slate-200'
                                  }`}
                                >
                                  {opt.id === 'male' && <UserCheck className="w-4 h-4" />}
                                  {opt.id === 'female' && <Heart className="w-4 h-4" />}
                                  {opt.id === 'child' && <Baby className="w-4 h-4" />}
                                </div>
                                {isSelected && (
                                  <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <h4 className={`text-xs sm:text-sm font-bold leading-tight ${isSelected ? 'text-emerald-950' : 'text-slate-800'}`}>
                                  {opt.labelBn}
                                </h4>
                                <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                                  {opt.descriptionBn}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 2. SERVICE SELECTOR (CONDITIONALLY ACTIVE BASED ON PATIENT TYPE) */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                          কাঙ্ক্ষিত স্বাস্থ্যসেবা বা রোগ *
                        </label>
                        {patientType && (
                          <span className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                            {patientType === 'male' ? 'পুরুষদের সেবা' : patientType === 'female' ? 'মহিলাদের সেবা' : 'শিশুদের সেবা'} ({availableTreatments.length} টি)
                          </span>
                        )}
                      </div>

                      {!patientType ? (
                        /* RED ERROR SELECTOR STATE WHEN CATEGORY NOT SELECTED */
                        <div
                          onClick={() => setServiceAttempted(true)}
                          className="w-full p-4 rounded-xl border-2 border-red-400 bg-red-50/70 text-red-900 transition-all flex items-center gap-3 cursor-not-allowed"
                        >
                          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 animate-pulse" />
                          <div className="text-xs sm:text-sm">
                            <span className="font-bold block text-red-800">
                              আগে রোগীর ধরন (পুরুষ, মহিলা অথবা শিশু) নির্বাচন করুন!
                            </span>
                            <span className="text-[11px] text-red-600 block mt-0.5">
                              উপরে জেন্ডার ক্যাটাগরি বাছাই করলে সংশ্লিষ্ট সেবাসমূহ এখানে সক্রিয় হবে।
                            </span>
                          </div>
                        </div>
                      ) : (
                        /* ACTIVE SELECTOR AFTER CATEGORY SELECTED */
                        <div className="relative">
                          <select
                            required
                            value={serviceName}
                            onChange={(e) => setServiceName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-emerald-600/60 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm bg-white font-medium text-slate-900"
                          >
                            <option value="">সেবা নির্বাচন করুন...</option>
                            {availableTreatments.map((t) => (
                              <option key={t.id} value={t.titleBn}>
                                {t.titleBn} {t.category ? `(${t.category})` : ''}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>

                    {/* Doctor & Chamber Preference */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          পছন্দের চিকিৎসক
                        </label>
                        <select
                          value={preferredDoctor}
                          onChange={(e) => setPreferredDoctor(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm bg-slate-50/50"
                        >
                          {doctors && doctors.length > 0 ? (
                            doctors.map((d) => (
                              <option key={d.id || d.nameBn} value={d.nameBn}>
                                {d.nameBn} ({d.designationBn || d.roleBn})
                              </option>
                            ))
                          ) : (
                            <option value="ডা. তামজীদ হোসেন">ডা. তামজীদ হোসেন (প্রিন্সিপাল)</option>
                          )}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          পছন্দের চেম্বার
                        </label>
                        <select
                          value={preferredChamber}
                          onChange={(e) => setPreferredChamber(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm bg-slate-50/50"
                        >
                          {chambers.map((c) => (
                            <option key={c.id} value={c.nameBn}>
                              {c.nameBn}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* 3. OPTIONAL MEDICAL REPORT UPLOAD (PNG FORMAT ONLY via ImgBB) */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                          পূর্ববর্তী রিপোর্ট বা প্রেসক্রিপশন (ঐচ্ছিক)
                        </label>
                        <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                          শুধুমাত্র PNG ফরম্যাট
                        </span>
                      </div>

                      {!reportFile ? (
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-5 text-center bg-slate-50/60 hover:bg-emerald-50/30 transition-all cursor-pointer group"
                        >
                          <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/png,.png"
                            onChange={handleReportFileChange}
                            className="hidden"
                          />
                          <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-emerald-100 text-slate-500 group-hover:text-emerald-700 flex items-center justify-center mx-auto mb-2 transition">
                            <Upload className="w-5 h-5" />
                          </div>
                          <p className="text-xs sm:text-sm font-semibold text-slate-800 mb-0.5">
                            রিপোর্ট বা প্রেসক্রিপশনের ছবি আপলোড করুন
                          </p>
                          <p className="text-[11px] text-slate-400">
                            ক্লিক করে ফাইল নির্বাচন করুন (শুধুমাত্র <span className="font-bold text-slate-600">.png</span> ছবি গ্রহণযোগ্য)
                          </p>
                        </div>
                      ) : (
                        <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 overflow-hidden">
                              {reportPreview ? (
                                <img
                                  src={reportPreview}
                                  alt="Report Preview"
                                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-xl bg-slate-200 flex items-center justify-center flex-shrink-0">
                                  <ImageIcon className="w-6 h-6 text-slate-500" />
                                </div>
                              )}
                              <div className="truncate">
                                <span className="text-xs font-bold text-slate-900 block truncate">
                                  {reportFile.name}
                                </span>
                                <span className="text-[11px] text-slate-500 font-sans-en">
                                  {(reportFile.size / 1024).toFixed(1)} KB (PNG)
                                </span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={handleRemoveReport}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                              title="রিপোর্ট মুছুন"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Upload Status State */}
                          {uploadingReport && (
                            <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 p-2 rounded-xl">
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-700" />
                              <span>ImgBB ক্লাউডে রিপোর্ট সংরক্ষিত হচ্ছে...</span>
                            </div>
                          )}

                          {reportUploadSuccess && (
                            <div className="flex items-center justify-between text-xs text-emerald-900 bg-emerald-100/70 p-2 rounded-xl">
                              <span className="flex items-center gap-1.5 font-medium">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                                <span>রিপোর্ট সফলভাবে আপলোড সম্পন্ন হয়েছে!</span>
                              </span>
                              {reportImageUrl && (
                                <a
                                  href={reportImageUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="font-bold text-emerald-800 hover:underline flex items-center gap-0.5"
                                >
                                  ছবি দেখুন <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {reportUploadError && (
                        <div className="mt-2 p-2.5 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-700">
                          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                          <span>{reportUploadError}</span>
                        </div>
                      )}
                    </div>

                    {/* Problem Description */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        শারীরিক সমস্যার বিবরণ (ঐচ্ছিক)
                      </label>
                      <textarea
                        rows={3}
                        placeholder="আপনার শারীরিক সমস্যা, কতদিন ধরে ভুগছেন এবং পূর্ববর্তী চিকিৎসার তথ্য সংক্ষেপে লিখুন..."
                        value={problemDescription}
                        onChange={(e) => setProblemDescription(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm bg-slate-50/50 resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading || uploadingReport}
                      className="w-full py-4 px-6 rounded-xl font-bold text-base text-white bg-red-600 hover:bg-red-700 active:bg-red-800 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>আবেদন প্রক্রিয়াধীন...</span>
                        </>
                      ) : uploadingReport ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>রিপোর্ট আপলোড হচ্ছে...</span>
                        </>
                      ) : (
                        <>
                          <Calendar className="w-5 h-5" />
                          <span>অ্যাপয়েন্টমেন্ট সাবমিট করুন</span>
                        </>
                      )}
                    </button>

                    <p className="text-[11px] text-center text-slate-400">
                      ফর্ম জমা দেওয়ার পর আমাদের সহকারী সরাসরি আপনার মোবাইল নম্বরে যোগাযোগ করে সময় চূড়ান্ত করবেন।
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
