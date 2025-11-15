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
}

export default function HistoryPage() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShifts();
  }, []);

  const fetchShifts = async () => {
    try {
      const response = await fetch('/api/shifts?limit=30');
      const data = await response.json();
      setShifts(data.shifts);
    } catch (error) {
      console.error('Failed to fetch shifts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
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

  const getTotalHours = () => {
    return shifts
      .filter((shift) => shift.actualStart && shift.actualEnd)
      .reduce((total, shift) => {
        const duration =
          new Date(shift.actualEnd!).getTime() -
          new Date(shift.actualStart!).getTime();
        return total + duration / (1000 * 60 * 60);
      }, 0)
      .toFixed(1);
  };

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading shifts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">
          Shift History
        </h2>
        <div className="bg-primary-50 rounded-lg p-4">
          <p className="text-sm text-primary-600">Total Hours Worked</p>
          <p className="text-3xl font-bold text-primary-900">
            {getTotalHours()}h
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {shifts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
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
          shifts.map((shift) => (
            <div
              key={shift.id}
              className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-medium text-slate-900">
                    {shift.actualStart
                      ? formatDate(shift.actualStart)
                      : formatDate(shift.createdAt)}
                  </p>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusBadge(
                      shift.status
                    )}`}
                  >
                    {shift.status}
                  </span>
                </div>
                {shift.actualStart && shift.actualEnd && (
                  <div className="text-right">
                    <p className="text-sm text-slate-600">Duration</p>
                    <p className="font-semibold text-slate-900">
                      {calculateDuration(shift.actualStart, shift.actualEnd)}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2 text-sm">
                {shift.actualStart && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Clock In:</span>
                    <span className="font-medium text-slate-900">
                      {formatTime(shift.actualStart)}
                    </span>
                  </div>
                )}
                {shift.actualEnd && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Clock Out:</span>
                    <span className="font-medium text-slate-900">
                      {formatTime(shift.actualEnd)}
                    </span>
                  </div>
                )}
                {shift.scheduledStart && shift.scheduledEnd && (
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-slate-500 text-xs">
                      Scheduled: {formatTime(shift.scheduledStart)} -{' '}
                      {formatTime(shift.scheduledEnd)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
