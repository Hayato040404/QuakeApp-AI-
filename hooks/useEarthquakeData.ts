import { useState, useEffect } from 'react';
import { P2pEarthquake, ObservationLocations } from '../types';
import { fetchEarthquakeHistory, fetchObservationPointLocations } from '../services/jmaService';

export const useEarthquakeData = () => {
  const [earthquakes, setEarthquakes] = useState<P2pEarthquake[]>([]);
  const [locations, setLocations] = useState<ObservationLocations | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getEarthquakeData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [history, locationsData] = await Promise.all([
          fetchEarthquakeHistory(),
          fetchObservationPointLocations(),
        ]);
        setEarthquakes(history);
        setLocations(locationsData);
      } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('An unknown error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    getEarthquakeData();
  }, []);

  return { earthquakes, locations, loading, error };
};