import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Calendar, HelpCircle, Phone } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
        <HelpCircle className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-bold text-slate-900 mb-2 font-sans-en">404</h1>
      <h2 className="text-xl font-bold text-slate-800 mb-2">পৃষ্ঠাটি খুঁজে পাওয়া যায়নি</h2>
      <p className="text-sm text-slate-600 max-w-md mb-6 leading-relaxed">
        আপনি যে লিংকটিতে প্রবেশ করতে চেয়েছেন তা পরিবর্তিত বা অপসারিত হতে পারে। বাংলাদেশ হোমিও হলের প্রধান পাতায় ফিরে যান অথবা সরাসরি সিরিয়াল বুক করুন।
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 text-white font-bold text-xs sm:text-sm hover:bg-emerald-900 transition shadow-sm"
        >
          <Home className="w-4 h-4" />
          <span>প্রধান পাতায় যান</span>
        </Link>
        <Link
          to="/appointment"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs sm:text-sm hover:bg-red-700 transition shadow-sm"
        >
          <Calendar className="w-4 h-4" />
          <span>সিরিয়াল বুক করুন</span>
        </Link>
      </div>
    </div>
  );
};
