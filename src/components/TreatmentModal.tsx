import React from 'react';
import { Treatment } from '../types.js';
import { X, Calendar, Phone, CheckCircle, ShieldCheck } from 'lucide-react';

interface TreatmentModalProps {
  treatment: Treatment | null;
  onClose: () => void;
  onSelectForAppointment: (serviceName: string) => void;
}

export const TreatmentModal: React.FC<TreatmentModalProps> = ({
  treatment,
  onClose,
  onSelectForAppointment
}) => {
  if (!treatment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with image if available */}
        <div className="relative bg-emerald-950 text-white p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-white transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-800 text-emerald-200 border border-emerald-600/40 inline-block mb-2">
            {treatment.category || "বিশেষায়িত হোমিওপ্যাথি"}
          </span>
          <h3 className="text-2xl font-bold">{treatment.titleBn}</h3>
          <p className="text-emerald-300 text-xs font-sans-en mt-0.5">{treatment.titleEn}</p>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {treatment.imageUrl && (
            <div className="mb-4 rounded-xl overflow-hidden h-48 bg-slate-100 border border-slate-200">
              <img
                src={treatment.imageUrl}
                alt={treatment.titleBn}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="mb-6">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              চিকিৎসার বিবরণ ও সুফল
            </h4>
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
              {treatment.descriptionBn || treatment.descriptionEn}
            </p>
          </div>

          <div className="bg-emerald-50 rounded-xl p-3.5 border border-emerald-100 flex items-start gap-3 mb-6">
            <ShieldCheck className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700 leading-normal">
              <span className="font-bold text-emerald-950">হোমিওপ্যাথিক নিরাপত্তা:</span> কোন পার্শ্বপ্রতিক্রিয়া ছাড়া প্রাকৃতিক আরোগ্য এবং রোগ প্রতিরোধ ক্ষমতা বৃদ্ধি নিশ্চিত করা হয়।
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => {
                onSelectForAppointment(treatment.titleBn);
                onClose();
              }}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl font-bold text-sm text-white bg-red-600 hover:bg-red-700 transition flex items-center justify-center gap-2 shadow-sm"
            >
              <Calendar className="w-4 h-4" />
              <span>এই সেবার জন্য সিরিয়াল নিন</span>
            </button>
            <a
              href="tel:+8801714990001"
              className="w-full sm:w-auto py-3 px-4 rounded-xl font-semibold text-sm text-emerald-800 bg-emerald-100 hover:bg-emerald-200 transition flex items-center justify-center gap-2 border border-emerald-200"
            >
              <Phone className="w-4 h-4 text-red-600" />
              <span>কল করুন</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
