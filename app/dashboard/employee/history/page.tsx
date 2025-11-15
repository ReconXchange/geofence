"use client";

import { useQuery } from "@tanstack/react-query";

interface Shift {
  id: string;
  scheduledStart: string | null;
  scheduledEnd: string | null;
  actualStart: string | null;
  actualEnd: string | null;
  status: string;
  durationHours: string;
  createdAt: string;
}

export default function HistoryPage() {
  const { data, isLoading } = useQuery<{ shifts: Shift[] }>({
    queryKey: ["shiftHistory"],
    queryFn: async () => {
      const res = await fetch("/api/shifts/history?limit=50");
      if (!res.ok) throw new Error("Failed to fetch history");
      return res.json();
    },
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (hours: string) => {
    const h = parseFloat(hours);
    if (h === 0) return "0h";
    const hrs = Math.floor(h);
    const mins = Math.floor((h - hrs) * 60);
    return `${hrs}h ${mins}m`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  const shifts = data?.shifts || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Shift History
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          View your past shifts and hours worked
        </p>
      </div>

      {shifts.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            No shift history found
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {shifts.map((shift) => (
            <div
              key={shift.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {formatDate(shift.actualStart || shift.createdAt)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatTime(shift.actualStart)} - {formatTime(shift.actualEnd)}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    shift.status === "COMPLETED"
                      ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                  }`}
                >
                  {shift.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Duration
                </span>
                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {formatDuration(shift.durationHours)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
