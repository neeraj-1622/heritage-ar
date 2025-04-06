
import React from 'react';
import { Progress } from "@/components/ui/progress";

interface CaptureProgressProps {
  isCapturing: boolean;
  progress: number;
}

const CaptureProgress: React.FC<CaptureProgressProps> = ({ isCapturing, progress }) => {
  if (!isCapturing) return null;
  
  return (
    <div className="absolute bottom-20 left-4 right-4 z-30">
      <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3">
        <p className="text-white text-center mb-2">Capturing object from multiple angles</p>
        <Progress value={progress} className="h-2" />
        <p className="text-xs text-white/80 mt-1 text-center">
          {Math.round(progress)}% complete - Keep rotating the object
        </p>
      </div>
    </div>
  );
};

export default CaptureProgress;
