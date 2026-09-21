import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../types.js';
import { BookOpen, Calendar, Clock, ArrowRight, Search, Sparkles, Tag, User } from 'lucide-react';
import { ArticleModal } from '../components/ArticleModal.js';

interface ArticlesPageProps {
  articles: Article[];
}

export const ArticlesPage: React.FC<ArticlesPageProps> = ({ articles }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

  const categories = ['all', ...Array.from(new Set(articles.map((a) => a.category).filter(Boolean)))];

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.titleBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.contentBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerptBn.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedCategory === 'all') return matchesSearch;
    return matchesSearch && article.category === selectedCategory;
  });

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white py-14 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-2 text-xs text-emerald-300 mb-3">
            <Link to="/" className="hover:text-white transition">হোম</Link>
            <span>/</span>
            <span className="text-white font-medium">স্বাস্থ্য নিবন্ধ</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-3">
            হোমিওপ্যাথি ও স্বাস্থ্য বিষয়ক নিবন্ধ
          </h1>
          <p className="text-emerald-200 text-sm sm:text-base max-w-2xl leading-relaxed">
            রোগীদের সচেতনতা বৃদ্ধি ও সঠিক স্বাস্থ্য নির্দেশনার জন্য ডা. তামজীদ হোসেনের তথ্যবহুল নিবন্ধ ও স্বাস্থ্য পরামর্শ।
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Search & Category Filter */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8 space-y-4">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="নিবন্ধ বা স্বাস্থ্য পরামর্শ খুঁজুন..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-xs sm:text-sm"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 pt-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat === 'all' ? 'সকল নিবন্ধ' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
            <article
              key={article.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between group"
            >
              <div>
                {article.imageUrl ? (
                  <div className="h-48 overflow-hidden bg-slate-100 relative">
                    <img
                      src={article.imageUrl}
                      alt={article.titleBn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-emerald-900/90 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                      {article.category}
                    </div>
                  </div>
                ) : (
                  <div className="h-32 bg-emerald-900 flex items-center justify-center p-6 relative">
                    <BookOpen className="w-10 h-10 text-emerald-400/50" />
                    <div className="absolute top-3 left-3 bg-emerald-800 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                      {article.category}
                    </div>
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{new Date(article.createdAt).toLocaleDateString('bn-BD', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-emerald-700" />
                      <span>ডা. তামজীদ হোসেন</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-800 transition line-clamp-2">
                    {article.titleBn}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                    {article.excerptBn}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setActiveArticle(article)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition cursor-pointer"
                >
                  <span>সম্পূর্ণ নিবন্ধ পড়ুন</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-slate-700 font-bold text-base mb-1">কোনো নিবন্ধ পাওয়া যায়নি</h4>
            <p className="text-xs text-slate-500">অন্য বিষয় বা শব্দ দিয়ে অনুসন্ধান করে চেষ্টা করুন।</p>
          </div>
        )}

      </div>

      {activeArticle && (
        <ArticleModal
          article={activeArticle}
          onClose={() => setActiveArticle(null)}
        />
      )}
    </div>
  );
};
