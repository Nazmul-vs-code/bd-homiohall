import React, { useState } from 'react';
import { Appointment } from '../../types.js';
import {
  Calendar,
  Phone,
  CheckCircle,
  Clock,
  Trash2,
  CheckCheck,
  MessageSquare,
  AlertCircle,
  Filter,
  ExternalLink,
  Image as ImageIcon,
  UserCheck,
  Heart,
  Baby
} from 'lucide-react';

interface AppointmentsTabProps {
  appointments: Appointment[];
  onRefresh: () => void;
  token: string;
}

export const AppointmentsTab: React.FC<AppointmentsTabProps> = ({
  appointments,
  onRefresh,
  token
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'contacted' | 'completed'>('all');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const filteredAppointments = filter === 'all'
    ? appointments
    : appointments.filter(a => a.status === filter);

  const handleStatusChange = async (id: string, newStatus: 'pending' | 'contacted' | 'completed') => {
    setProcessingId(id);
    try {
      const res = await fetch(`/api/admin/appointments/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        onRefresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('আপনি কি নিশ্চিত এই আবেদনটি মুছে ফেলতে চান?')) return;
    setProcessingId(id);
    try {
      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        onRefresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
        <div>
          <h3 className="text-lg font-bold text-slate-900">রোগীদের সিরিয়াল ও অ্যাপয়েন্টমেন্ট তালিকা</h3>
          <p className="text-xs text-slate-500">মোট আবেদন: {appointments.length} টি</p>
        </div>

        <div className="flex items-center gap-2">
          {(['all', 'pending', 'contacted', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                filter === f
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f === 'all' && 'সকল'}
              {f === 'pending' && 'অপেক্ষমাণ (Pending)'}
              {f === 'contacted' && 'যোগাযোগকৃত (Contacted)'}
              {f === 'completed' && 'সম্পন্ন (Completed)'}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {filteredAppointments.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400">
          <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p className="text-sm font-medium">কোনো আবেদন পাওয়া যায়নি।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredAppointments.map((apt) => {
            const formattedDate = new Date(apt.createdAt).toLocaleString('bn-BD', {
              dateStyle: 'medium',
              timeStyle: 'short'
            });

            const statusColors = {
              pending: 'bg-amber-50 text-amber-700 border-amber-200',
              contacted: 'bg-blue-50 text-blue-700 border-blue-200',
              completed: 'bg-emerald-50 text-emerald-700 border-emerald-200'
            };

            const statusLabels = {
              pending: 'অপেক্ষমাণ (Pending)',
              contacted: 'যোগাযোগ করা হয়েছে (Contacted)',
              completed: 'চিকিৎসা সম্পন্ন (Completed)'
            };

            return (
              <div
                key={apt.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-base font-bold text-slate-900">{apt.fullName}</h4>
                      {apt.patientType && (
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                          apt.patientType === 'male'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : apt.patientType === 'female'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          {apt.patientType === 'male' && <UserCheck className="w-3 h-3" />}
                          {apt.patientType === 'female' && <Heart className="w-3 h-3" />}
                          {apt.patientType === 'child' && <Baby className="w-3 h-3" />}
                          <span>
                            {apt.patientType === 'male' ? 'পুরুষ' : apt.patientType === 'female' ? 'মহিলা' : 'শিশু'}
                          </span>
                        </span>
                      )}
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${statusColors[apt.status]}`}>
                        {statusLabels[apt.status]}
                      </span>
                      <span className="text-xs text-slate-400 font-sans-en">
                        ID: {apt.id}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">আবেদনের সময়: {formattedDate}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <a
                      href={`tel:${apt.phone}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 font-sans-en transition"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{apt.phone}</span>
                    </a>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl">
                  <div>
                    <span className="text-slate-400 block font-medium">কাঙ্ক্ষিত সেবা:</span>
                    <span className="font-bold text-slate-800">{apt.serviceName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">পছন্দের চেম্বার:</span>
                    <span className="font-bold text-slate-800">{apt.preferredChamber || "মতলব চেম্বার"}</span>
                  </div>
                  {apt.problemDescription && (
                    <div className="sm:col-span-2 pt-1 border-t border-slate-200/60">
                      <span className="text-slate-400 block font-medium">রোগীর বর্ণনা:</span>
                      <p className="text-slate-700 text-sm mt-0.5 leading-relaxed italic">
                        "{apt.problemDescription}"
                      </p>
                    </div>
                  )}

                  {apt.reportImageUrl && (
                    <div className="sm:col-span-2 pt-2 border-t border-slate-200/60 flex items-center justify-between gap-3 bg-white p-2.5 rounded-lg border border-slate-200">
                      <div className="flex items-center gap-2">
                        <img
                          src={apt.reportImageUrl}
                          alt="Medical Report"
                          className="w-10 h-10 object-cover rounded-lg border border-slate-200"
                        />
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">সংযুক্ত প্রেসক্রিপশন / রিপোর্ট (PNG)</span>
                          <span className="text-[11px] text-slate-500 font-sans-en truncate max-w-xs block">
                            ImgBB ক্লাউডে সংরক্ষিত
                          </span>
                        </div>
                      </div>
                      <a
                        href={apt.reportImageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 flex items-center gap-1 transition"
                      >
                        <span>বড় করে দেখুন</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Action Buttons for Owner */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium">স্ট্যাটাস পরিবর্তন:</span>
                    {apt.status !== 'contacted' && (
                      <button
                        disabled={processingId === apt.id}
                        onClick={() => handleStatusChange(apt.id, 'contacted')}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-100 hover:bg-blue-200 text-blue-800 transition"
                      >
                        যোগাযোগ হয়েছে
                      </button>
                    )}
                    {apt.status !== 'completed' && (
                      <button
                        disabled={processingId === apt.id}
                        onClick={() => handleStatusChange(apt.id, 'completed')}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-100 hover:bg-emerald-200 text-emerald-800 transition"
                      >
                        সম্পন্ন
                      </button>
                    )}
                    {apt.status !== 'pending' && (
                      <button
                        disabled={processingId === apt.id}
                        onClick={() => handleStatusChange(apt.id, 'pending')}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-100 hover:bg-amber-200 text-amber-800 transition"
                      >
                        অপেক্ষমাণ করুন
                      </button>
                    )}
                  </div>

                  <button
                    disabled={processingId === apt.id}
                    onClick={() => handleDelete(apt.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                    title="আবেদন মুছুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
