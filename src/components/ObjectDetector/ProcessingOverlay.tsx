
import React from 'react';

interface ProcessingOverlayProps {
  isProcessing: boolean;
}

const ProcessingOverlay: React.FC<ProcessingOverlayProps> = ({ isProcessing }) => {
  if (!isProcessing) return null;
  
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-20">
      <div className="bg-heritage-800/90 rounded-lg p-6 text-center max-w-xs">
        <div className="h-12 w-12 rounded-full border-4 border-accent/20 border-t-accent animate-spin mx-auto mb-4"></div>
        <p className="text-white font-medium mb-2">Creating 3D Model</p>
        <p className="text-white/80 text-sm">
          Analyzing captured angles and reconstructing a 3D representation of your object...
        </p>
      </div>
    </div>
  );
};

export default ProcessingOverlay;
