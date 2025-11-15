"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Link from "next/link";

interface LocationPing {
  id: string;
  latitude: number;
  longitude: number;
  timestamp: string;
}

interface Shift {
  id: string;
  userId: string;
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
  locationPings: LocationPing[];
}

export default function ShiftDetailPage() {
  const params = useParams();
  const shiftId = params.id as string;

  const { data, isLoading } = useQuery<{ shift: Shift }>({
    queryKey: ["shift", shiftId],
    queryFn: async () => {
      const res = await fetch(`/api/shifts/${shiftId}`);
      if (!res.ok) throw new Error("Failed to fetch shift");
      return res.json();
    },
  });

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = () => {
    if (!data?.shift.actualStart || !data?.shift.actualEnd) return "N/A";
    const durationMs =
      new Date(data.shift.actualEnd).getTime() -
      new Date(data.shift.actualStart).getTime();
    const hours = durationMs / (1000 * 60 * 60);
    const hrs = Math.floor(hours);
    const mins = Math.floor((hours - hrs) * 60);
    return `${hrs}h ${mins}m`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!data?.shift) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Shift not found</p>
        <Link
          href="/dashboard/admin/shifts"
          className="text-blue-600 dark:text-blue-400 hover:underline mt-4 inline-block"
        >
          ← Back to Shifts
        </Link>
      </div>
    );
  }

  const shift = data.shift;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Shift Details
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {shift.user.name} - {formatDateTime(shift.actualStart)}
          </p>
        </div>
        <Link
          href="/dashboard/admin/shifts"
          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
        >
          ← Back to Shifts
        </Link>
      </div>

      {/* Shift Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Shift Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Employee
            </label>
            <p className="text-gray-900 dark:text-gray-100">{shift.user.name}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {shift.user.email}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Status
            </label>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                shift.status === "COMPLETED"
                  ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                  : shift.status === "IN_PROGRESS"
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
              }`}
            >
              {shift.status}
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Scheduled Start
            </label>
            <p className="text-gray-900 dark:text-gray-100">
              {formatDateTime(shift.scheduledStart)}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Scheduled End
            </label>
            <p className="text-gray-900 dark:text-gray-100">
              {formatDateTime(shift.scheduledEnd)}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Actual Start
            </label>
            <p className="text-gray-900 dark:text-gray-100">
              {formatDateTime(shift.actualStart)}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Actual End
            </label>
            <p className="text-gray-900 dark:text-gray-100">
              {formatDateTime(shift.actualEnd)}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Duration
            </label>
            <p className="text-gray-900 dark:text-gray-100">{formatDuration()}</p>
          </div>
        </div>
      </div>

      {/* Location Pings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Location History ({shift.locationPings.length} pings)
        </h2>
        {shift.locationPings.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">
            No location data available for this shift
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Timestamp
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Latitude
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Longitude
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Map
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {shift.locationPings.map((ping) => (
                  <tr key={ping.id}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {new Date(ping.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {ping.latitude.toFixed(6)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {ping.longitude.toFixed(6)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <a
                        href={`https://www.google.com/maps?q=${ping.latitude},${ping.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        View on Map
                      </a>
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
}
