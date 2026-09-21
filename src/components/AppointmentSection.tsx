import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Treatment, Chamber, DoctorProfile } from '../types.js';
import { Calendar, Phone, Lock, CheckCircle, AlertCircle, Loader2, Sparkles, User, FileText, MapPin, Stethoscope } from 'lucide-react';

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
  const [serviceName, setServiceName] = useState(preselectedService);
  const [preferredChamber, setPreferredChamber] = useState(preselectedChamber || 'মতলব চেম্বার');
  const [preferredDoctor, setPreferredDoctor] = useState(preselectedDoctor || (doctors[0]?.nameBn || 'ডা. তামজীদ হোসেন'));
  const [problemDescription, setProblemDescription] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successData, setSuccessData] = useState<{ id: string; message: string } | null>(null);

  useEffect(() => {
    if (preselectedService) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Client-side validations
    if (!fullName.trim() || fullName.trim().length < 2) {
      setErrorMsg('অনুগ্রহ করে আপনার সঠিক পূর্ণ নাম লিখুন।');
      return;
    }

    if (!phone.trim() || phone.trim().length < 9) {
      setErrorMsg('অনুগ্রহ করে আপনার সচল মোবাইল নাম্বার (যেমন: 017xxxxxxxx) লিখুন।');
      return;
    }

    if (!serviceName) {
      setErrorMsg('অনুগ্রহ করে যে সেবাটি প্রয়োজন তা নির্বাচন করুন।');
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
          serviceName,
          preferredChamber,
          preferredDoctor,
          problemDescription: problemDescription.trim()
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'সিরিয়াল আবেদনে সমস্যা হয়েছে। অনুগ্রহ করে ফোন করুন।');
      }

      setSuccessData({
        id: data.appointment.id,
        message: data.message || 'আপনার সিরিয়াল আবেদন সফলভাবে গ্রহণ করা হয়েছে।'
      });

      // Reset fields
      setFullName('');
      setPhone('');
      setProblemDescription('');
    } catch (err: any) {
      setErrorMsg(err.message || 'নেটওয়ার্ক সংযোগে সমস্যা। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="appointment" className="py-20 bg-emerald-950 text-white relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-emerald-600 rounded-full blur-3xl transform -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-600 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Explanatory & Direct hotline (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-500/30 text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-4 w-fit">
              <Sparkles className="w-3.5 h-3.5 text-red-400" />
              <span>অনলাইন সিরিয়াল বুকিং</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
              আপনার ব্যক্তিগত তথ্য দিয়ে ফরম পূরণ করুন
            </h2>

            <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed mb-6">
              সরাসরি ক্লিনিকে আসার আগে অগ্রিম সিরিয়াল নিশ্চিত করুন। ফরমটি পূরণ করে সাবমিট করলে আমাদের প্রতিনিধি দ্রুত আপনার সাথে ফোনে যোগাযোগ করে সিরিয়াল ও সাক্ষাতের নির্দিষ্ট সময় চূড়ান্ত করবেন।
            </p>

            {/* Privacy Badge */}
            <div className="flex items-center gap-3 bg-emerald-900/60 border border-emerald-700/50 rounded-2xl p-4 mb-8">
              <div className="w-10 h-10 rounded-xl bg-emerald-800 flex items-center justify-center text-emerald-300 flex-shrink-0">
                <Lock className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">গোপনীয়তার নিশ্চয়তা</h4>
                <p className="text-xs text-emerald-200/90 mt-0.5">
                  আপনার দেওয়া সকল তথ্যের সর্বোচ্চ গোপনীয়তা রক্ষা করা হবে।
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

          {/* Right Column: Interactive Appointment Form (7 cols) */}
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
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 max-w-xs mx-auto mb-6">
                      <span className="text-xs text-slate-500 font-semibold block">আবেদন রেফারেন্স আইডি</span>
                      <span className="text-sm font-bold text-emerald-800 font-sans-en">{successData.id}</span>
                    </div>
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
                    className="space-y-5"
                  >
                    <div className="border-b border-slate-100 pb-3">
                      <h3 className="text-xl font-bold text-slate-900">
                        রোগীর তথ্য ফরম
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        * চিহ্নিত ঘরগুলো পূরণ করা আবশ্যক
                      </p>
                    </div>

                    {errorMsg && (
                      <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-800">
                        <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Full Name */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          নাম *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            placeholder="রোগীর পূর্ণ নাম লিখুন"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm bg-slate-50/50"
                          />
                          <User className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-400" />
                        </div>
                      </div>

                      {/* Phone Number */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          ফোন নাম্বার *
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Preferred Doctor */}
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

                      {/* Preferred Chamber */}
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

                    {/* Service Dropdown */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        সেবার নাম *
                      </label>
                      <select
                        required
                        value={serviceName}
                        onChange={(e) => setServiceName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm bg-slate-50/50"
                      >
                        <option value="">সেবা নির্বাচন করুন...</option>
                        {treatments.map((t) => (
                          <option key={t.id} value={t.titleBn}>
                            {t.titleBn}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Problem Description */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        বিস্তারিত বর্ণনা (ঐচ্ছিক)
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
                      disabled={loading}
                      className="w-full py-4 px-6 rounded-xl font-bold text-base text-white bg-red-600 hover:bg-red-700 active:bg-red-800 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>আবেদন প্রক্রিয়াধীন...</span>
                        </>
                      ) : (
                        <>
                          <Calendar className="w-5 h-5" />
                          <span>সাবমিট</span>
                        </>
                      )}
                    </button>

                    <p className="text-[11px] text-center text-slate-400">
                      ফর্ম জমা দেওয়ার পর আমাদের টিম শীঘ্রই আপনার দেওয়া নাম্বারে যোগাযোগ করবে।
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
