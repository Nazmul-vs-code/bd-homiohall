import React, { useState, useRef, useEffect } from 'react';
import { DoctorProfile } from '../../types.js';
import {
  User,
  CheckCircle,
  Award,
  BookOpen,
  Upload,
  AlertCircle,
  RefreshCw,
  Camera,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  Phone,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import { AddEditDoctorModal } from '../AddEditDoctorModal.js';
import { VisitingCardModal } from '../VisitingCardModal.js';

interface DoctorTabProps {
  doctor: DoctorProfile;
  doctors?: DoctorProfile[];
  onRefresh: () => void;
  token: string;
}

export const DoctorTab: React.FC<DoctorTabProps> = ({
  doctor,
  doctors = [],
  onRefresh,
  token
}) => {
  const [doctorList, setDoctorList] = useState<DoctorProfile[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(doctor.id || 'dr-tamjid-hossain');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [doctorToEdit, setDoctorToEdit] = useState<DoctorProfile | null>(null);
  const [isVisitingCardOpen, setIsVisitingCardOpen] = useState(false);
  const [cardDoctor, setCardDoctor] = useState<DoctorProfile>(doctor);

  // Active doctor form state
  const [nameBn, setNameBn] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [registrationNo, setRegistrationNo] = useState('');
  const [designationBn, setDesignationBn] = useState('');
  const [designation, setDesignation] = useState('');
  const [roleBn, setRoleBn] = useState('');
  const [role, setRole] = useState('');
  const [bioBn, setBioBn] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [experienceYears, setExperienceYears] = useState(10);
  const [phones, setPhones] = useState('');
  const [specialties, setSpecialties] = useState('');
  const [isLead, setIsLead] = useState(false);

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch or sync all doctors
  const fetchDoctors = async () => {
    try {
      const res = await fetch('/api/admin/doctors', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDoctorList(data);
        return;
      }
    } catch (e) {
      // ignore
    }
    // fallback to props
    if (doctors && doctors.length > 0) {
      setDoctorList(doctors);
    } else {
      setDoctorList([doctor]);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [doctors]);

  // When selected doctor changes, populate the form
  useEffect(() => {
    const current = doctorList.find((d) => (d.id || d.nameBn) === selectedDoctorId) || doctorList[0] || doctor;
    if (current) {
      setNameBn(current.nameBn || '');
      setNameEn(current.nameEn || '');
      setQualifications(current.qualifications || '');
      setRegistrationNo(current.registrationNo || '');
      setDesignationBn(current.designationBn || '');
      setDesignation(current.designation || '');
      setRoleBn(current.roleBn || '');
      setRole(current.role || '');
      setBioBn(current.bioBn || '');
      setImageUrl(current.imageUrl || '/dr-tamjid-hossain.jpg');
      setExperienceYears(current.experienceYears || 10);
      setPhones(Array.isArray(current.phones) ? current.phones.join(', ') : '');
      setSpecialties(Array.isArray(current.specialties) ? current.specialties.join(', ') : '');
      setIsLead(Boolean(current.isLead));
    }
  }, [selectedDoctorId, doctorList]);

  const activeDoc = doctorList.find((d) => (d.id || d.nameBn) === selectedDoctorId) || doctor;

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
        const endpoint = activeDoc.id
          ? `/api/admin/doctors/${activeDoc.id}/upload-photo`
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
          setSuccessMsg(data.message || 'চিকিৎসকের মূল ছবি কোনো ফিল্টার ছাড়া সরাসরি সংরক্ষিত হয়েছে।');
          fetchDoctors();
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

  const handleSaveCurrentDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

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
      if (activeDoc.id) {
        res = await fetch(`/api/admin/doctors/${activeDoc.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('/api/admin/doctor', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        setSuccessMsg('চিকিৎসকের প্রোফাইল তথ্য সফলভাবে আপডেট করা হয়েছে।');
        fetchDoctors();
        onRefresh();
      } else {
        const err = await res.json();
        setErrorMsg(err.error || 'আপডেট ব্যর্থ হয়েছে।');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'সার্ভারে সংযোগে সমস্যা হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDoctor = async (docId?: string) => {
    if (!docId) return;
    if (!confirm('আপনি কি নিশ্চিত এই চিকিৎসকের প্রোফাইল মুছে ফেলতে চান?')) return;

    try {
      const res = await fetch(`/api/admin/doctors/${docId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg('চিকিৎসক সফলভাবে মুছে ফেলা হয়েছে।');
        fetchDoctors();
        onRefresh();
      } else {
        setErrorMsg(data.error || 'মুছে ফেলা সম্ভব হয়নি।');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'মুছে ফেলার সময় সমস্যা হয়েছে।');
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header & Doctor Selector */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-slate-900">চিকিৎসক ব্যবস্থাপনা প্যানেল</h3>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold font-sans-en">
              {doctorList.length} জন চিকিৎসক
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            এখানে চিকিৎসকদের তথ্য যুক্ত, সম্পাদনা, ছবি আপলোড এবং ভিজিটিং কার্ড প্রিভিউ পরিচালনা করতে পারবেন।
          </p>
        </div>

        <button
          onClick={() => {
            setDoctorToEdit(null);
            setIsAddModalOpen(true);
          }}
          className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-2 shadow-md transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন চিকিৎসক যোগ করুন</span>
        </button>
      </div>

      {/* Doctor Cards / Tabs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {doctorList.map((doc) => {
          const isSelected = (doc.id || doc.nameBn) === selectedDoctorId;
          return (
            <div
              key={doc.id || doc.nameBn}
              onClick={() => setSelectedDoctorId(doc.id || doc.nameBn)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-emerald-50/70 border-emerald-600 shadow-md ring-2 ring-emerald-600/30'
                  : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <img
                  src={doc.imageUrl || '/dr-tamjid-hossain.jpg'}
                  alt={doc.nameBn}
                  className="w-14 h-14 rounded-xl object-cover object-top border-2 border-emerald-400 flex-shrink-0 shadow-sm"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className="text-sm font-bold text-slate-900 truncate">{doc.nameBn}</h4>
                    {doc.isLead && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] bg-red-600 text-white font-bold">
                        প্রধান
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-emerald-800 font-semibold truncate font-sans-en mt-0.5">
                    {doc.qualifications}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {doc.designationBn}
                  </p>
                </div>
              </div>

              {/* Action Toolbar on Card */}
              <div className="mt-3 pt-3 border-t border-slate-200/70 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCardDoctor(doc);
                    setIsVisitingCardOpen(true);
                  }}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-900 transition"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>ভিজিটিং কার্ড</span>
                </button>

                <div className="flex items-center gap-2">
                  {!doc.isLead && doc.id !== 'dr-tamjid-hossain' && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteDoctor(doc.id);
                      }}
                      className="p-1 rounded text-red-500 hover:bg-red-50 transition"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <span className={`text-[11px] font-bold ${isSelected ? 'text-emerald-700' : 'text-slate-400'}`}>
                    {isSelected ? 'সম্পাদনা চলছে' : 'নির্বাচন করুন'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Editor Form for Selected Doctor */}
      <form onSubmit={handleSaveCurrentDoctor} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>{nameBn || 'চিকিৎসক'} এর তথ্য সম্পাদনা</span>
              {isLead && (
                <span className="px-2 py-0.5 rounded text-xs bg-red-600 text-white font-bold">
                  প্রধান চিকিৎসক
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              ওয়েবসাইটে এবং ভিজিটিং কার্ডে প্রদর্শিত তথ্যাবলী রিয়েলটাইমে আপডেট করুন।
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setCardDoctor(activeDoc);
              setIsVisitingCardOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer"
          >
            <CreditCard className="w-3.5 h-3.5 text-amber-300" />
            <span>ভিজিটিং কার্ড প্রিভিউ</span>
          </button>
        </div>

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Photo Upload Row */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-slate-900 border-2 border-emerald-600 shadow-md flex-shrink-0">
            <img
              src={imageUrl || '/dr-tamjid-hossain.jpg'}
              alt={nameBn}
              className="w-full h-full object-cover object-top"
            />
          </div>

          <div className="flex-1 space-y-2">
            <h4 className="text-sm font-bold text-slate-800">চিকিৎসকের মূল ছবি (Original Photo)</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              আপনার ডিভাইসের আসল ছবি কোনো ফিল্টার ছাড়া হুবহু আপলোড করতে পারবেন। JPG, PNG বা WEBP ফরম্যাট সমর্থিত।
            </p>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPhoto}
                className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-sm disabled:opacity-50"
              >
                <Camera className="w-3.5 h-3.5 text-emerald-300" />
                <span>{uploadingPhoto ? 'আপলোড হচ্ছে...' : 'ছবি পরিবর্তন করুন'}</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                }}
                className="hidden"
              />
            </div>

            {uploadError && (
              <p className="text-xs text-red-600 font-medium">{uploadError}</p>
            )}
          </div>
        </div>

        {/* Main Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              চিকিৎসকের নাম (বাংলা) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={nameBn}
              onChange={(e) => setNameBn(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              চিকিৎসকের নাম (English)
            </label>
            <input
              type="text"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 outline-none font-sans-en"
            />
          </div>
        </div>

        {/* Qualifications & Reg */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              শিক্ষাগত যোগ্যতা ও ডিগ্রি <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
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
              value={registrationNo}
              onChange={(e) => setRegistrationNo(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
            />
          </div>
        </div>

        {/* Designations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              প্রাতিষ্ঠানিক পদবী (বাংলা)
            </label>
            <input
              type="text"
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
              value={roleBn}
              onChange={(e) => setRoleBn(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
            />
          </div>
        </div>

        {/* Contact Numbers & Experience */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              সিরিয়ালের মোবাইল নম্বর (কমা দিয়ে লিখুন)
            </label>
            <input
              type="text"
              placeholder="01743-902773, 01712-846478"
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
            বিশেষায়িত চিকিৎসা ক্ষেত্রসমূহ
          </label>
          <input
            type="text"
            placeholder="যেমন: বন্ধ্যাত্ব, পাইলস, টিউমার, চর্মরোগ, টনসিল, কিডনি পাথর"
            value={specialties}
            onChange={(e) => setSpecialties(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            চিকিৎসা দর্শন ও জীবনী (Bio)
          </label>
          <textarea
            rows={3}
            value={bioBn}
            onChange={(e) => setBioBn(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600 outline-none leading-relaxed"
          />
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="isLeadFormCheck"
            checked={isLead}
            onChange={(e) => setIsLead(e.target.checked)}
            className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
          />
          <label htmlFor="isLeadFormCheck" className="text-xs text-slate-700 font-semibold select-none cursor-pointer">
            এই চিকিৎসককে প্রধান চিকিৎসক (Lead Doctor) হিসেবে নির্ধারণ করুন
          </label>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
          >
            <CheckCircle className="w-4 h-4 text-emerald-300" />
            <span>{loading ? 'সংরক্ষণ হচ্ছে...' : 'পরিবর্তন সংরক্ষণ করুন'}</span>
          </button>
        </div>
      </form>

      {/* Modals */}
      <AddEditDoctorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          fetchDoctors();
          onRefresh();
        }}
        doctorToEdit={doctorToEdit}
        token={token}
      />

      <VisitingCardModal
        isOpen={isVisitingCardOpen}
        onClose={() => setIsVisitingCardOpen(false)}
        doctor={cardDoctor}
      />
    </div>
  );
};
