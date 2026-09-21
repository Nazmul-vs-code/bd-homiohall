import React, { useState, useRef, useEffect } from 'react';
import { DoctorProfile, Chamber } from '../types.js';
import { X, Save, Upload, AlertCircle, Camera, Check, UserPlus, Sparkles } from 'lucide-react';

interface AddEditDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  doctorToEdit?: DoctorProfile | null;
  chambers?: Chamber[];
  token?: string;
}

export const AddEditDoctorModal: React.FC<AddEditDoctorModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  doctorToEdit,
  chambers = [],
  token: propToken
}) => {
  const token = propToken || localStorage.getItem('bhh_token') || '';

  const [nameBn, setNameBn] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [registrationNo, setRegistrationNo] = useState('');
  const [designationBn, setDesignationBn] = useState('');
  const [designation, setDesignation] = useState('');
  const [roleBn, setRoleBn] = useState('');
  const [role, setRole] = useState('');
  const [bioBn, setBioBn] = useState('');
  const [imageUrl, setImageUrl] = useState('/dr-tamjid-hossain.jpg');
  const [experienceYears, setExperienceYears] = useState(10);
  const [phones, setPhones] = useState('');
  const [specialties, setSpecialties] = useState('');
  const [isLead, setIsLead] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (doctorToEdit) {
      setNameBn(doctorToEdit.nameBn || '');
      setNameEn(doctorToEdit.nameEn || '');
      setQualifications(doctorToEdit.qualifications || '');
      setRegistrationNo(doctorToEdit.registrationNo || '');
      setDesignationBn(doctorToEdit.designationBn || '');
      setDesignation(doctorToEdit.designation || '');
      setRoleBn(doctorToEdit.roleBn || '');
      setRole(doctorToEdit.role || '');
      setBioBn(doctorToEdit.bioBn || '');
      setImageUrl(doctorToEdit.imageUrl || '/dr-tamjid-hossain.jpg');
      setExperienceYears(doctorToEdit.experienceYears || 10);
      setPhones(Array.isArray(doctorToEdit.phones) ? doctorToEdit.phones.join(', ') : '');
      setSpecialties(Array.isArray(doctorToEdit.specialties) ? doctorToEdit.specialties.join(', ') : '');
      setIsLead(Boolean(doctorToEdit.isLead));
    } else {
      // Defaults for a new doctor
      setNameBn('');
      setNameEn('');
      setQualifications('');
      setRegistrationNo('');
      setDesignationBn('সহকারী চিকিৎসক / বিশেষজ্ঞ');
      setDesignation('Assistant Physician / Specialist');
      setRoleBn('হোমিওপ্যাথিক কনসালটেন্ট');
      setRole('Homeopathic Consultant');
      setBioBn('রোগীর সার্বিক শারীরিক ও মানসিক লক্ষণ বিশ্লেষণ করে বিজ্ঞানসম্মত হোমিওপ্যাথিক ঔষধ ব্যবস্থাপত্র প্রদান করেন।');
      setImageUrl('/dr-tamjid-hossain.jpg');
      setExperienceYears(5);
      setPhones('');
      setSpecialties('জটিল ও পুরাতন রোগ, বন্ধ্যাত্ব, পাইলস, চর্মরোগ');
      setIsLead(false);
    }
    setError('');
    setUploadSuccess('');
  }, [doctorToEdit, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('অনুগ্রহ করে শুধুমাত্র ইমেজ ফাইল (JPG/PNG/WEBP) আপলোড করুন।');
      return;
    }

    setUploadingPhoto(true);
    setError('');
    setUploadSuccess('');

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Data = reader.result as string;
        // If editing existing doctor with an id, upload for that id
        const endpoint = doctorToEdit?.id
          ? `/api/admin/doctors/${doctorToEdit.id}/upload-photo`
          : '/api/admin/doctor/upload-photo';

        const res = await fetch(endpoint, {
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
          setUploadSuccess('আসল ছবি সফলভাবে সংরক্ষিত হয়েছে!');
        } else {
          // If in create mode and server expects an ID, set preview locally
          setImageUrl(base64Data);
          setUploadSuccess('ছবি প্রিভিউ প্রস্তুত। চিকিৎসক সংরক্ষণের সাথে সাথে ফাইল সক্রিয় হবে।');
        }
      } catch (err: any) {
        // Fallback to client base64 preview
        setImageUrl(reader.result as string);
        setUploadSuccess('ছবি নির্বাচন সম্পন্ন হয়েছে।');
      } finally {
        setUploadingPhoto(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameBn.trim()) {
      setError('চিকিৎসকের বাংলা নাম আবশ্যক।');
      return;
    }

    setLoading(true);
    setError('');

    const phoneList = phones
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);

    const specialtyList = specialties
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      nameBn: nameBn.trim(),
      nameEn: nameEn.trim() || nameBn.trim(),
      qualifications: qualifications.trim(),
      registrationNo: registrationNo.trim(),
      designationBn: designationBn.trim(),
      designation: designation.trim() || designationBn.trim(),
      roleBn: roleBn.trim(),
      role: role.trim() || roleBn.trim(),
      bioBn: bioBn.trim(),
      imageUrl: imageUrl.trim() || '/dr-tamjid-hossain.jpg',
      experienceYears: Number(experienceYears) || 5,
      phones: phoneList,
      specialties: specialtyList,
      isLead: Boolean(isLead)
    };

    try {
      let res: Response;
      if (doctorToEdit && doctorToEdit.id) {
        res = await fetch(`/api/admin/doctors/${doctorToEdit.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('/api/admin/doctors', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'চিকিৎসক সংরক্ষণ করতে সমস্যা হয়েছে।');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'সার্ভারে সমস্যা দেখা দিয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800/80 border border-emerald-500/50 flex items-center justify-center text-white">
              <UserPlus className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {doctorToEdit ? 'চিকিৎসকের তথ্য পরিবর্তন ও আপডেট' : 'নতুন চিকিৎসক যুক্ত করুন'}
              </h3>
              <p className="text-xs text-emerald-200">
                বাংলাদেশ হোমিও হলের অভিজ্ঞ চিকিৎসক প্যানেলে তথ্য যোগ করুন
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-emerald-200 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Photo & Basic Info Row */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-4 border-b border-slate-100">
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-slate-100 border-2 border-emerald-500 shadow-md">
                <img
                  src={imageUrl}
                  alt="Doctor Preview"
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPhoto}
                className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-[11px] font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5 text-emerald-300" />
                <span>{uploadingPhoto ? 'আপলোড হচ্ছে...' : 'আসল ছবি দিন'}</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              {uploadSuccess && (
                <p className="text-[10px] text-emerald-700 font-semibold text-center">{uploadSuccess}</p>
              )}
            </div>

            <div className="flex-1 w-full space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  চিকিৎসকের নাম (বাংলায়) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: ডা. মোঃ আশরাফ আলী"
                  value={nameBn}
                  onChange={(e) => setNameBn(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  চিকিৎসকের নাম (English)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Md. Ashraf Ali"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none font-sans-en"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isLeadCheck"
                  checked={isLead}
                  onChange={(e) => setIsLead(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                />
                <label htmlFor="isLeadCheck" className="text-xs text-slate-700 font-semibold select-none cursor-pointer">
                  প্রধান চিকিৎসক হিসেবে চিহ্নিত করুন (Lead Doctor)
                </label>
              </div>
            </div>
          </div>

          {/* Degrees & Registration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ডিগ্রি ও শিক্ষাগত যোগ্যতা <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="যেমন: এমএ, ডিএইচএমএস (হোমিওপ্যাথি), ডিইউএমএস (ইউনানী)"
                value={qualifications}
                onChange={(e) => setQualifications(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                রেজিস্ট্রেশন নম্বর <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="যেমন: রেজিঃ নং- ১২৩৫৭ (হোমিও), ১১১১ (ইউনানী)"
                value={registrationNo}
                onChange={(e) => setRegistrationNo(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
              />
            </div>
          </div>

          {/* Institutional Designation & Clinical Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                প্রাতিষ্ঠানিক পদবী (বাংলা)
              </label>
              <input
                type="text"
                placeholder="যেমন: সহকারী অধ্যাপক, খলিশাডুলী, চাঁদপুর"
                value={designationBn}
                onChange={(e) => setDesignationBn(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ক্লিনিক্যাল দায়িত্ব (বাংলা)
              </label>
              <input
                type="text"
                placeholder="যেমন: সিনিয়র কনসালটেন্ট ও হোমিও বিশেষজ্ঞ"
                value={roleBn}
                onChange={(e) => setRoleBn(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
              />
            </div>
          </div>

          {/* Contact Phones & Specialties */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                মোবাইল নম্বরসমূহ (কমা দিয়ে লিখুন)
              </label>
              <input
                type="text"
                placeholder="যেমন: 01743-902773, 01712-846478"
                value={phones}
                onChange={(e) => setPhones(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600 outline-none font-sans-en"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                অভিজ্ঞতার বছর
              </label>
              <input
                type="number"
                min={1}
                max={60}
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600 outline-none font-sans-en"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              বিশেষায়িত চিকিৎসা ক্ষেত্র (কমা দিয়ে লিখুন)
            </label>
            <input
              type="text"
              placeholder="যেমন: বন্ধ্যাত্ব, পাইলস, টিউমার, চর্মরোগ, টনসিল, কিডনি পাথর, পলিপাস"
              value={specialties}
              onChange={(e) => setSpecialties(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
            />
          </div>

          {/* Doctor Bio */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              চিকিৎসা দর্শন ও বিস্তারিত পরিচিতি
            </label>
            <textarea
              rows={3}
              placeholder="চিকিৎসক সম্পর্কে বিস্তারিত পরিচিতি লিখুন..."
              value={bioBn}
              onChange={(e) => setBioBn(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600 outline-none leading-relaxed"
            />
          </div>

          {/* Footer Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-emerald-300" />
              <span>{loading ? 'সংরক্ষণ হচ্ছে...' : doctorToEdit ? 'আপডেট করুন' : 'চিকিৎসক যুক্ত করুন'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
