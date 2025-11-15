"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

export default function ReportsPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const { data, isLoading, refetch } = useQuery<{
    totals: { totalShifts: number; totalHours: string };
    shifts: any[];
  }>({
    queryKey: ["attendanceReport", from, to],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (from) params.append("from", from);
      if (to) params.append("to", to);
      const res = await fetch(`/api/reports/attendance?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch report");
      return res.json();
    },
    enabled: false, // Only fetch when explicitly requested
  });

  const handleGenerate = () => {
    refetch();
  };

  const handleDownloadCSV = async () => {
    const params = new URLSearchParams();
    if (from) params.append("from", from);
    if (to) params.append("to", to);
    params.append("format", "csv");
    window.open(`/api/reports/attendance?${params.toString()}`, "_blank");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Reports
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Generate attendance and compliance reports
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Attendance Report
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              From Date
            </label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              To Date
            </label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleGenerate}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Generate Report
          </button>
          {data && (
            <button
              onClick={handleDownloadCSV}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Download CSV
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-600 dark:text-gray-400">Loading...</div>
        </div>
      )}

      {data && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Shifts
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {data.totals.totalShifts}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Hours
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {data.totals.totalHours}h
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {data.shifts.length} shift{data.shifts.length !== 1 ? "s" : ""}
          </div>
        </div>
      )}
    </div>
  );
}
