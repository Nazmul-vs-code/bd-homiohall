import React, { useState } from 'react';
import { Chamber } from '../../types.js';
import { MapPin, CheckCircle, Edit2, Save } from 'lucide-react';

interface ChambersTabProps {
  chambers: Chamber[];
  onRefresh: () => void;
  token: string;
}

export const ChambersTab: React.FC<ChambersTabProps> = ({
  chambers,
  onRefresh,
  token
}) => {
  const [selectedChamber, setSelectedChamber] = useState<Chamber | null>(chambers[0] || null);

  // Form states
  const [nameBn, setNameBn] = useState(selectedChamber?.nameBn || '');
  const [nameEn, setNameEn] = useState(selectedChamber?.nameEn || '');
  const [addressBn, setAddressBn] = useState(selectedChamber?.addressBn || '');
  const [addressEn, setAddressEn] = useState(selectedChamber?.addressEn || '');
  const [visitingDaysBn, setVisitingDaysBn] = useState(selectedChamber?.visitingDaysBn || '');
  const [visitingDaysEn, setVisitingDaysEn] = useState(selectedChamber?.visitingDaysEn || '');
  const [visitingHoursBn, setVisitingHoursBn] = useState(selectedChamber?.visitingHoursBn || '');
  const [visitingHoursEn, setVisitingHoursEn] = useState(selectedChamber?.visitingHoursEn || '');
  const [phone, setPhone] = useState(selectedChamber?.phone || '');
  const [mapUrl, setMapUrl] = useState(selectedChamber?.mapUrl || '');

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const selectChamberForEdit = (c: Chamber) => {
    setSelectedChamber(c);
    setNameBn(c.nameBn);
    setNameEn(c.nameEn);
    setAddressBn(c.addressBn);
    setAddressEn(c.addressEn);
    setVisitingDaysBn(c.visitingDaysBn);
    setVisitingDaysEn(c.visitingDaysEn);
    setVisitingHoursBn(c.visitingHoursBn);
    setVisitingHoursEn(c.visitingHoursEn);
    setPhone(c.phone);
    setMapUrl(c.mapUrl || '');
    setSuccessMsg('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChamber) return;
    setLoading(true);
    setSuccessMsg('');

    try {
      const res = await fetch(`/api/admin/chambers/${selectedChamber.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nameBn,
          nameEn,
          addressBn,
          addressEn,
          visitingDaysBn,
          visitingDaysEn,
          visitingHoursBn,
          visitingHoursEn,
          phone,
          mapUrl
        })
      });

      if (res.ok) {
        setSuccessMsg(`${nameBn} এর তথ্য সফলভাবে আপডেট হয়েছে।`);
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-900">চেম্বার ও সময়সূচী ব্যবস্থাপনা</h3>
        <p className="text-xs text-slate-500">মতলব ও হাজীগঞ্জ চেম্বারের ঠিকানা, যোগাযোগের ফোন নম্বর এবং রোগী দেখার সময়সূচী পরিবর্তন করুন।</p>
      </div>

      {/* Select Which Chamber to Edit */}
      <div className="flex items-center gap-3">
        {chambers.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => selectChamberForEdit(c)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              selectedChamber?.id === c.id
                ? 'bg-emerald-800 text-white shadow-md'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>{c.nameBn}</span>
          </button>
        ))}
      </div>

      {selectedChamber && (
        <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h4 className="text-base font-bold text-slate-900">
              সম্পাদনা: {selectedChamber.nameBn}
            </h4>
            <span className="text-xs text-slate-400 font-sans-en">ID: {selectedChamber.id}</span>
          </div>

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">চেম্বারের নাম (বাংলা)</label>
              <input
                type="text"
                required
                value={nameBn}
                onChange={(e) => setNameBn(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">চেম্বারের নাম (ইংরেজি)</label>
              <input
                type="text"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-sans-en focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ঠিকানা (বাংলা)</label>
              <textarea
                rows={2}
                value={addressBn}
                onChange={(e) => setAddressBn(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ঠিকানা (ইংরেজি)</label>
              <textarea
                rows={2}
                value={addressEn}
                onChange={(e) => setAddressEn(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-sans-en focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">রোগী দেখার দিনসমূহ (বাংলা)</label>
              <input
                type="text"
                value={visitingDaysBn}
                onChange={(e) => setVisitingDaysBn(e.target.value)}
                placeholder="যেমন: শনিবার, রবিবার ও বৃহস্পতিবার"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">রোগী দেখার সময় (বাংলা)</label>
              <input
                type="text"
                value={visitingHoursBn}
                onChange={(e) => setVisitingHoursBn(e.target.value)}
                placeholder="যেমন: সকাল ১০টা থেকে রাত ০৮টা পর্যন্ত"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">চেম্বারের যোগাযোগের ফোন</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+88 01714-990001"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-sans-en focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">গুগল ম্যাপ লিংক (URL)</label>
              <input
                type="url"
                value={mapUrl}
                onChange={(e) => setMapUrl(e.target.value)}
                placeholder="https://maps.google.com/..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-sans-en focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-800 hover:bg-emerald-900 transition shadow-sm flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'সংরক্ষণ হচ্ছে...' : 'চেম্বার তথ্য আপডেট করুন'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
