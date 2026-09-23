import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Chamber } from '../types.js';
import {
  Phone,
  MapPin,
  Calendar,
  Clock,
  Building,
  PhoneCall,
  MessageSquare,
  MessageCircle,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';

interface ContactPageProps {
  chambers: Chamber[];
  onOpenAppointment: (preferredChamber?: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  chambers,
  onOpenAppointment
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Construct professional WhatsApp message
    const lines = [
      `*বাংলাদেশ হোমিও হল - সরাসরি যোগাযোগ অনুসন্ধান*`,
      `━━━━━━━━━━━━━━━━━━━━━`,
      `*নাম:* ${formData.name}`,
      `*মোবাইল নম্বর:* ${formData.phone}`,
      formData.subject ? `*বিষয়:* ${formData.subject}` : null,
      `*বার্তা:* ${formData.message}`,
      `━━━━━━━━━━━━━━━━━━━━━`,
      `ওয়েবসাইট অনুসন্ধান থেকে প্রেরিত`
    ].filter(Boolean);

    const fullMessage = lines.join('\n');
    const waUrl = `https://wa.me/8801714990001?text=${encodeURIComponent(fullMessage)}`;

    // Open WhatsApp directly without any email interaction
    window.location.href = waUrl;
    setSubmitted(true);
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-[#003870] text-white py-14 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-2 text-xs text-emerald-300 mb-3">
            <Link to="/" className="hover:text-white transition">হোম</Link>
            <span>/</span>
            <span className="text-white font-medium">যোগাযোগ ও চেম্বার ঠিকানা</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-3">
            আমাদের সাথে যোগাযোগ করুন
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base max-w-2xl leading-relaxed">
            সিরিয়াল বুকিং, পরামর্শ বা যেকোনো অনুসন্ধানের জন্য মতলব বা হাজীগঞ্জ চেম্বারের হটলাইনে সরাসরি যোগাযোগ অথবা হোয়াটসঅ্যাপে বার্তা পাঠান।
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          {/* Hotline 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-3">
              <PhoneCall className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">জরুরি সিরিয়াল হটলাইন ১</h3>
            <p className="text-xs text-slate-500 mb-3">সরাসরি কথা বলতে ক্লিক করুন</p>
            <a
              href="tel:+8801714990001"
              className="text-base font-bold text-emerald-800 font-sans-en hover:underline"
            >
              +88 01714-990001
            </a>
          </div>

          {/* Hotline 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-3">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">জরুরি সিরিয়াল হটলাইন ২</h3>
            <p className="text-xs text-slate-500 mb-3">সরাসরি কথা বলতে ক্লিক করুন</p>
            <a
              href="tel:+8801614990001"
              className="text-base font-bold text-emerald-800 font-sans-en hover:underline"
            >
              +88 01614-990001
            </a>
          </div>

          {/* WhatsApp Direct */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">অফিসিয়াল হোয়াটসঅ্যাপ</h3>
            <p className="text-xs text-slate-500 mb-3">সরাসরি চ্যাট করতে ক্লিক করুন</p>
            <a
              href="https://wa.me/8801714990001?text=হ্যালো%20বাংলাদেশ%20হোমিও%20হল,%20আমি%20পরামর্শ/সিরিয়াল%20সম্পর্কে%20জানতে%20চাই।"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>হোয়াটসঅ্যাপ খুলুন</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

        {/* Chambers Locations & Inquiry Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Chambers List (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Building className="w-5 h-5 text-emerald-700" />
              <span>চেম্বারসমূহের বিস্তারিত অবস্থান</span>
            </h2>

            {chambers.map((chamber) => (
              <div
                key={chamber.id}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{chamber.nameBn}</h3>
                    {chamber.nameEn && <p className="text-xs text-slate-400 font-sans-en">{chamber.nameEn}</p>}
                  </div>
                  <button
                    onClick={() => onOpenAppointment(chamber.nameBn)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition cursor-pointer"
                  >
                    সিরিয়াল নিন
                  </button>
                </div>

                <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <span><strong>ঠিকানা:</strong> {chamber.addressBn}</span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Calendar className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                    <span><strong>রোগী দেখার দিন:</strong> {chamber.visitingDaysBn}</span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                    <span><strong>রোগী দেখার সময়:</strong> {chamber.visitingHoursBn}</span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Phone className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                    <span><strong>ফোন:</strong> <a href={`tel:${chamber.phone}`} className="font-sans-en font-bold text-emerald-800 hover:underline">{chamber.phone}</a></span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Inquiry Form (5 cols) -> Pure WhatsApp submission */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-2">
                <MessageCircle className="w-4 h-4" />
                <span>সরাসরি হোয়াটসঅ্যাপ বার্তা</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">হোয়াটসঅ্যাপে অনুসন্ধান পাঠান</h3>
              <p className="text-xs text-slate-500 mb-6">
                নিচের ফর্মটি পূরণ করে সাবমিট করলেই কোনো ইমেইল ঝামেলা ছাড়াই সরাসরি আমাদের অফিসিয়াল হোয়াটসঅ্যাপে বার্তা পৌঁছে যাবে।
              </p>

              {submitted ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-emerald-950 text-sm">হোয়াটসঅ্যাপের সাথে সংযুক্ত করা হয়েছে</h4>
                  <p className="text-xs text-emerald-800">আপনার বার্তাটি হোয়াটসঅ্যাপ উইন্ডোতে প্রস্তুত হয়েছে।</p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', phone: '', subject: '', message: '' });
                    }}
                    className="text-xs text-emerald-700 font-bold hover:underline"
                  >
                    নতুন বার্তা লিখুন
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">আপনার নাম *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="পুরো নাম লিখুন"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">মোবাইল নম্বর *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="০১৭..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-700 focus:outline-none font-sans-en"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">বিষয় (ঐচ্ছিক)</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="যেমন: চিকিৎসা পরামর্শ বা চেম্বার সময়"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">বার্তা বা জিজ্ঞাসা *</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="আপনার প্রশ্ন বা বার্তাটি এখানে লিখুন..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>হোয়াটসঅ্যাপে পাঠান</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
