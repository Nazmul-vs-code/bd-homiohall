import React from 'react';
import { motion } from 'motion/react';
import { Lock, SearchCheck, HeartHandshake, Sparkles, Shield, UserCheck } from 'lucide-react';

export const TrustPhilosophy: React.FC = () => {
  const commitments = [
    {
      icon: Lock,
      titleBn: "রোগীর তথ্যের কঠোর গোপনীয়তা",
      titleEn: "Strict Patient Privacy",
      descriptionBn: "প্রতিটি রোগীর শারীরিক ও পারিবারিক তথ্যাবলী পূর্ণ বিশ্বস্ততা ও সর্বোচ্চ সতর্কতার সাথে সংরক্ষণ করা হয়। কোনো তথ্যই তৃতীয় পক্ষের নিকট প্রকাশ করা হয় না।",
      badge: "১০০% সুরক্ষিত",
      color: "emerald"
    },
    {
      icon: SearchCheck,
      titleBn: "ওষুধ নির্বাচনের পূর্বে সঠিক রোগ নির্ণয়",
      titleEn: "Accurate Disease Diagnosis",
      descriptionBn: "রোগের মূল কারণ উদঘাটনে সামগ্রিক লক্ষণ, প্যাথলজিক্যাল রিপোর্ট এবং মানসিক চাপ সতর্কতার সাথে পরীক্ষা করে সূক্ষ্ম ও উপযুক্ত হোমিওপ্যাথিক ঔষধ নির্বাচন করা হয়।",
      badge: "বিজ্ঞানসম্মত পদ্ধতি",
      color: "emerald"
    },
    {
      icon: HeartHandshake,
      titleBn: "আন্তরিক, সৎ ও মানবিক চিকিৎসা",
      titleEn: "Compassionate & Honest Care",
      descriptionBn: "রোগীর প্রতি পূর্ণ মনোযোগ ও সহানুভূতিশীল আচরণের মাধ্যমে চিকিৎসা সেবা প্রদান। অযথা অপ্রয়োজনীয় পরীক্ষা বা দীর্ঘমেয়াদী জটিলতা ছাড়াই আরোগ্যের পথ সুগম করা।",
      badge: "মানবিক দৃষ্টিভঙ্গি",
      color: "red"
    }
  ];

  return (
    <section id="philosophy" className="py-20 bg-slate-50 relative overflow-hidden border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>চিকিৎসা দর্শন ও মূল অঙ্গীকার</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
            রোগীর সামগ্রিক স্বাস্থ্যের প্রতি আমাদের স্থায়ী দায়বদ্ধতা
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            আমরা কেবল বাহ্যিক উপসর্গের উপশম করি না; রোগীর সম্পূর্ণ শারীরিক, মানসিক ও জীবনযাত্রার বিশ্লেষণের মাধ্যমে রোগীকে সম্পূর্ণভাবে সুস্থ করে তোলাই আমাদের প্রধান ব্রত।
          </p>
        </div>

        {/* 3 Pillars Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {commitments.map((item, idx) => {
            const Icon = item.icon;
            const isRed = item.color === 'red';
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                whileHover={{ y: -6 }}
                className={`bg-white rounded-2xl p-7 shadow-sm hover:shadow-xl transition-all duration-300 border ${
                  isRed ? 'hover:border-red-300' : 'hover:border-emerald-300'
                } border-slate-200 flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isRed ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      isRed ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}>
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-1">
                    {item.titleBn}
                  </h3>
                  <p className="text-xs font-semibold text-slate-400 font-sans-en mb-3">
                    {item.titleEn}
                  </p>

                  <p className="text-slate-600 text-sm leading-relaxed">
                    {item.descriptionBn}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-emerald-800">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span>ডা. তামজীদ হোসেনের প্রত্যক্ষ পর্যবেক্ষণ</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Trust Banner Bar */}
        <div className="mt-12 bg-gradient-to-r from-emerald-900 to-emerald-950 text-white rounded-2xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-800/80 border border-emerald-600/40 flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h4 className="text-lg font-bold">জার্মান ও বিশ্বমানের খাঁটি হোমিওপ্যাথিক ওষুধ</h4>
              <p className="text-emerald-200/90 text-xs sm:text-sm mt-0.5">
                আমরা সর্বোচ্চ মানের প্রাকৃতিক ও সিলগালাকৃত বিশুদ্ধ ওষুধ ব্যবহার করে থাকি।
              </p>
            </div>
          </div>
          <div className="flex-shrink-0">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-white text-emerald-900 hover:bg-emerald-50 shadow transition cursor-pointer"
            >
              <span>আমাদের সাথে পরামর্শ করুন</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
