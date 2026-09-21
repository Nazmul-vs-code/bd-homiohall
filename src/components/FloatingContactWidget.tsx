import React, { useState } from 'react';
import { Phone, MessageCircle, Calendar, X, HeartPulse } from 'lucide-react';

interface FloatingContactWidgetProps {
  onOpenAppointment: () => void;
}

export const FloatingContactWidget: React.FC<FloatingContactWidgetProps> = ({ onOpenAppointment }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {/* Expanded Quick Options */}
      {isExpanded && (
        <div className="flex flex-col items-end gap-2.5 animate-fadeIn">
          {/* Appointment Option */}
          <button
            onClick={() => {
              setIsExpanded(false);
              onOpenAppointment();
            }}
            className="flex items-center gap-2.5 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-full shadow-lg text-xs font-bold transition-all transform hover:scale-105 cursor-pointer"
          >
            <span>সিরিয়ালের জন্য আবেদন</span>
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </button>

          {/* WhatsApp / Chat */}
          <a
            href="https://wa.me/8801714990001?text=হ্যালো%20বাংলাদেশ%20হোমিও%20হল,%20আমি%20একটি%20পরামর্শ/সিরিয়াল%20নিতে%20চাই।"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2.5 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-full shadow-lg text-xs font-bold transition-all transform hover:scale-105"
          >
            <span>হোয়াটসঅ্যাপে যোগাযোগ</span>
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
              <MessageCircle className="w-4 h-4" />
            </div>
          </a>

          {/* Direct Phone Call */}
          <a
            href="tel:+8801714990001"
            className="flex items-center gap-2.5 bg-emerald-950 hover:bg-black text-white px-4 py-2.5 rounded-full shadow-lg text-xs font-bold transition-all transform hover:scale-105"
          >
            <span className="font-sans-en">+88 01714-990001</span>
            <div className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </div>
          </a>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer ${
          isExpanded
            ? 'bg-slate-800 text-white rotate-90'
            : 'bg-gradient-to-tr from-emerald-800 via-emerald-700 to-red-600 text-white animate-bounce-subtle'
        }`}
        aria-label="Contact and Appointment Hotline"
      >
        {isExpanded ? (
          <X className="w-6 h-6" />
        ) : (
          <Phone className="w-6 h-6 text-white" />
        )}
      </button>
    </div>
  );
};
