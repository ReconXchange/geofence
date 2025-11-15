"use client";

import { useEffect, useRef } from "react";

interface UseLocationTrackingOptions {
  enabled: boolean;
  interval?: number; // in milliseconds
  onLocation: (latitude: number, longitude: number) => Promise<void>;
}

export function useLocationTracking({
  enabled,
  interval = 3 * 60 * 1000, // Default: 3 minutes
  onLocation,
}: UseLocationTrackingOptions) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isTrackingRef = useRef(false);

  useEffect(() => {
    if (!enabled || isTrackingRef.current) return;

    isTrackingRef.current = true;

    const sendLocation = async () => {
      if (!navigator.geolocation) {
        console.warn("Geolocation not supported");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            await onLocation(
              position.coords.latitude,
              position.coords.longitude
            );
          } catch (error) {
            console.error("Failed to send location:", error);
          }
        },
        (error) => {
          console.error("Location error:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000, // Accept cached location up to 1 minute old
        }
      );
    };

    // Send immediately
    sendLocation();

    // Then send periodically
    intervalRef.current = setInterval(sendLocation, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      isTrackingRef.current = false;
    };
  }, [enabled, interval, onLocation]);
}
