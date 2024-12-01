import { computeDestinationPoint, getDistance } from 'geolib';

export async function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      }
    );
  });
}

export function isWithinRadius(point1, point2, radiusInMeters) {
  const distance = getDistance(
    { latitude: point1.latitude, longitude: point1.longitude },
    { latitude: point2.latitude, longitude: point2.longitude }
  );
  return distance <= radiusInMeters;
}

export function parseLocationString(locationString) {
  try {
    const [latitude, longitude] = locationString.split(',').map(Number);
    if (isNaN(latitude) || isNaN(longitude)) return null;
    return { latitude, longitude };
  } catch {
    return null;
  }
}