export interface P2pPoint {
  pref: string;
  addr: string;
  isArea: boolean;
  scale: number;
}

export interface EnrichedP2pPoint extends P2pPoint {
  lat?: number;
  lon?: number;
  code?: string;
}

export interface P2pHypocenter {
  name: string;
  latitude: number;
  longitude: number;
  depth: number;
  magnitude: number;
}

export interface P2pEarthquakeInfo {
  time: string;
  hypocenter: P2pHypocenter;
  maxScale: number;
  domesticTsunami: string;
  foreignTsunami: string;
}

export interface P2pIssue {
    source: string;
    time: string;
    type: string;
}

export interface P2pEarthquake {
  id: string;
  code: number;
  time: string;
  issue: P2pIssue;
  earthquake: P2pEarthquakeInfo;
  points: P2pPoint[];
}

export interface EnrichedP2pEarthquake extends Omit<P2pEarthquake, 'points'>{
  points: EnrichedP2pPoint[];
}


export interface ObservationLocations {
  [code: string]: {
    name: string;
    location: [number, number]; // lat, lon
  };
}