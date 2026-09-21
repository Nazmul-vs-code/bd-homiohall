import React, { useState, useRef } from 'react';
import { DoctorProfile } from '../../types.js';
import { User, CheckCircle, Image, Award, BookOpen, Upload, AlertCircle, RefreshCw, Camera } from 'lucide-react';

interface DoctorTabProps {
  doctor: DoctorProfile;
  onRefresh: () => void;
  token: string;
}

export const DoctorTab: React.FC<DoctorTabProps> = ({
  doctor,
  onRefresh,
  token
}) => {
  const [nameBn, setNameBn] = useState(doctor.nameBn);
  const [nameEn, setNameEn] = useState(doctor.nameEn);
  const [qualifications, setQualifications] = useState(doctor.qualifications);
  const [registrationNo, setRegistrationNo] = useState(doctor.registrationNo);
  const [designationBn, setDesignationBn] = useState(doctor.designationBn);
  const [designation, setDesignation] = useState(doctor.designation);
  const [roleBn, setRoleBn] = useState(doctor.roleBn);
  const [role, setRole] = useState(doctor.role);
  const [bioBn, setBioBn] = useState(doctor.bioBn);
  const [imageUrl, setImageUrl] = useState(doctor.imageUrl);

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('শুধুমাত্র ছবি ফাইল (JPG, PNG, WEBP) আপলোড করুন।');
      return;
    }

    setUploadingPhoto(true);
    setUploadError('');
    setSuccessMsg('');

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Data = reader.result as string;
        const res = await fetch('/api/admin/doctor/upload-photo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            imageData: base64Data,
            fileName: file.name
          })
        });

        const data = await res.json();
        if (res.ok && data.success) {
          setImageUrl(data.imageUrl);
          setSuccessMsg(data.message || 'চিকিৎসকের মূল ছবি কোনো রূপান্তর ছাড়া সরাসরি সংরক্ষিত হয়েছে।');
          onRefresh();
        } else {
          setUploadError(data.error || 'ছবি আপলোড ব্যর্থ হয়েছে।');
        }
      } catch (err: any) {
        setUploadError('ছবি আপলোডে সমস্যা হয়েছে: ' + (err.message || 'Error'));
      } finally {
        setUploadingPhoto(false);
      }
    };
    reader.onerror = () => {
      setUploadError('ফাইল পড়তে সমস্যা হয়েছে।');
      setUploadingPhoto(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');

    try {
      const res = await fetch('/api/admin/doctor', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nameBn,
          nameEn,
          qualifications,
          registrationNo,
          designationBn,
          designation,
          roleBn,
          role,
          bioBn,
          imageUrl
        })
      });

      if (res.ok) {
        setSuccessMsg('চিকিৎসকের প্রোফাইল তথ্য সফলভাবে আপডেট করা হয়েছে।');
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-900">ডা. তামজীদ হোসেন - প্রোফাইল ও তথ্যাবলী</h3>
        <p className="text-xs text-slate-500">
          ওয়েবসাইটে প্রদর্শিত চিকিৎসকের নাম, ডিগ্রি, রেজিঃ নম্বর ও ছবির লিংক এখান থেকে পরিবর্তন করুন।
        </p>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Doctor Image Management (Direct Upload + URL) */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-emerald-700" />
            <h4 className="text-sm font-bold text-slate-800">চিকিৎসকের মূল ছবি (অকৃত্রিম ও অক্ষত ছবি)</h4>
          </div>
          <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-medium">
            কোনো AI ফিল্টার বা এডিটিং ছাড়া
          </span>
        </div>

        {uploadError && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          {/* Current Photo Preview */}
          <div className="md:col-span-4 flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="w-36 h-36 rounded-2xl overflow-hidden bg-slate-100 border-2 border-emerald-600 shadow-md relative group">
              <img
                src={imageUrl || "/dr-tamjid-hossain.jpg"}
                alt="Doctor"
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/200x200?text=Doctor+Photo';
                }}
              />
              {uploadingPhoto && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                  <RefreshCw className="w-6 h-6 animate-spin text-emerald-400 mb-1" />
                  <span className="text-[11px] font-medium">সংরক্ষণ হচ্ছে...</span>
                </div>
              )}
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-2">বর্তমান প্রদর্শিত ছবি</p>
          </div>

          {/* Upload Drop Zone & Actions */}
          <div className="md:col-span-8 space-y-3">
            <div
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                dragActive
                  ? 'border-emerald-600 bg-emerald-50/70 scale-[1.01]'
                  : 'border-slate-300 hover:border-emerald-600 bg-white hover:bg-slate-50/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center mb-2">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-800">
                চিকিৎসকের মূল ছবি নির্বাচন করতে এখানে ক্লিক করুন অথবা ড্র্যাগ করুন
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                JPG, PNG বা WEBP ফাইল (কোনো এডিটিং বা ফেস ফিল্টার ছাড়া সরাসরি সাইটে সংরক্ষিত হবে)
              </p>
              <button
                type="button"
                disabled={uploadingPhoto}
                className="mt-3 px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shadow-sm inline-flex items-center gap-1.5"
              >
                {uploadingPhoto ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>আপলোড হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>কম্পিউটার/মোবাইল থেকে ফাইল বাছুন</span>
                  </>
                )}
              </button>
            </div>

            {/* Direct Image URL Option */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-700">
                অথবা ছবির সরাসরি ওয়েব লিংক (URL) প্রদান করুন:
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="/dr-tamjid-hossain.jpg বা https://..."
                className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-sans-en focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Name and Reg */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">বাংলা নাম</label>
          <input
            type="text"
            required
            value={nameBn}
            onChange={(e) => setNameBn(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">ইংরেজি নাম</label>
          <input
            type="text"
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-sans-en focus:ring-2 focus:ring-emerald-600 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">চিকিৎসক রেজিঃ নং</label>
          <input
            type="text"
            value={registrationNo}
            onChange={(e) => setRegistrationNo(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Qualifications */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">ডিগ্রি ও শিক্ষাগত যোগ্যতা</label>
        <input
          type="text"
          value={qualifications}
          onChange={(e) => setQualifications(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-sans-en focus:ring-2 focus:ring-emerald-600 focus:outline-none"
        />
      </div>

      {/* Designation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">প্রাতিষ্ঠানিক পদবী (বাংলা)</label>
          <input
            type="text"
            value={designationBn}
            onChange={(e) => setDesignationBn(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">প্রাতিষ্ঠানিক পদবী (ইংরেজি)</label>
          <input
            type="text"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-sans-en focus:ring-2 focus:ring-emerald-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Role */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">ক্লিনিক্যাল দায়িত্ব (বাংলা)</label>
          <input
            type="text"
            value={roleBn}
            onChange={(e) => setRoleBn(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">ক্লিনিক্যাল দায়িত্ব (ইংরেজি)</label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-sans-en focus:ring-2 focus:ring-emerald-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Bio */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">চিকিৎসকের সংক্ষিপ্ত পরিচিতি ও দর্শন (Bio)</label>
        <textarea
          rows={4}
          value={bioBn}
          onChange={(e) => setBioBn(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
        />
      </div>

      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-800 hover:bg-emerald-900 transition shadow-sm"
        >
          {loading ? 'সংরক্ষণ হচ্ছে...' : 'আপডেট নিশ্চিত করুন'}
        </button>
      </div>
    </form>
  );
};
