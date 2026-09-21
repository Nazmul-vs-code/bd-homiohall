import React, { useState } from 'react';
import { Treatment } from '../../types.js';
import { Plus, Edit2, Trash2, Eye, EyeOff, Check, X, Image, ArrowUpDown } from 'lucide-react';

interface TreatmentsTabProps {
  treatments: Treatment[];
  onRefresh: () => void;
  token: string;
}

export const TreatmentsTab: React.FC<TreatmentsTabProps> = ({
  treatments,
  onRefresh,
  token
}) => {
  const [editingTreatment, setEditingTreatment] = useState<Treatment | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states
  const [titleBn, setTitleBn] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [descriptionBn, setDescriptionBn] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [icon, setIcon] = useState('Stethoscope');
  const [order, setOrder] = useState(1);
  const [isActive, setIsActive] = useState(true);

  const startCreate = () => {
    setIsCreating(true);
    setEditingTreatment(null);
    setTitleBn('');
    setTitleEn('');
    setDescriptionBn('');
    setDescriptionEn('');
    setCategory('সাধারণ চিকিৎসা');
    setImageUrl('');
    setIcon('Stethoscope');
    setOrder(treatments.length + 1);
    setIsActive(true);
  };

  const startEdit = (t: Treatment) => {
    setEditingTreatment(t);
    setIsCreating(false);
    setTitleBn(t.titleBn);
    setTitleEn(t.titleEn || '');
    setDescriptionBn(t.descriptionBn || '');
    setDescriptionEn(t.descriptionEn || '');
    setCategory(t.category || 'সাধারণ চিকিৎসা');
    setImageUrl(t.imageUrl || '');
    setIcon(t.icon || 'Stethoscope');
    setOrder(t.order || 1);
    setIsActive(t.isActive);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        titleBn,
        titleEn,
        descriptionBn,
        descriptionEn,
        category,
        imageUrl,
        icon,
        order: Number(order),
        isActive
      };

      if (isCreating) {
        await fetch('/api/admin/treatments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      } else if (editingTreatment) {
        await fetch(`/api/admin/treatments/${editingTreatment.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      }

      setIsCreating(false);
      setEditingTreatment(null);
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('আপনি কি নিশ্চিত এই চিকিৎসা সেবাটি মুছে ফেলতে চান?')) return;
    try {
      await fetch(`/api/admin/treatments/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      onRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleActive = async (t: Treatment) => {
    try {
      await fetch(`/api/admin/treatments/${t.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !t.isActive })
      });
      onRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
        <div>
          <h3 className="text-lg font-bold text-slate-900">চিকিৎসা সেবা ব্যবস্থাপনা (MongoDB Dynamic Services)</h3>
          <p className="text-xs text-slate-500">মোট সেবা: {treatments.length} টি</p>
        </div>

        {!isCreating && !editingTreatment && (
          <button
            onClick={startCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 transition shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন সেবা যোগ করুন</span>
          </button>
        )}
      </div>

      {/* Form (Create / Edit) */}
      {(isCreating || editingTreatment) && (
        <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border-2 border-emerald-500/40 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-base font-bold text-slate-900">
              {isCreating ? 'নতুন চিকিৎসা সেবা যুক্ত করুন' : 'চিকিৎসা সেবা সম্পাদনা করুন'}
            </h4>
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setEditingTreatment(null);
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">বাংলা শিরোনাম *</label>
              <input
                type="text"
                required
                value={titleBn}
                onChange={(e) => setTitleBn(e.target.value)}
                placeholder="যেমন: বন্ধ্যাত্ব - সন্তান না হওয়া"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ইংরেজি শিরোনাম</label>
              <input
                type="text"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="e.g. Infertility Treatment"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-sans-en focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ক্যাটাগরি</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="যেমন: প্রজনন স্বাস্থ্য / স্ত্রীরোগ"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">প্রদর্শন ক্রম (Order)</label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-sans-en focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">আইকন নাম</label>
              <select
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-sans-en focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              >
                <option value="Stethoscope">Stethoscope (স্টেথোস্কোপ)</option>
                <option value="HeartPulse">HeartPulse (হৃদস্পন্দন/স্বাস্থ্য)</option>
                <option value="Baby">Baby (মা ও শিশু)</option>
                <option value="ShieldAlert">ShieldAlert (টিউমার/ক্যান্সার)</option>
                <option value="Activity">Activity (হরমোন)</option>
                <option value="Sparkles">Sparkles (স্ত্রীস্বাস্থ্য)</option>
                <option value="ShieldCheck">ShieldCheck (সুরক্ষা)</option>
                <option value="PlusCircle">PlusCircle (পাইলস)</option>
                <option value="SunMedium">SunMedium (চর্মরোগ)</option>
                <option value="Thermometer">Thermometer (টনসিল)</option>
                <option value="FileText">FileText (কিডনি পাথর)</option>
                <option value="Zap">Zap (আঁচিল)</option>
                <option value="Wind">Wind (নাক ও শ্বাসকষ্ট)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">বাংলায় বিস্তারিত বিবরণ</label>
            <textarea
              rows={3}
              value={descriptionBn}
              onChange={(e) => setDescriptionBn(e.target.value)}
              placeholder="চিকিৎসার সুফল ও পদ্ধতি সংক্ষেপে লিখুন..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ছবির লিংক (Image URL - ImgBB বা সরাসরি ইমেজ লিংক)
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://i.ibb.co/... বা https://images.unsplash.com/..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-sans-en focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
            {imageUrl && (
              <div className="mt-2 flex items-center gap-3">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-16 h-12 object-cover rounded-lg border border-slate-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=Invalid';
                  }}
                />
                <span className="text-xs text-slate-400 font-sans-en">লাইভ প্রিভিউ</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
            />
            <label htmlFor="isActive" className="text-xs font-bold text-slate-700 cursor-pointer">
              ওয়েবসাইটে সক্রিয় রাখুন (Active on public website)
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setEditingTreatment(null);
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 shadow-sm"
            >
              {loading ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}
            </button>
          </div>
        </form>
      )}

      {/* Treatments List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {treatments.map((t) => (
          <div
            key={t.id}
            className={`bg-white rounded-2xl p-4 border transition ${
              t.isActive ? 'border-slate-200' : 'border-slate-200 bg-slate-50 opacity-70'
            } shadow-sm hover:shadow-md flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 font-sans-en">#{t.order}</span>
                  <h4 className="text-base font-bold text-slate-900">{t.titleBn}</h4>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  t.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                }`}>
                  {t.isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                </span>
              </div>

              <p className="text-xs text-slate-400 font-sans-en mb-2">{t.titleEn}</p>
              <p className="text-xs text-slate-600 line-clamp-2">{t.descriptionBn}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px] font-sans-en">Icon: {t.icon}</span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleToggleActive(t)}
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
                  title={t.isActive ? "নিষ্ক্রিয় করুন" : "সক্রিয় করুন"}
                >
                  {t.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => startEdit(t)}
                  className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50"
                  title="সম্পাদনা করুন"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                  title="মুছে ফেলুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
