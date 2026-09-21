import React, { useState } from 'react';
import { SiteSettings } from '../../types.js';
import { CheckCircle, Image, Sparkles } from 'lucide-react';

interface HeroSettingsTabProps {
  settings: SiteSettings;
  onRefresh: () => void;
  token: string;
}

export const HeroSettingsTab: React.FC<HeroSettingsTabProps> = ({
  settings,
  onRefresh,
  token
}) => {
  const [taglineBn, setTaglineBn] = useState(settings.taglineBn || '');
  const [heroHeadlineBn, setHeroHeadlineBn] = useState(settings.heroHeadlineBn || '');
  const [heroDescriptionBn, setHeroDescriptionBn] = useState(settings.heroDescriptionBn || '');
  const [ctaAppointmentTextBn, setCtaAppointmentTextBn] = useState(settings.ctaAppointmentTextBn || '');
  const [emergencyHotline, setEmergencyHotline] = useState(settings.emergencyHotline || '');
  
  // 3 Hero Image URLs
  const [img1, setImg1] = useState(settings.heroImages?.[0] || '');
  const [img2, setImg2] = useState(settings.heroImages?.[1] || '');
  const [img3, setImg3] = useState(settings.heroImages?.[2] || '');

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');

    try {
      const heroImages = [img1, img2, img3].filter(url => url.trim().length > 0);

      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          taglineBn,
          heroHeadlineBn,
          heroDescriptionBn,
          ctaAppointmentTextBn,
          emergencyHotline,
          heroImages
        })
      });

      if (res.ok) {
        setSuccessMsg('হিরো সেকশন এবং ৩টি ছবির সেটিংস সফলভাবে আপডেট হয়েছে।');
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-900">হিরো ব্যানার ও ৩টি ছবির কনফিগারেশন</h3>
        <p className="text-xs text-slate-500">
          হোমপেজের মূল ব্যানার শিরোনাম, স্লোগান এবং স্বয়ংক্রিয়ভাবে ট্রানজিশন হওয়া ৩টি ছবির URL পরিবর্তন করুন।
        </p>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 3 Hero Image URLs with Live Previews */}
      <div className="border border-emerald-200 bg-emerald-50/40 p-5 rounded-2xl space-y-4">
        <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm">
          <Image className="w-4 h-4 text-emerald-700" />
          <span>হিরো ব্যানার ৩টি ছবি (ImgBB বা ইমেজ লিঙ্ক)</span>
        </div>
        <p className="text-xs text-slate-600">
          ছবিগুলো স্বয়ংক্রিয়ভাবে একটার পর একটা স্মুথ ফেড/স্কেল ট্রানজিশনে প্রদর্শিত হয়।
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Image 1 */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-700 block">১ম ছবি (Hero Image 1 URL)</span>
            <input
              type="url"
              value={img1}
              onChange={(e) => setImg1(e.target.value)}
              placeholder="https://i.ibb.co/..."
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-sans-en focus:ring-1 focus:ring-emerald-600"
            />
            {img1 && (
              <div className="h-24 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                <img src={img1} alt="Hero 1" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Image 2 */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-700 block">২য় ছবি (Hero Image 2 URL)</span>
            <input
              type="url"
              value={img2}
              onChange={(e) => setImg2(e.target.value)}
              placeholder="https://i.ibb.co/..."
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-sans-en focus:ring-1 focus:ring-emerald-600"
            />
            {img2 && (
              <div className="h-24 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                <img src={img2} alt="Hero 2" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Image 3 */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-700 block">৩য় ছবি (Hero Image 3 URL)</span>
            <input
              type="url"
              value={img3}
              onChange={(e) => setImg3(e.target.value)}
              placeholder="https://i.ibb.co/..."
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-sans-en focus:ring-1 focus:ring-emerald-600"
            />
            {img3 && (
              <div className="h-24 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                <img src={img3} alt="Hero 3" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Headlines and text */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">ক্লিনিক ট্যাগলাইন (Tagline)</label>
          <input
            type="text"
            value={taglineBn}
            onChange={(e) => setTaglineBn(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">মূল ব্যানার শিরোনাম (Hero Headline)</label>
          <input
            type="text"
            value={heroHeadlineBn}
            onChange={(e) => setHeroHeadlineBn(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">সহায়ক বিবরণী (Hero Description)</label>
          <textarea
            rows={3}
            value={heroDescriptionBn}
            onChange={(e) => setHeroDescriptionBn(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">সিরিয়াল বাটন টেক্সট</label>
            <input
              type="text"
              value={ctaAppointmentTextBn}
              onChange={(e) => setCtaAppointmentTextBn(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">জরুরি হটলাইন নম্বর</label>
            <input
              type="text"
              value={emergencyHotline}
              onChange={(e) => setEmergencyHotline(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-sans-en focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-800 hover:bg-emerald-900 transition shadow-sm"
        >
          {loading ? 'সংরক্ষণ হচ্ছে...' : 'হিরো সেটিংস সেভ করুন'}
        </button>
      </div>
    </form>
  );
};
