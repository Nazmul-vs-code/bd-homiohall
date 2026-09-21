import React, { useState, useEffect } from 'react';
import { Users, Shield, User, RefreshCw, CheckCircle2, AlertCircle, Calendar, Mail, Key } from 'lucide-react';

interface AppUserItem {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

interface UsersTabProps {
  token: string;
}

export const UsersTab: React.FC<UsersTabProps> = ({ token }) => {
  const [users, setUsers] = useState<AppUserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        throw new Error('ব্যবহারকারীদের তালিকা লোড করা সম্ভব হয়নি');
      }
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err: any) {
      setError(err.message || 'ত্রুটি ঘটেছে');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleToggle = async (user: AppUserItem) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    const confirmMsg = newRole === 'admin' 
      ? `আপনি কি নিশ্চিত যে "${user.name}" (${user.email})-কে অ্যাডমিন পারমিশন দিতে চান?`
      : `আপনি কি "${user.name}"-এর অ্যাডমিন পারমিশন প্রত্যাহার করতে চান?`;

    if (!window.confirm(confirmMsg)) return;

    setUpdatingId(user.id);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/admin/users/role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          emailOrId: user.email,
          role: newRole
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'রোল পরিবর্তন ব্যর্থ হয়েছে');
      }

      setSuccess(`সফলভাবে "${user.name}"-এর রোল "${newRole}" করা হয়েছে।`);
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role: newRole } : u));
    } catch (err: any) {
      setError(err.message || 'রোল আপডেট করতে সমস্যা হয়েছে');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-700" />
            <h2 className="text-xl font-bold text-slate-900">ব্যবহারকারী ও অ্যাডমিন রোল ব্যবস্থাপনা</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            MongoDB ডাটাবেজে সংরক্ষিত নিবন্ধিত অ্যাকাউন্টসমূহ ও তাদের রোল পরিচালনা করুন।
          </p>
        </div>

        <button
          onClick={fetchUsers}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>তাজা করুন</span>
        </button>
      </div>

      {/* Info notice */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-950 flex items-start gap-3">
        <Shield className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">MongoDB ও অ্যাডমিন এক্সেস তথ্য:</p>
          <p>
            যেকোনো ইউজার সাধারণ রেজিস্ট্রেশন করার পর তার রোল <code className="bg-emerald-100 px-1 py-0.5 rounded font-mono font-bold">user</code> হিসেবে সংরক্ষিত হয়। আপনি সরাসরি এখান থেকে অথবা সরাসরি MongoDB Atlas কম্পাস/ক্ল্যাউড কনসোলের <code className="bg-emerald-100 px-1 py-0.5 rounded font-mono font-bold">users</code> কালেকশনে গিয়ে <code className="bg-emerald-100 px-1 py-0.5 rounded font-mono font-bold">role: "admin"</code> আপডেট করলেই অ্যাডমিন এক্সেস কার্যকর হবে।
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-emerald-700 mb-2" />
            <span>ব্যবহারকারীদের তালিকা লোড করা হচ্ছে...</span>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            <User className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <span>এখনো কোনো অতিরিক্ত ব্যবহারকারী অ্যাকাউন্ট তৈরি করা হয়নি।</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">নাম ও ইমেইল</th>
                  <th className="py-3 px-4">বর্তমান রোল</th>
                  <th className="py-3 px-4">নিবন্ধন তারিখ</th>
                  <th className="py-3 px-4 text-right">রোল পরিবর্তন (Action)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                        <span>{u.name}</span>
                        {u.role === 'admin' && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            Admin
                          </span>
                        )}
                      </div>
                      <div className="text-slate-500 font-sans-en text-xs flex items-center gap-1.5 mt-0.5">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span>{u.email}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {u.role === 'admin' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <Shield className="w-3 h-3 text-emerald-600" />
                          <span>অ্যাডমিন (Admin)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          <User className="w-3 h-3 text-slate-500" />
                          <span>সাধারণ ইউজার (User)</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-sans-en">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString('bn-BD', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleRoleToggle(u)}
                        disabled={updatingId === u.id}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                          u.role === 'admin'
                            ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                        }`}
                      >
                        <Shield className="w-3.5 h-3.5" />
                        <span>
                          {updatingId === u.id
                            ? 'আপডেট হচ্ছে...'
                            : u.role === 'admin'
                            ? 'ইউজারে নামান'
                            : 'অ্যাডমিন বানান (Promote)'}
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
