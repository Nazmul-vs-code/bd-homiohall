import React, { useState, useRef } from 'react';
import { Upload, CheckCircle2, AlertCircle, RefreshCw, X, Camera, ShieldCheck } from 'lucide-react';

interface DoctorPhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newUrl: string) => void;
  currentImageUrl?: string;
  doctorId?: string;
}

export const DoctorPhotoUploadModal: React.FC<DoctorPhotoUploadModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  currentImageUrl,
  doctorId
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

    const token = localStorage.getItem('token') || localStorage.getItem('admin_token') || '';

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Data = reader.result as string;
        const endpoint = doctorId
          ? `/api/admin/doctors/${doctorId}/upload-photo`
          : '/api/admin/doctor/upload-photo';

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            imageData: base64Data,
            fileName: file.name,
          }),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          setSuccess('চিকিৎসকের প্রোফাইল ছবি সফলভাবে সংরক্ষিত হয়েছে!');
          onSuccess(data.imageUrl);
          setTimeout(() => {
            onClose();
          }, 1400);
        } else {
          setError(data.error || 'ছবি আপলোড করতে অ্যাডমিন পারমিশন প্রয়োজন।');
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

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-[#003870] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-base">চিকিৎসকের ছবি পরিবর্তন</h3>
              <p className="text-[11px] text-blue-200">শুধুমাত্র অ্যাডমিন প্যানেল অথেন্টিকেশন দ্বারা নিয়ন্ত্রিত</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Current photo preview */}
          {currentImageUrl && (
            <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
              <img
                src={currentImageUrl}
                alt="Current profile"
                className="w-14 h-14 rounded-full object-cover object-top border-2 border-emerald-600 shadow-sm"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-700 block">বর্তমান ছবি</span>
                <span className="text-slate-400 font-sans-en text-[11px] truncate max-w-xs block">
                  {currentImageUrl}
                </span>
              </div>
            </div>
          )}

          {/* Upload Area */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-emerald-500 bg-emerald-50/50 scale-[0.99]'
                : 'border-slate-300 hover:border-emerald-600 hover:bg-slate-50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
            />

            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-3">
              {loading ? (
                <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
              ) : (
                <Upload className="w-6 h-6" />
              )}
            </div>

            <p className="font-bold text-slate-800 text-sm mb-1">
              {loading ? 'ছবি আপলোড ও সংরক্ষণ হচ্ছে...' : 'নতুন ছবি নির্বাচন বা ড্র্যাগ করুন'}
            </p>
            <p className="text-xs text-slate-500">
              JPG, PNG বা WEBP ফরম্যাট
            </p>
          </div>

          {/* Feedback messages */}
          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 text-red-700 rounded-xl text-xs border border-red-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-start gap-2 p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {/* Admin Note */}
          <div className="flex items-start gap-2 text-[11px] text-slate-600 bg-blue-50/70 p-3 rounded-xl border border-blue-200/50">
            <ShieldCheck className="w-4 h-4 text-[#0052a3] flex-shrink-0 mt-0.5" />
            <p>
              চিকিৎসকের প্রোফাইল ছবি পরিবর্তনের ক্ষমতা শুধুমাত্র সুরক্ষিত অ্যাডমিন ক্রেডেনশিয়ালের সাথেই অনুমোদিত।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
