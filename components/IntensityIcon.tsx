import React from 'react';
import { INTENSITY_COLORS, INTENSITY_MAP } from '../constants';

interface IntensityIconProps {
  intensity: number; // e.g., 40, 45, 50
  large?: boolean;
}

const IntensityIcon: React.FC<IntensityIconProps> = ({ intensity, large = false }) => {
  const displayIntensityKey = INTENSITY_MAP[intensity] || String(intensity);
  const color = INTENSITY_COLORS[displayIntensityKey] || '#cccccc';
  
  const sizeClasses = large
    ? 'w-24 h-24 text-4xl font-bold'
    : 'w-10 h-10 text-xl font-semibold';

  // Determine text color for better contrast
  const darkTextIntensities = [40, 45]; // Shindo 4 and 5-
  const textColor = darkTextIntensities.includes(intensity) ? 'text-black' : 'text-white';

  return (
    <div
      className={`flex items-center justify-center rounded-lg my-2 shadow-lg shrink-0 ${sizeClasses} ${textColor}`}
      style={{
        backgroundColor: color,
        textShadow: '0 1px 3px rgba(0,0,0,0.5)',
        boxShadow: `0 0 20px ${color}50`
      }}
    >
      {displayIntensityKey}
    </div>
  );
};

export default IntensityIcon;