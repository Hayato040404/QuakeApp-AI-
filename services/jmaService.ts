import { P2pEarthquake, ObservationLocations } from '../types';
import { P2PQUAKE_API_URL, OBSERVATION_POINTS_URL } from '../constants';

export async function fetchEarthquakeHistory(): Promise<P2pEarthquake[]> {
  const response = await fetch(P2PQUAKE_API_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch earthquake history. Status: ${response.status}`);
  }
  const data: P2pEarthquake[] = await response.json();
  // Filter out entries with no hypocenter info
  return data.filter(quake => quake.earthquake.hypocenter.latitude !== -200);
}

export async function fetchObservationPointLocations(): Promise<ObservationLocations> {
  const response = await fetch(OBSERVATION_POINTS_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch observation point locations. Status: ${response.status}`);
  }
  return response.json();
}
