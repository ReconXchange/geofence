"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "@/hooks/useLocation";
import { useLocationTracking } from "@/hooks/useLocationTracking";

interface Shift {
  id: string;
  actualStart: string;
  status: string;
  durationHours: string;
  locationPings?: Array<{
    latitude: number;
    longitude: number;
    timestamp: string;
  }>;
}

export default function EmployeeDashboard() {
  const queryClient = useQueryClient();
  const { location, requestLocation } = useLocation();
  const [clockInError, setClockInError] = useState("");
  const [clockOutError, setClockOutError] = useState("");

  // Fetch current shift
  const { data: currentShiftData, isLoading } = useQuery<{ shift: Shift | null }>({
    queryKey: ["currentShift"],
    queryFn: async () => {
      const res = await fetch("/api/shifts/current");
      if (!res.ok) throw new Error("Failed to fetch shift");
      return res.json();
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const currentShift = currentShiftData?.shift;

  // Location tracking (only when clocked in)
  useLocationTracking({
    enabled: currentShift?.status === "IN_PROGRESS",
    interval: 3 * 60 * 1000, // 3 minutes
    onLocation: async (latitude, longitude) => {
      await fetch("/api/location-pings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latitude, longitude }),
      });
    },
  });

  // Clock in mutation
  const clockInMutation = useMutation({
    mutationFn: async (loc: { latitude: number; longitude: number }) => {
      const res = await fetch("/api/shifts/clock-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loc),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Clock-in failed");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentShift"] });
      setClockInError("");
    },
    onError: (error: Error) => {
      setClockInError(error.message);
    },
  });

  // Clock out mutation
  const clockOutMutation = useMutation({
    mutationFn: async (loc?: { latitude: number; longitude: number }) => {
      const res = await fetch("/api/shifts/clock-out", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loc || {}),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Clock-out failed");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentShift"] });
      queryClient.invalidateQueries({ queryKey: ["shiftHistory"] });
      setClockOutError("");
    },
    onError: (error: Error) => {
      setClockOutError(error.message);
    },
  });

  const handleClockIn = async () => {
    setClockInError("");
    const loc = await requestLocation();
    if (!loc) {
      setClockInError("Location is required to clock in");
      return;
    }
    clockInMutation.mutate(loc);
  };

  const handleClockOut = async () => {
    setClockOutError("");
    const loc = await requestLocation();
    clockOutMutation.mutate(loc || undefined);
  };

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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Today
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Current Shift Status */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        {currentShift ? (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Status
                </span>
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full text-sm font-medium">
                  Clocked In
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formatDuration(currentShift.durationHours)}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Since {formatTime(currentShift.actualStart)}
              </p>
            </div>

            {clockOutError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded text-sm">
                {clockOutError}
              </div>
            )}

            <button
              onClick={handleClockOut}
              disabled={clockOutMutation.isPending}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {clockOutMutation.isPending ? "Clocking Out..." : "Clock Out"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Status
                </span>
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full text-sm font-medium">
                  Not Clocked In
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Ready to start your shift?
              </p>
            </div>

            {clockInError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded text-sm">
                {clockInError}
              </div>
            )}

            <button
              onClick={handleClockIn}
              disabled={clockInMutation.isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {clockInMutation.isPending ? "Clocking In..." : "Clock In"}
            </button>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Location access will be requested when you clock in
            </p>
          </div>
        )}
      </div>

      {/* Today's Schedule (placeholder) */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Today's Schedule
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          No scheduled shift for today
        </p>
      </div>
    </div>
  );
}
