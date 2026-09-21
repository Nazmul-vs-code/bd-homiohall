import React, { useState } from 'react';
import { Article } from '../../types.js';
import { Plus, Edit2, Trash2, Eye, EyeOff, X, BookOpen, Calendar } from 'lucide-react';

interface ArticlesTabProps {
  articles: Article[];
  onRefresh: () => void;
  token: string;
}

export const ArticlesTab: React.FC<ArticlesTabProps> = ({
  articles,
  onRefresh,
  token
}) => {
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states
  const [titleBn, setTitleBn] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [excerptBn, setExcerptBn] = useState('');
  const [contentBn, setContentBn] = useState('');
  const [category, setCategory] = useState('সাধারণ স্বাস্থ্য');
  const [imageUrl, setImageUrl] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  const startCreate = () => {
    setIsCreating(true);
    setEditingArticle(null);
    setTitleBn('');
    setTitleEn('');
    setExcerptBn('');
    setContentBn('');
    setCategory('সাধারণ স্বাস্থ্য');
    setImageUrl('');
    setIsPublished(true);
  };

  const startEdit = (a: Article) => {
    setEditingArticle(a);
    setIsCreating(false);
    setTitleBn(a.titleBn);
    setTitleEn(a.titleEn || '');
    setExcerptBn(a.excerptBn || '');
    setContentBn(a.contentBn || '');
    setCategory(a.category || 'সাধারণ স্বাস্থ্য');
    setImageUrl(a.imageUrl || '');
    setIsPublished(a.isPublished);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        titleBn,
        titleEn,
        excerptBn,
        contentBn,
        category,
        imageUrl,
        isPublished
      };

      if (isCreating) {
        await fetch('/api/admin/articles', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      } else if (editingArticle) {
        await fetch(`/api/admin/articles/${editingArticle.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      }

      setIsCreating(false);
      setEditingArticle(null);
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('আপনি কি নিশ্চিত এই নিবন্ধটি মুছে ফেলতে চান?')) return;
    try {
      await fetch(`/api/admin/articles/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      onRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  const handleTogglePublished = async (a: Article) => {
    try {
      await fetch(`/api/admin/articles/${a.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isPublished: !a.isPublished })
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
          <h3 className="text-lg font-bold text-slate-900">স্বাস্থ্য সচেতনতা ও নিবন্ধ ব্যবস্থাপনা</h3>
          <p className="text-xs text-slate-500">মোট নিবন্ধ: {articles.length} টি</p>
        </div>

        {!isCreating && !editingArticle && (
          <button
            onClick={startCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 transition shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন নিবন্ধ লিখুন</span>
          </button>
        )}
      </div>

      {/* Form (Create / Edit) */}
      {(isCreating || editingArticle) && (
        <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border-2 border-emerald-500/40 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-base font-bold text-slate-900">
              {isCreating ? 'নতুন স্বাস্থ্য নিবন্ধ প্রকাশ করুন' : 'নিবন্ধ সম্পাদনা করুন'}
            </h4>
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setEditingArticle(null);
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
                placeholder="যেমন: বন্ধ্যাত্ব ও কার্যকর হোমিওপ্যাথিক সমাধান"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ইংরেজি শিরোনাম</label>
              <input
                type="text"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="e.g. Infertility and Safe Homeopathy"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-sans-en focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ক্যাটাগরি</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="যেমন: বন্ধ্যাত্ব / প্রতিরোধ / সুস্থ জীবন"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ছবির লিংক (ImgBB / Image URL)</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://i.ibb.co/..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-sans-en focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">সংক্ষিপ্ত সারসংক্ষেপ (Excerpt)</label>
            <textarea
              rows={2}
              value={excerptBn}
              onChange={(e) => setExcerptBn(e.target.value)}
              placeholder="নিবন্ধের মূল বার্তা এক বা দুই লাইনে..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">সম্পূর্ণ নিবন্ধ পাঠ (Content)</label>
            <textarea
              rows={8}
              required
              value={contentBn}
              onChange={(e) => setContentBn(e.target.value)}
              placeholder="নিবন্ধের বিস্তারিত আলোচনা লিখুন..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isPublished"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
            />
            <label htmlFor="isPublished" className="text-xs font-bold text-slate-700 cursor-pointer">
              প্রকাশিত রাখুন (Published on public website)
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setEditingArticle(null);
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
              {loading ? 'সংরক্ষণ হচ্ছে...' : 'নিবন্ধ প্রকাশ করুন'}
            </button>
          </div>
        </form>
      )}

      {/* Articles List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {articles.map((a) => (
          <div
            key={a.id}
            className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  {a.category}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  a.isPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                }`}>
                  {a.isPublished ? 'প্রকাশিত' : 'খসড়া (Draft)'}
                </span>
              </div>

              <h4 className="text-base font-bold text-slate-900 line-clamp-1 mb-1">{a.titleBn}</h4>
              <p className="text-xs text-slate-500 line-clamp-2">{a.excerptBn}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">
                {new Date(a.createdAt).toLocaleDateString('bn-BD')}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleTogglePublished(a)}
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
                  title={a.isPublished ? "খসড়া করুন" : "প্রকাশ করুন"}
                >
                  {a.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => startEdit(a)}
                  className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50"
                  title="সম্পাদনা করুন"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(a.id)}
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
