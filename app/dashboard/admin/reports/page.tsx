'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function ReportsPage() {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (fromDate) params.append('from', fromDate);
      if (toDate) params.append('to', toDate);

      const response = await fetch(`/api/reports/attendance?${params}`);
      const data = await response.json();
      setReport(data);
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCSV = () => {
    const params = new URLSearchParams();
    if (fromDate) params.append('from', fromDate);
    if (toDate) params.append('to', toDate);
    params.append('format', 'csv');

    window.open(`/api/reports/attendance?${params}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Reports</h1>
        <p className="text-slate-600 mt-1">
          Generate and export attendance reports
        </p>
      </div>

      {/* Report Generator */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Attendance Report
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              From Date
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              To Date
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex items-end">
            <Button
              onClick={handleGenerateReport}
              loading={loading}
              fullWidth
            >
              Generate Report
            </Button>
          </div>
        </div>

        {report && (
          <div className="border-t border-slate-200 pt-4">
            <div className="flex justify-between items-center mb-4">
              <div className="space-y-1">
                <p className="text-sm text-slate-600">
                  Report Period:{' '}
                  {new Date(report.summary.dateRange.from).toLocaleDateString()}{' '}
                  to {new Date(report.summary.dateRange.to).toLocaleDateString()}
                </p>
                <p className="text-sm font-medium text-slate-900">
                  Total Shifts: {report.summary.totalShifts} | Total Hours:{' '}
                  {report.summary.totalHours}h
                </p>
              </div>
              <Button onClick={handleDownloadCSV} variant="outline">
                Download CSV
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Report Preview */}
      {report && report.report.length > 0 && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">
              Report Preview
            </h3>
          </div>
          <div className="overflow-x-auto">
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
                    Clock In
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Clock Out
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Hours
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {report.report.slice(0, 10).map((row: any, index: number) => (
                  <tr key={index} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">
                        {row.employeeName}
                      </div>
                      <div className="text-sm text-slate-500">
                        {row.employeeEmail}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {row.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {new Date(row.clockIn).toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {new Date(row.clockOut).toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      {row.hoursWorked}h
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {report.report.length > 10 && (
              <div className="px-6 py-4 bg-slate-50 text-sm text-slate-600 text-center">
                Showing 10 of {report.report.length} records. Download CSV for
                full report.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
