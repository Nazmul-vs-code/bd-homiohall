import React from 'react';

interface ClinicLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  lightMode?: boolean;
}

export const ClinicLogo: React.FC<ClinicLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  lightMode = false
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Visual Emblem */}
      <div className={`relative ${iconSizes[size]} flex items-center justify-center rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-900 shadow-md p-1 border border-emerald-600/30 flex-shrink-0`}>
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Medical circle base */}
          <circle cx="50" cy="50" r="44" stroke="#ffffff" strokeWidth="3" strokeDasharray="4 2" opacity="0.4" />
          
          {/* Green Medicinal Leaves */}
          <path d="M50 20 C35 32 30 52 50 78 C70 52 65 32 50 20 Z" fill="#10b981" />
          <path d="M50 20 C42 36 44 58 50 78" stroke="#047857" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M50 36 C42 42 38 48 38 52" stroke="#047857" strokeWidth="2" strokeLinecap="round" />
          <path d="M50 48 C58 52 62 58 62 62" stroke="#047857" strokeWidth="2" strokeLinecap="round" />
          
          {/* Red Medical Cross Accent */}
          <rect x="43" y="44" width="14" height="24" rx="2" fill="#ef4444" />
          <rect x="38" y="49" width="24" height="14" rx="2" fill="#ef4444" />
          <circle cx="50" cy="56" r="3" fill="#ffffff" />
        </svg>
        {/* Glow indicator */}
        <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
        </span>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold tracking-tight leading-tight ${lightMode ? 'text-white' : 'text-slate-900'} ${size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-base' : 'text-xl'}`}>
            বাংলাদেশ হোমিও হল
          </span>
          <span className={`text-xs font-semibold tracking-wider uppercase font-sans-en ${lightMode ? 'text-emerald-200' : 'text-emerald-800'}`}>
            Bangladesh Homoeo Hall
          </span>
        </div>
      )}
    </div>
  );
};
