import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Chamber } from '../types.js';
import {
  Phone,
  MapPin,
  Mail,
  Calendar,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Building,
  PhoneCall,
  MessageSquare
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
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate quick message submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white py-14 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-2 text-xs text-emerald-300 mb-3">
            <Link to="/" className="hover:text-white transition">হোম</Link>
            <span>/</span>
            <span className="text-white font-medium">যোগাযোগ ও চেম্বার ঠিকানা</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-3">
            আমাদের সাথে যোগাযোগ করুন
          </h1>
          <p className="text-emerald-200 text-sm sm:text-base max-w-2xl leading-relaxed">
            সিরিয়াল বুকিং, পরামর্শ বা যেকোনো অনুসন্ধানের জন্য মতলব বা হাজীগঞ্জ চেম্বারের হটলাইনে সরাসরি যোগাযোগ করুন।
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

          {/* WhatsApp / Online */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-3">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">অনলাইন সিরিয়াল পোর্টাল</h3>
            <p className="text-xs text-slate-500 mb-3">২৪/৭ অনলাইন বুকিং সুবিধা</p>
            <Link
              to="/appointment"
              className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition"
            >
              সিরিয়াল পেজে যান
            </Link>
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

          {/* Quick Inquiry Form (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider mb-2">
                <MessageSquare className="w-4 h-4" />
                <span>মতামত বা অনুসন্ধান</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">আমাদের বার্তা পাঠান</h3>
              <p className="text-xs text-slate-500 mb-6">
                আপনার যেকোনো প্রশ্ন বা মতামতের জন্য নিচের ফর্মটি পূরণ করুন।
              </p>

              {submitted ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-emerald-950 text-sm">আপনার বার্তা সফলভাবে পাঠানো হয়েছে!</h4>
                  <p className="text-xs text-emerald-800">আমাদের প্রতিনিধি শীঘ্রই আপনার সাথে যোগাযোগ করবেন।</p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', phone: '', subject: '', message: '' });
                    }}
                    className="text-xs text-emerald-700 font-bold hover:underline"
                  >
                    নতুন বার্তা পাঠান
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
                      placeholder="০১৭১৪..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-700 focus:outline-none font-sans-en"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">বিষয়</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="যেমন: পরামর্শ বা সময় সংক্রান্ত তথ্য"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">বার্তা বা প্রশ্ন *</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="আপনার বার্তা বিস্তারিত লিখুন..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                    <span>{loading ? 'পাঠানো হচ্ছে...' : 'বার্তা পাঠান'}</span>
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
