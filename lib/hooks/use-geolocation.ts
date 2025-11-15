'use client';

import { useState, useEffect } from 'react';

interface GeolocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
}

interface GeolocationState {
  coordinates: GeolocationCoordinates | null;
  error: string | null;
  loading: boolean;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    coordinates: null,
    error: null,
    loading: false,
  });

  const requestLocation = (): Promise<GeolocationCoordinates> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      setState((prev) => ({ ...prev, loading: true, error: null }));

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coordinates = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };
          setState({
            coordinates,
            error: null,
            loading: false,
          });
          resolve(coordinates);
        },
        (error) => {
          const errorMessage =
            error.code === error.PERMISSION_DENIED
              ? 'Location permission denied'
              : error.code === error.POSITION_UNAVAILABLE
              ? 'Location information unavailable'
              : error.code === error.TIMEOUT
              ? 'Location request timed out'
              : 'An unknown error occurred';

          setState({
            coordinates: null,
            error: errorMessage,
            loading: false,
          });
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  };

  return {
    ...state,
    requestLocation,
  };
}
