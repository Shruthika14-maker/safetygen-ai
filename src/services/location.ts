export type LocationStatus = 'AVAILABLE' | 'LOADING' | 'DENIED' | 'UNAVAILABLE';

export interface LocationData {
  status: LocationStatus;
  coordinates?: {
    lat: number;
    lng: number;
    accuracy?: number;
  };
  locationName: string;
  errorMessage?: string;
  timestamp?: number;
}

export function requestUserLocation(): Promise<LocationData> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      resolve({
        status: 'UNAVAILABLE',
        locationName: 'Location not supported by device',
        errorMessage: 'Geolocation is not supported by your browser.',
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        // Approximation of approximate region or formatted coordinate string
        const formatted = `${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E (±${Math.round(accuracy)}m)`;
        resolve({
          status: 'AVAILABLE',
          coordinates: {
            lat: latitude,
            lng: longitude,
            accuracy,
          },
          locationName: formatted,
          timestamp: position.timestamp,
        });
      },
      (error) => {
        let status: LocationStatus = 'UNAVAILABLE';
        let msg = 'Location could not be obtained. You can continue without location.';
        if (error.code === error.PERMISSION_DENIED) {
          status = 'DENIED';
          msg = 'Location permission was denied. You can continue without location.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          status = 'UNAVAILABLE';
          msg = 'Location information is currently unavailable.';
        } else if (error.code === error.TIMEOUT) {
          status = 'UNAVAILABLE';
          msg = 'Location request timed out.';
        }
        resolve({
          status,
          locationName: 'Location unavailable (Manual)',
          errorMessage: msg,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  });
}
