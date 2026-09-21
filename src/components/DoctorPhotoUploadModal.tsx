import React, { useState, useRef } from 'react';
import { Upload, CheckCircle2, AlertCircle, RefreshCw, X, Camera, ShieldCheck } from 'lucide-react';

interface DoctorPhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newUrl: string) => void;
  currentImageUrl?: string;
}

export const DoctorPhotoUploadModal: React.FC<DoctorPhotoUploadModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  currentImageUrl,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFile = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('অনুগ্রহ করে শুধুমাত্র ছবি ফাইল (PNG, JPG, WEBP) নির্বাচন করুন।');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Data = reader.result as string;
        const res = await fetch('/api/doctor/upload-photo-direct', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageData: base64Data,
            fileName: file.name,
          }),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          setSuccess('চিকিৎসকের আসল ছবি সফলভাবে সংরক্ষিত হয়েছে! কোনো এডিটিং বা ফিল্টার ছাড়াই সাইটে সরাসরি যুক্ত করা হয়েছে।');
          onSuccess(data.imageUrl);
          setTimeout(() => {
            onClose();
          }, 1400);
        } else {
          setError(data.error || 'ছবি আপলোড করতে সমস্যা হয়েছে।');
        }
      } catch (err: any) {
        setError('ছবি আপলোড ব্যর্থ হয়েছে: ' + (err.message || 'Error'));
      } finally {
        setLoading(false);
      }
    };

    reader.onerror = () => {
      setError('ফাইল পড়তে সমস্যা হয়েছে।');
      setLoading(false);
    };

    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-emerald-950 text-white">
          <div className="flex items-center gap-2.5">
            <Camera className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold">চিকিৎসকের মূল ছবি আপলোড</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition"
            title="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200/80 rounded-xl text-emerald-900 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0" />
            <span>
              <strong>কোনো এডিটিং বা ফিল্টার নেই:</strong> আপনার দেওয়া ছবিটি হুবহু আসল ও অবিকৃত অবস্থায় সরাসরি সার্ভারে সংরক্ষিত হবে।
            </span>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Drag and drop zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-emerald-600 bg-emerald-50/80 scale-[1.01]'
                : 'border-slate-300 hover:border-emerald-600 bg-slate-50/50 hover:bg-slate-50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
            />

            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center mb-3 shadow-inner">
              {loading ? (
                <RefreshCw className="w-7 h-7 animate-spin text-emerald-600" />
              ) : (
                <Upload className="w-7 h-7" />
              )}
            </div>

            <p className="text-sm font-bold text-slate-900">
              {loading
                ? 'ছবি সংরক্ষিত হচ্ছে...'
                : 'আপনার স্ক্রিনশট বা আসল ছবি এখানে ড্র্যাগ করুন অথবা ক্লিক করুন'}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Screenshot 2026-09-19 133052.png বা যেকোনো JPG/PNG ফাইল
            </p>

            <button
              type="button"
              disabled={loading}
              className="mt-4 px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shadow-md inline-flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>কম্পিউটার বা মোবাইল থেকে ছবি বাছুন</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-400 text-center">
            * আপনি চাইলে বাম পাশের AI Studio File Explorer থেকেও সরাসরি <code>/public/</code> ফোল্ডারে <code>dr-tamjid-hossain.jpg</code> অথবা <code>dr-tamjid-hossain.png</code> হিসেবে আপলোড করতে পারেন।
          </p>
        </div>
      </div>
    </div>
  );
};
