import React from 'react';
import { Article } from '../types.js';
import { X, Calendar, Clock, Tag, Share2, ArrowLeft } from 'lucide-react';

interface ArticleModalProps {
  article: Article | null;
  onClose: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose }) => {
  if (!article) return null;

  const formattedDate = new Date(article.createdAt).toLocaleDateString('bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-100 text-emerald-800">
              {article.category}
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formattedDate}</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {article.imageUrl && (
            <div className="rounded-2xl overflow-hidden max-h-72 w-full bg-slate-100 shadow-sm">
              <img
                src={article.imageUrl}
                alt={article.titleBn}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">
              {article.titleBn}
            </h2>
            {article.titleEn && (
              <p className="text-xs font-semibold text-slate-400 font-sans-en mt-1">
                {article.titleEn}
              </p>
            )}
          </div>

          <div className="border-l-4 border-emerald-600 pl-4 py-1 bg-emerald-50/50 rounded-r-xl">
            <p className="text-emerald-950 font-medium text-sm sm:text-base italic leading-relaxed">
              "{article.excerptBn}"
            </p>
          </div>

          {/* Article Main Text */}
          <div className="prose prose-slate max-w-none text-slate-700 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line">
            {article.contentBn}
          </div>

          {/* Author Badge */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-xs">
                ডা.
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">ডা. তামজীদ হোসেন</p>
                <p className="text-[11px] text-slate-500">প্রিন্সিপাল, চাঁদপুর হোমিওপ্যাথিক মেডিকেল কলেজ</p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>ফিরে যান</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
