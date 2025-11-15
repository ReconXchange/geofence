'use client';

import { useState, useEffect } from 'react';

interface Shift {
  id: string;
  scheduledStart: string | null;
  scheduledEnd: string | null;
  actualStart: string | null;
  actualEnd: string | null;
  status: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  _count: {
    locationPings: number;
  };
}

export default function ShiftsPage() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchShifts();
  }, [filter]);

  const fetchShifts = async () => {
    try {
      const url =
        filter === 'all' ? '/api/shifts' : `/api/shifts?status=${filter}`;
      const response = await fetch(url);
      const data = await response.json();
      setShifts(data.shifts || []);
    } catch (error) {
      console.error('Failed to fetch shifts:', error);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const calculateDuration = (start: string, end: string) => {
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    const diff = endTime - startTime;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      SCHEDULED: 'bg-blue-100 text-blue-800',
      IN_PROGRESS: 'bg-green-100 text-green-800',
      COMPLETED: 'bg-slate-100 text-slate-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return styles[status as keyof typeof styles] || styles.SCHEDULED;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading shifts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Shifts</h1>
        <p className="text-slate-600 mt-1">View and manage employee shifts</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all'
              ? 'bg-primary-600 text-white'
              : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('IN_PROGRESS')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'IN_PROGRESS'
              ? 'bg-primary-600 text-white'
              : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setFilter('COMPLETED')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'COMPLETED'
              ? 'bg-primary-600 text-white'
              : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          Completed
        </button>
        <button
          onClick={() => setFilter('SCHEDULED')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'SCHEDULED'
              ? 'bg-primary-600 text-white'
              : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          Scheduled
        </button>
      </div>

      {/* Shifts Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          {shifts.length === 0 ? (
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-slate-600">No shifts found</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Clock In/Out
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Location Pings
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {shifts.map((shift) => (
                  <tr key={shift.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">
                        {shift.user.name}
                      </div>
                      <div className="text-sm text-slate-500">
                        {shift.user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {shift.actualStart
                        ? formatDate(shift.actualStart)
                        : formatDate(shift.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {shift.actualStart && (
                        <div>
                          <div>{formatTime(shift.actualStart)}</div>
                          {shift.actualEnd && (
                            <div className="text-slate-500">
                              {formatTime(shift.actualEnd)}
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {shift.actualStart && shift.actualEnd
                        ? calculateDuration(shift.actualStart, shift.actualEnd)
                        : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
                          shift.status
                        )}`}
                      >
                        {shift.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {shift._count.locationPings} pings
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
