'use client';

import { useEffect, useRef } from 'react';
import { useGeolocation } from './use-geolocation';

interface LocationTrackingOptions {
  shiftId: string | null;
  interval?: number; // in milliseconds
  onPing?: (coordinates: { latitude: number; longitude: number; accuracy: number }) => void;
  onError?: (error: string) => void;
}

export function useLocationTracking({
  shiftId,
  interval = 300000, // 5 minutes default
  onPing,
  onError,
}: LocationTrackingOptions) {
  const { requestLocation } = useGeolocation();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Only track if we have an active shift
    if (!shiftId) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Send initial ping
    const sendPing = async () => {
      try {
        const coordinates = await requestLocation();
        
        // Send to server
        const response = await fetch('/api/location-pings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            shiftId,
            ...coordinates,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to send location ping');
        }

        onPing?.(coordinates);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to get location';
        onError?.(message);
      }
    };

    // Send first ping immediately
    sendPing();

    // Set up periodic pings
    intervalRef.current = setInterval(sendPing, interval);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [shiftId, interval, requestLocation, onPing, onError]);
}
