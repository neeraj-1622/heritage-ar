
import React from 'react';
import { ChevronsLeft, ChevronsRight, ChevronsUp, ChevronsDown, RotateCcw, Camera } from 'lucide-react';

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
        return <Camera className="h-8 w-8 text-white animate-pulse" />;
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

  // Return a 3D rendering visualization of a cube with the current side highlighted
  const getCubeVisualization = () => {
    return (
      <div className="relative w-20 h-20 transform-gpu" style={{ perspective: '800px' }}>
        <div 
          className={`absolute inset-0 border-2 ${currentSide === 'front' ? 'bg-accent/30 border-accent animate-pulse' : 'bg-black/20 border-white/30'}`}
          style={{ transform: 'translateZ(10px)' }}
        ></div>
        <div 
          className={`absolute inset-0 border-2 ${currentSide === 'back' ? 'bg-accent/30 border-accent animate-pulse' : 'bg-black/20 border-white/30'}`}
          style={{ transform: 'translateZ(-10px)' }}
        ></div>
        <div 
          className={`absolute inset-0 border-2 ${currentSide === 'right' ? 'bg-accent/30 border-accent animate-pulse' : 'bg-black/20 border-white/30'}`}
          style={{ transform: 'rotateY(90deg) translateZ(10px)' }}
        ></div>
        <div 
          className={`absolute inset-0 border-2 ${currentSide === 'left' ? 'bg-accent/30 border-accent animate-pulse' : 'bg-black/20 border-white/30'}`}
          style={{ transform: 'rotateY(-90deg) translateZ(10px)' }}
        ></div>
        <div 
          className={`absolute inset-0 border-2 ${currentSide === 'top' ? 'bg-accent/30 border-accent animate-pulse' : 'bg-black/20 border-white/30'}`}
          style={{ transform: 'rotateX(90deg) translateZ(10px)' }}
        ></div>
        <div 
          className={`absolute inset-0 border-2 ${currentSide === 'bottom' ? 'bg-accent/30 border-accent animate-pulse' : 'bg-black/20 border-white/30'}`}
          style={{ transform: 'rotateX(-90deg) translateZ(10px)' }}
        ></div>
      </div>
    );
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
      
      <div className="absolute bottom-36 left-4 right-4">
        <div className="bg-black/60 text-white p-3 rounded-lg text-sm backdrop-blur-sm flex items-center justify-center gap-4">
          <div className="flex-shrink-0 hidden md:block">
            {getCubeVisualization()}
          </div>
          <div className="flex-1">
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
            <p className="text-xs mt-2 text-white/70">Tap anywhere on screen to manually capture this side</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectionalGuidance;
