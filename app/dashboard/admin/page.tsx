"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

interface ActiveShift {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  actualStart: string;
  durationHours: string;
  lastLocation: {
    latitude: number;
    longitude: number;
    timestamp: string;
  } | null;
}

export default function AdminOverview() {
  const { data, isLoading } = useQuery<{ shifts: ActiveShift[] }>({
    queryKey: ["activeShifts"],
    queryFn: async () => {
      const res = await fetch("/api/admin/active-shifts");
      if (!res.ok) throw new Error("Failed to fetch active shifts");
      return res.json();
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (hours: string) => {
    const h = parseFloat(hours);
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

  const activeShifts = data?.shifts || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Overview
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Monitor active shifts and employee activity
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Active Shifts
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
            {activeShifts.length}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Total Hours Today
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
            {activeShifts
              .reduce((sum, shift) => sum + parseFloat(shift.durationHours), 0)
              .toFixed(1)}
            h
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Employees Clocked In
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
            {activeShifts.length}
          </div>
        </div>
      </div>

      {/* Active Shifts List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Currently Clocked In
          </h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {activeShifts.length === 0 ? (
            <div className="p-6 text-center text-gray-600 dark:text-gray-400">
              No active shifts
            </div>
          ) : (
            activeShifts.map((shift) => (
              <div key={shift.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {shift.userName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {shift.userEmail}
                    </p>
                    <div className="mt-2 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>Started: {formatTime(shift.actualStart)}</span>
                      <span>Duration: {formatDuration(shift.durationHours)}</span>
                    </div>
                    {shift.lastLocation && (
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        Last location: {shift.lastLocation.latitude.toFixed(4)},{" "}
                        {shift.lastLocation.longitude.toFixed(4)}
                      </p>
                    )}
                  </div>
                  <Link
                    href={`/dashboard/admin/shifts/${shift.id}`}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
