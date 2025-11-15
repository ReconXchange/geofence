'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/auth-context';
import { useGeolocation } from '@/lib/hooks/use-geolocation';
import { useLocationTracking } from '@/lib/hooks/use-location-tracking';
import { Button } from '@/components/ui/button';

interface Shift {
  id: string;
  scheduledStart: string | null;
  scheduledEnd: string | null;
  actualStart: string | null;
  actualEnd: string | null;
  status: string;
}

export default function EmployeeDashboardPage() {
  const { user } = useAuth();
  const { requestLocation } = useGeolocation();
  const [currentShift, setCurrentShift] = useState<Shift | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationPermission, setLocationPermission] = useState<string>('prompt');

  // Track location while clocked in
  useLocationTracking({
    shiftId: currentShift?.status === 'IN_PROGRESS' ? currentShift.id : null,
    interval: parseInt(process.env.NEXT_PUBLIC_LOCATION_PING_INTERVAL || '300000'),
    onPing: (coords) => {
      console.log('Location ping sent:', coords);
    },
    onError: (err) => {
      console.error('Location tracking error:', err);
    },
  });

  useEffect(() => {
    fetchCurrentShift();
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    if ('permissions' in navigator) {
      try {
        const result = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
        setLocationPermission(result.state);
      } catch (error) {
        console.error('Error checking location permission:', error);
      }
    }
  };

  const fetchCurrentShift = async () => {
    try {
      const response = await fetch('/api/shifts/current');
      const data = await response.json();
      setCurrentShift(data.shift);
    } catch (error) {
      console.error('Failed to fetch current shift:', error);
    }
  };

  const handleClockIn = async () => {
    setError(null);
    setLoading(true);

    try {
      const coordinates = await requestLocation();

      const response = await fetch('/api/shifts/clock-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(coordinates),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to clock in');
      }

      const data = await response.json();
      setCurrentShift(data.shift);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clock in');
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    setError(null);
    setLoading(true);

    try {
      const coordinates = await requestLocation();

      const response = await fetch('/api/shifts/clock-out', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(coordinates),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to clock out');
      }

      const data = await response.json();
      setCurrentShift(data.shift);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clock out');
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

  const calculateDuration = (start: string) => {
    const startTime = new Date(start).getTime();
    const now = Date.now();
    const diff = now - startTime;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const isActiveShift = currentShift?.status === 'IN_PROGRESS';

  return (
    <div className="p-4 space-y-6">
      {/* Location Permission Warning */}
      {locationPermission === 'denied' && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          <p className="font-medium">Location Access Required</p>
          <p className="text-sm mt-1">
            Please enable location permissions in your browser settings to use clock in/out features.
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Current Status Card */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </h2>
          <div
            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
              isActiveShift
                ? 'bg-green-100 text-green-800'
                : 'bg-slate-100 text-slate-800'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full mr-2 ${
                isActiveShift ? 'bg-green-600' : 'bg-slate-400'
              }`}
            ></span>
            {isActiveShift ? 'Clocked In' : 'Not Clocked In'}
          </div>
        </div>

        {/* Active Shift Info */}
        {isActiveShift && currentShift?.actualStart && (
          <div className="bg-primary-50 rounded-lg p-4 mb-6">
            <div className="text-center">
              <p className="text-sm text-primary-600 mb-1">Clocked in at</p>
              <p className="text-3xl font-bold text-primary-900">
                {formatTime(currentShift.actualStart)}
              </p>
              <p className="text-sm text-primary-600 mt-2">
                Duration: {calculateDuration(currentShift.actualStart)}
              </p>
            </div>
          </div>
        )}

        {/* Clock In/Out Button */}
        <div className="space-y-3">
          {isActiveShift ? (
            <Button
              onClick={handleClockOut}
              variant="danger"
              size="lg"
              fullWidth
              loading={loading}
            >
              Clock Out
            </Button>
          ) : (
            <Button
              onClick={handleClockIn}
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              disabled={locationPermission === 'denied'}
            >
              Clock In
            </Button>
          )}

          {isActiveShift && (
            <p className="text-xs text-center text-slate-500">
              📍 Your location is being tracked while clocked in
            </p>
          )}
        </div>
      </div>

      {/* Today's Schedule */}
      {currentShift?.scheduledStart && currentShift?.scheduledEnd && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Today&apos;s Schedule
          </h3>
          <div className="flex items-center justify-between text-slate-600">
            <div>
              <p className="text-sm">Scheduled Start</p>
              <p className="text-lg font-medium text-slate-900">
                {formatTime(currentShift.scheduledStart)}
              </p>
            </div>
            <div className="text-slate-400">→</div>
            <div className="text-right">
              <p className="text-sm">Scheduled End</p>
              <p className="text-lg font-medium text-slate-900">
                {formatTime(currentShift.scheduledEnd)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h4 className="font-medium text-blue-900 mb-2">Privacy Notice</h4>
        <p className="text-sm text-blue-800">
          Your location is only tracked while you are clocked in. Location data
          is used for attendance verification and will be visible to your
          manager.
        </p>
      </div>
    </div>
  );
}
