'use client';

import { useAuth } from '@/lib/contexts/auth-context';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="p-4 space-y-6">
      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl font-bold text-primary-600">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
          <p className="text-slate-600">{user.email}</p>
          <span className="inline-block mt-2 px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
            {user.role}
          </span>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <h3 className="text-lg font-semibold text-slate-900 p-4 border-b">
          Settings
        </h3>
        <div className="divide-y divide-slate-200">
          <button className="w-full px-4 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
            <span className="text-slate-700">Notifications</span>
            <svg
              className="w-5 h-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
          <button className="w-full px-4 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
            <span className="text-slate-700">Location Permissions</span>
            <svg
              className="w-5 h-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
          <button className="w-full px-4 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
            <span className="text-slate-700">Privacy Policy</span>
            <svg
              className="w-5 h-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* About */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">About</h3>
        <div className="space-y-2 text-sm text-slate-600">
          <p>TrackShift v0.1.0</p>
          <p>Employee Time & Location Tracking</p>
        </div>
      </div>

      {/* Logout Button */}
      <Button onClick={handleLogout} variant="danger" fullWidth>
        Sign Out
      </Button>
    </div>
  );
}
