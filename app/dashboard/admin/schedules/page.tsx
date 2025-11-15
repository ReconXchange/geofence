"use client";

export default function SchedulesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Schedules
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage recurring schedules and shift assignments
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <p className="text-gray-600 dark:text-gray-400">
          Schedule management coming soon. This feature will allow you to:
        </p>
        <ul className="list-disc list-inside mt-4 space-y-2 text-gray-600 dark:text-gray-400">
          <li>Create recurring weekly schedules</li>
          <li>Assign shifts to employees</li>
          <li>View upcoming scheduled shifts</li>
          <li>Manage schedule templates</li>
        </ul>
      </div>
    </div>
  );
}
