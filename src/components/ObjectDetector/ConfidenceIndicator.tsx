
import React from 'react';

interface ConfidenceIndicatorProps {
  isActive: boolean;
  confidence: number;
  objectName: string | null;
}

const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({ 
  isActive, 
  confidence, 
  objectName 
}) => {
  if (!isActive || confidence === 0) return null;
  
  return (
    <div className="absolute top-2 left-2 right-2 z-30">
      <div className="bg-black/40 backdrop-blur-sm rounded-lg p-2">
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div 
            className="bg-accent h-2.5 rounded-full" 
            style={{ width: `${Math.min(confidence, 100)}%` }}
          ></div>
        </div>
        <p className="text-xs text-white/80 mt-1 text-center">
          {objectName ? `Detected: ${objectName} (${Math.round(confidence)}%)` : 'No object detected'}
        </p>
      </div>
    </div>
  );
};

export default ConfidenceIndicator;
