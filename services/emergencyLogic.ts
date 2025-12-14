import { Ambulance, Coordinate } from '../types';

// Simple Euclidean distance for the 2D grid demo
// In a real app, this would use the Haversine formula or Google Maps Distance Matrix API
export const calculateDistance = (p1: Coordinate, p2: Coordinate): number => {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
};

export const findNearestAmbulance = (
  userLocation: Coordinate,
  ambulances: Ambulance[]
): Ambulance | null => {
  const availableAmbulances = ambulances.filter(a => a.status === 'Available');
  
  if (availableAmbulances.length === 0) return null;

  // Sort by distance
  availableAmbulances.sort((a, b) => {
    const distA = calculateDistance(userLocation, a.location);
    const distB = calculateDistance(userLocation, b.location);
    return distA - distB;
  });

  // Calculate simulated ETA (assuming avg speed of 1km/min for grid units)
  const nearest = { ...availableAmbulances[0] };
  const dist = calculateDistance(userLocation, nearest.location);
  nearest.distance = parseFloat(dist.toFixed(2));
  nearest.eta = Math.ceil(dist * 0.8); // Random factor for minutes

  return nearest;
};
