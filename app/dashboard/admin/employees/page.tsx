'use client';

import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  _count: {
    shifts: number;
  };
}

export default function EmployeesPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'EMPLOYEE' | 'MANAGER'>('all');

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const fetchUsers = async () => {
    try {
      const url =
        filter === 'all'
          ? '/api/admin/users'
          : `/api/admin/users?role=${filter}`;
      const response = await fetch(url);
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role: string) => {
    const styles = {
      ADMIN: 'bg-purple-100 text-purple-800',
      MANAGER: 'bg-blue-100 text-blue-800',
      EMPLOYEE: 'bg-slate-100 text-slate-800',
    };
    return styles[role as keyof typeof styles] || styles.EMPLOYEE;
  };

  const getStatusBadge = (status: string) => {
    return status === 'ACTIVE'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading employees...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Employees</h1>
          <p className="text-slate-600 mt-1">Manage your team members</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-2">
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
          onClick={() => setFilter('EMPLOYEE')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'EMPLOYEE'
              ? 'bg-primary-600 text-white'
              : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          Employees
        </button>
        <button
          onClick={() => setFilter('MANAGER')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'MANAGER'
              ? 'bg-primary-600 text-white'
              : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          Managers
        </button>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          {users.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-slate-600">No employees found</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Total Shifts
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">
                        {user.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadge(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
                          user.status
                        )}`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {user._count.shifts}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {new Date(user.createdAt).toLocaleDateString()}
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
