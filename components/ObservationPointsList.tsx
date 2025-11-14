import React from 'react';
import { EnrichedP2pPoint } from '../types';
import IntensityIcon from './IntensityIcon';

interface ObservationPointsListProps {
  points: EnrichedP2pPoint[];
}

const ObservationPointsList: React.FC<ObservationPointsListProps> = ({ points }) => {
  if (!points || points.length === 0) {
    return (
      <div className="w-full h-full p-6 bg-white/50 dark:bg-gray-800/20 rounded-lg border border-gray-200 dark:border-gray-700/50 flex flex-col justify-center items-center backdrop-blur-sm">
        <p className="text-gray-600 dark:text-gray-400">観測点情報がありません。</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white/50 dark:bg-gray-800/20 rounded-lg border border-gray-200 dark:border-gray-700/50 backdrop-blur-sm">
      <div className="overflow-y-auto space-y-1 p-2 custom-scrollbar h-full">
        {points
          .sort((a, b) => b.scale - a.scale)
          .map((point, index) => (
            <div key={`${point.code}-${index}`} className="flex items-center justify-between p-2 rounded-md bg-gray-500/5 hover:bg-gray-500/10 transition-colors">
              <div className="flex-1 overflow-hidden mr-2">
                <p className="font-medium text-sm text-gray-800 dark:text-gray-200 truncate">{point.addr}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{point.pref}</p>
              </div>
              <IntensityIcon intensity={point.scale} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default ObservationPointsList;
