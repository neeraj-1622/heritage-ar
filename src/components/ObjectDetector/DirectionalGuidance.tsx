
import React from 'react';
import { ChevronsLeft, ChevronsRight, ChevronsUp, ChevronsDown, RotateCcw } from 'lucide-react';

interface DirectionalGuidanceProps {
  isCapturing: boolean;
  currentSide: string;
  sidesTotal: number;
  sideCaptured: number;
}

const DirectionalGuidance: React.FC<DirectionalGuidanceProps> = ({
  isCapturing,
  currentSide,
  sidesTotal,
  sideCaptured
}) => {
  if (!isCapturing) return null;

  // Map cube sides to directions for visual guidance
  const getDirectionIcon = () => {
    switch (currentSide) {
      case 'front':
        return null; // Starting position
      case 'right':
        return <ChevronsRight className="h-8 w-8 text-white animate-pulse" />;
      case 'back':
        return <RotateCcw className="h-8 w-8 text-white animate-pulse" />;
      case 'left':
        return <ChevronsLeft className="h-8 w-8 text-white animate-pulse" />;
      case 'top':
        return <ChevronsUp className="h-8 w-8 text-white animate-pulse" />;
      case 'bottom':
        return <ChevronsDown className="h-8 w-8 text-white animate-pulse" />;
      default:
        return null;
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        {getDirectionIcon()}
      </div>
      
      <div className="absolute top-16 left-0 right-0 flex justify-center">
        <div className="bg-black/60 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
          {sideCaptured === 0 ? (
            <>Preparing to capture object from all sides</>
          ) : (
            <>
              Capturing: <span className="font-bold">{currentSide}</span> side
              <span className="text-xs ml-2">({sideCaptured}/{sidesTotal})</span>
            </>
          )}
        </div>
      </div>
      
      <div className="absolute bottom-20 left-4 right-4">
        <div className="bg-black/60 text-white p-3 rounded-lg text-sm backdrop-blur-sm text-center">
          {(() => {
            switch (currentSide) {
              case 'front':
                return "Position the object facing the camera";
              case 'right':
                return "Turn the object to show its right side";
              case 'back':
                return "Rotate to show the back of the object";
              case 'left':
                return "Turn to show the left side of the object";
              case 'top':
                return "Tilt to show the top of the object";
              case 'bottom':
                return "Tilt to show the bottom of the object";
              default:
                return "Rotate the object slowly";
            }
          })()}
        </div>
      </div>
    </div>
  );
};

export default DirectionalGuidance;
