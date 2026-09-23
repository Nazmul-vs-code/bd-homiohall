import React from 'react';
import { Link } from 'react-router-dom';
import { ClinicLogo } from './ClinicLogo.js';
import { Phone, MapPin, Mail, Calendar, Facebook, Twitter, Youtube, ExternalLink, Heart } from 'lucide-react';
import { Chamber, Treatment } from '../types.js';

interface FooterProps {
  chambers: Chamber[];
  treatments: Treatment[];
  onOpenAppointment: () => void;
  onOpenLogin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  chambers,
  treatments,
  onOpenAppointment,
  onOpenLogin
}) => {
  return (
    <footer id="contact" className="bg-[#003870] text-blue-100 border-t border-[#002852] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-blue-400/20">
          
          {/* Col 1: Brand & Bio (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <ClinicLogo size="lg" lightMode={true} />
            
            <p className="text-blue-100 text-xs sm:text-sm leading-relaxed mt-3 font-normal">
              বাংলাদেশ হোমিও হল—দীর্ঘদিনের জটিল ও পুরনো রোগের বিশ্বস্ত হোমিওপ্যাথিক চিকিৎসা কেন্দ্র। চাঁদপুর হোমিওপ্যাথিক মেডিকেল কলেজের প্রিন্সিপাল ডা. তামজীদ হোসেন এবং সহকারী অধ্যাপক ডা. মোঃ আশরাফ আলীর প্রত্যক্ষ পরিচালনায় আধুনিক ও বিজ্ঞানসম্মত চিকিৎসা সেবা।
            </p>

            {/* Direct Phone Numbers */}
            <div className="pt-2 space-y-2">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                সিরিয়াল ও জরুরি হটলাইন:
              </span>
              <div className="flex flex-col gap-1.5 font-sans-en">
                <a
                  href="tel:+8801714990001"
                  className="flex items-center gap-2 text-white hover:text-amber-200 transition text-sm font-bold"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>+88 01714-990001</span>
                </a>
                <a
                  href="tel:+8801614990001"
                  className="flex items-center gap-2 text-white hover:text-amber-200 transition text-sm font-bold"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>+88 01614-990001</span>
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-[#004b94] hover:bg-emerald-600 text-white flex items-center justify-center transition border border-blue-400/30"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-[#004b94] hover:bg-emerald-600 text-white flex items-center justify-center transition border border-blue-400/30"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-[#004b94] hover:bg-emerald-600 text-white flex items-center justify-center transition border border-blue-400/30"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-l-2 border-emerald-400 pl-2">
              প্রয়োজনীয় লিংক
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-blue-100 font-medium">
              <li>
                <Link to="/" className="hover:text-amber-300 transition-colors">প্রধান পাতা</Link>
              </li>
              <li>
                <Link to="/doctor" className="hover:text-amber-300 transition-colors">অভিজ্ঞ চিকিৎসকবৃন্দ</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-amber-300 transition-colors">চিকিৎসা সেবাসমূহ</Link>
              </li>
              <li>
                <Link to="/chambers" className="hover:text-amber-300 transition-colors">চেম্বার ও সময়সূচী</Link>
              </li>
              <li>
                <Link to="/appointment" className="hover:text-amber-300 transition-colors">অনলাইন সিরিয়াল</Link>
              </li>
              <li>
                <Link to="/articles" className="hover:text-amber-300 transition-colors">স্বাস্থ্য পরামর্শ</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-amber-300 transition-colors">যোগাযোগ</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Key Treatments (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-l-2 border-emerald-400 pl-2">
              জনপ্রিয় চিকিৎসাসমূহ
            </h4>
            <ul className="space-y-2 text-xs text-blue-100 font-medium">
              {treatments.slice(0, 6).map((t) => (
                <li key={t.id} className="truncate">
                  <Link to="/services" className="hover:text-amber-300 transition-colors">
                    • {t.titleBn}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Chambers Summary (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-l-2 border-emerald-400 pl-2">
              চেম্বার ঠিকানা
            </h4>

            {chambers.map((c) => (
              <div key={c.id} className="bg-[#002d59] border border-blue-400/30 rounded-xl p-3 text-xs shadow-sm">
                <p className="font-bold text-white text-sm">{c.nameBn}</p>
                <p className="text-blue-100 mt-1 leading-snug">{c.addressBn}</p>
                <p className="text-amber-300 font-semibold mt-1">সময়: {c.visitingHoursBn}</p>
              </div>
            ))}
          </div>

        </div>

        {/* Bottom Bar with Copyright & Made by Nazmul */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-blue-200/90">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} বাংলাদেশ হোমিও হল (Bangladesh Homoeo Hall). All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-blue-100 font-medium tracking-wide">
              Made by <span className="font-bold text-white">Nazmul</span>
            </span>

            <button
              onClick={onOpenLogin}
              className="text-xs text-blue-200 hover:text-white transition underline cursor-pointer font-medium"
            >
              ক্লিনিক ম্যানেজমেন্ট পোর্টাল
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
