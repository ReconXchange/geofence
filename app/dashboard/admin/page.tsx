'use client';

import { useState, useEffect } from 'react';

interface ActiveShift {
  id: string;
  actualStart: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  locationPings: Array<{
    latitude: number;
    longitude: number;
    timestamp: string;
  }>;
}

export default function AdminDashboardPage() {
  const [activeShifts, setActiveShifts] = useState<ActiveShift[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveShifts();
    const interval = setInterval(fetchActiveShifts, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchActiveShifts = async () => {
    try {
      const response = await fetch('/api/admin/active-shifts');
      const data = await response.json();
      setActiveShifts(data.activeShifts || []);
    } catch (error) {
      console.error('Failed to fetch active shifts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateDuration = (start: string) => {
    const startTime = new Date(start).getTime();
    const now = Date.now();
    const diff = now - startTime;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Overview</h1>
        <p className="text-slate-600 mt-1">
          Monitor active employees and shifts
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Active Employees</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">
                {activeShifts.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Shifts Today</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">
                {activeShifts.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Avg. Shift Duration</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">
                {activeShifts.length > 0
                  ? calculateDuration(activeShifts[0].actualStart).split(' ')[0]
                  : '0h'}
              </p>
            </div>
            <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-slate-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Active Employees */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">
            Currently Clocked In
          </h2>
        </div>

        <div className="overflow-x-auto">
          {activeShifts.length === 0 ? (
            <div className="p-8 text-center">
              <svg
                className="w-16 h-16 text-slate-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <p className="text-slate-600">No employees currently clocked in</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Clock In Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Last Location
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {activeShifts.map((shift) => (
                  <tr key={shift.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-slate-900">
                          {shift.user.name}
                        </div>
                        <div className="text-sm text-slate-500">
                          {shift.user.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {formatTime(shift.actualStart)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {calculateDuration(shift.actualStart)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {shift.locationPings.length > 0 ? (
                        <span className="text-green-600">
                          📍 {formatTime(shift.locationPings[0].timestamp)}
                        </span>
                      ) : (
                        <span className="text-slate-400">No location data</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
