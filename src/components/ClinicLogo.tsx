import React from 'react';

interface ClinicLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
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
    sm: 'w-9 h-9',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
    xl: 'w-18 h-18'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Official Bangladesh Homoeo Hall Logo Emblem */}
      <div className={`relative ${iconSizes[size]} flex items-center justify-center rounded-full overflow-hidden shadow-md flex-shrink-0 border-2 ${lightMode ? 'border-white/90 ring-2 ring-emerald-500/40 bg-white' : 'border-emerald-600/30 bg-white'}`}>
        <img
          src="/logo.png"
          alt="Bangladesh Homoeo Hall"
          className="w-full h-full object-cover rounded-full"
          onError={(e) => {
            // Fallback gracefully if image fails
            const target = e.currentTarget;
            target.style.display = 'none';
          }}
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold tracking-tight leading-tight ${lightMode ? 'text-white' : 'text-slate-900'} ${size === 'lg' || size === 'xl' ? 'text-2xl' : size === 'sm' ? 'text-base' : 'text-xl'}`}>
            বাংলাদেশ হোমিও হল
          </span>
          <span className={`text-[11px] sm:text-xs font-bold tracking-wider uppercase font-sans-en ${lightMode ? 'text-emerald-300' : 'text-emerald-800'}`}>
            Bangladesh Homoeo Hall <span className="text-[10px] font-normal opacity-85">| Estd. 1992</span>
          </span>
        </div>
      )}
    </div>
  );
};
