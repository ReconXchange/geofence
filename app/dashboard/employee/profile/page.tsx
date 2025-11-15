"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Profile
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Your account information
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Name
          </label>
          <p className="text-gray-900 dark:text-gray-100">{user.name}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <p className="text-gray-900 dark:text-gray-100">{user.email}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Role
          </label>
          <p className="text-gray-900 dark:text-gray-100 capitalize">
            {user.role.toLowerCase()}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          About Location Tracking
        </h3>
        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <p>
            • Your location is only tracked while you are clocked in
          </p>
          <p>
            • Location updates are sent every 3 minutes during active shifts
          </p>
          <p>
            • You can view your location history in the admin dashboard
          </p>
          <p>
            • Location data is used solely for attendance and compliance purposes
          </p>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
      >
        Logout
      </button>
    </div>
  );
}
