import React, { useRef } from 'react';
import { DoctorProfile } from '../types.js';
import { X, Phone, MapPin, Calendar, Clock, Download, Printer, ShieldCheck } from 'lucide-react';

interface VisitingCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: DoctorProfile;
}

export const VisitingCardModal: React.FC<VisitingCardModalProps> = ({
  isOpen,
  onClose,
  doctor
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const isDrAshraf = doctor.nameBn.includes('আশরাফ') || doctor.id === 'dr-ashraf-ali';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Top Bar */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              ডিজিটাল ভিজিটিং কার্ড (Visiting Card)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
              title="প্রিন্ট বা সেভ করুন"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Card Content Area */}
        <div className="p-5 sm:p-7 bg-slate-100 flex flex-col items-center justify-center">
          
          {/* Authentic Physical Visiting Card Style Container */}
          <div
            ref={cardRef}
            className="w-full bg-[#fdfbf7] text-[#1c1917] rounded-2xl border-2 border-emerald-900 shadow-xl p-6 sm:p-7 relative overflow-hidden font-sans-bn"
          >
            {/* Top Islamic Greeting */}
            <div className="text-center border-b border-emerald-800/30 pb-2 mb-3">
              <p className="text-xs font-bold text-emerald-900 tracking-wider">
                বিসমিল্লাহির রাহমানির রাহিম
              </p>
            </div>

            {/* Institution / College Header */}
            <div className="text-center mb-3">
              <h4 className="text-base sm:text-lg font-bold text-red-700 tracking-tight">
                {isDrAshraf ? 'আদর্শ হোমিওপ্যাথিক মেডিকেল কলেজ ও হাসপাতাল' : 'চাঁদপুর হোমিওপ্যাথিক মেডিকেল কলেজ ও হাসপাতাল'}
              </h4>
              <p className="text-xs text-slate-700 font-semibold mt-0.5">
                {doctor.designationBn || 'সহকারী অধ্যাপক, খলিশাডুলী, চাঁদপুর'}
              </p>
            </div>

            {/* Doctor Name & Degrees */}
            <div className="bg-emerald-950 text-white rounded-xl p-3 sm:p-3.5 text-center my-3 shadow-md border border-emerald-800">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {doctor.nameBn}
              </h2>
              <p className="text-xs text-amber-300 font-semibold font-sans-en mt-1">
                {doctor.qualifications}
              </p>
              <p className="text-[11px] text-slate-200 mt-1 font-sans-en">
                {doctor.registrationNo}
              </p>
            </div>

            {/* Treated Diseases / Specialties */}
            <div className="my-3 text-center bg-emerald-50/80 rounded-lg p-2.5 border border-emerald-200/60">
              <p className="text-[11px] font-bold text-emerald-950 mb-1">
                বিশেষভাবে চিকিৎসা করা হয়:
              </p>
              <p className="text-xs text-slate-800 font-medium leading-relaxed">
                {doctor.specialties && doctor.specialties.length > 0
                  ? doctor.specialties.join(' • ')
                  : 'বন্ধ্যাত্ব • পাইলস • টিউমার • চর্মরোগ • টনসিল • কিডনি পাথর • পলিপাস • আঁচিল • জটিল ও পুরাতন রোগ'}
              </p>
            </div>

            {/* Chamber Locations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3 text-xs">
              
              {/* Chamber 1 */}
              <div className="bg-white rounded-xl p-3 border border-slate-300/80 shadow-sm">
                <div className="flex items-center gap-1 text-red-700 font-bold mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{isDrAshraf ? 'চাঁদপুর চেম্বার:' : 'মতলব প্রধান চেম্বার:'}</span>
                </div>
                <p className="text-[11px] text-slate-700 leading-snug font-medium">
                  {isDrAshraf
                    ? 'ফয়সাল শপিং কমপ্লেক্স (২য় তলা), সোশ্যাল ইসলামী ব্যাংকের পাশে, বাস স্ট্যান্ড, চাঁদপুর।'
                    : 'কলেজ রোড, মতলব বাজার, মতলব (দক্ষিণ), চাঁদপুর।'}
                </p>
                <p className="text-[10px] text-emerald-800 font-bold mt-1.5 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-emerald-600" />
                  <span>{isDrAshraf ? 'প্রতিদিন: সকাল ১০ টা - রাত ৮ টা' : 'শনি-বৃহস্পতি: সকাল ৯ টা - দুপুর ২ টা'}</span>
                </p>
              </div>

              {/* Chamber 2 */}
              <div className="bg-white rounded-xl p-3 border border-slate-300/80 shadow-sm">
                <div className="flex items-center gap-1 text-emerald-900 font-bold mb-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{isDrAshraf ? 'মতলব চেম্বার:' : 'হাজীগঞ্জ চেম্বার:'}</span>
                </div>
                <p className="text-[11px] text-slate-700 leading-snug font-medium">
                  {isDrAshraf
                    ? 'মা আমেনা টাওয়ার (ইসলামী ব্যাংকের নিচ তলা), মতলব বাজার, মতলব (দ:), চাঁদপুর।'
                    : 'স্টেশন রোড, হাজীগঞ্জ বাজার, হাজীগঞ্জ, চাঁদপুর।'}
                </p>
                <p className="text-[10px] text-red-700 font-bold mt-1.5 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-red-600" />
                  <span>{isDrAshraf ? 'প্রতি মঙ্গলবার: সকাল ৯ টা - দুপুর ১ টা' : 'প্রতি শুক্রবার: বিকাল ৩ টা - রাত ৮ টা'}</span>
                </p>
                {isDrAshraf && (
                  <p className="text-[9px] text-slate-500 italic mt-0.5">
                    (নির্ধারিত দিনে আসার পূর্বে যোগাযোগ করে আসবেন)
                  </p>
                )}
              </div>

            </div>

            {/* Contact Phone Numbers */}
            <div className="pt-2 border-t border-emerald-800/30 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-bold text-slate-800 font-sans-en">
              <span className="text-[11px] text-slate-600 font-sans-bn font-semibold">
                সিরিয়ালের মোবাইল নম্বর:
              </span>
              <div className="flex items-center gap-3">
                {doctor.phones && doctor.phones.length > 0 ? (
                  doctor.phones.map((p, idx) => (
                    <a
                      key={idx}
                      href={`tel:${p.replace(/\s+/g, '')}`}
                      className="inline-flex items-center gap-1 text-red-700 hover:text-red-800 transition"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{p}</span>
                    </a>
                  ))
                ) : (
                  <>
                    <a href="tel:01743902773" className="inline-flex items-center gap-1 text-red-700">
                      <Phone className="w-3.5 h-3.5" />
                      <span>01743-902773</span>
                    </a>
                    <a href="tel:01712846478" className="inline-flex items-center gap-1 text-red-700">
                      <Phone className="w-3.5 h-3.5" />
                      <span>01712-846478</span>
                    </a>
                  </>
                )}
              </div>
            </div>

          </div>

          {/* Quick Action Buttons Below Card */}
          <div className="flex items-center gap-3 mt-5 w-full justify-center">
            {doctor.phones && doctor.phones[0] && (
              <a
                href={`tel:${doctor.phones[0].replace(/\s+/g, '')}`}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition"
              >
                <Phone className="w-4 h-4" />
                <span>সরাসরি কল দিন</span>
              </a>
            )}
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
            >
              বন্ধ করুন
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
