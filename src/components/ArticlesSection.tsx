import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Article } from '../types.js';
import { BookOpen, Calendar, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { ArticleModal } from './ArticleModal.js';

interface ArticlesSectionProps {
  articles: Article[];
}

export const ArticlesSection: React.FC<ArticlesSectionProps> = ({ articles }) => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  if (!articles || articles.length === 0) return null;

  return (
    <section id="articles" className="py-20 bg-white relative border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
            <span>স্বাস্থ্য শিক্ষা ও সচেতনতামূলক নিবন্ধ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
            হোমিওপ্যাথি ও প্রাকৃতিক আরোগ্য বিষয়ক জ্ঞান
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            রোগীদের সচেতনতা বৃদ্ধি ও সঠিক স্বাস্থ্য নির্দেশনার জন্য ডা. তামজীদ হোসেনের তথ্যবহুল নিবন্ধ ও চিকিৎসাপত্র।
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => {
            const formattedDate = new Date(article.createdAt).toLocaleDateString('bn-BD', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            });

            return (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className="bg-slate-50 hover:bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-emerald-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Article Thumbnail */}
                  <div className="relative aspect-video w-full bg-slate-200 overflow-hidden">
                    <img
                      src={article.imageUrl || "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=600&q=80"}
                      alt={article.titleBn}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-emerald-950/80 backdrop-blur-sm text-emerald-200 text-xs font-semibold px-2.5 py-1 rounded-md border border-emerald-500/30">
                      {article.category}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-xs text-slate-400 mb-2.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formattedDate}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>৩ মিনিট পাঠ</span>
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 line-clamp-2 hover:text-emerald-800 transition-colors mb-2 leading-snug">
                      {article.titleBn}
                    </h3>

                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-3">
                      {article.excerptBn}
                    </p>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="px-6 pb-6 pt-2">
                  <button
                    onClick={() => setSelectedArticle(article)}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-100/70 hover:bg-emerald-200/70 transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>সম্পূর্ণ নিবন্ধটি পড়ুন</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.article>
            );
          })}
        </div>

      </div>

      {/* Modal Reader */}
      <ArticleModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />
    </section>
  );
};
