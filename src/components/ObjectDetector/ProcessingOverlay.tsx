
import React from 'react';

interface ProcessingOverlayProps {
  isProcessing: boolean;
}

const ProcessingOverlay: React.FC<ProcessingOverlayProps> = ({ isProcessing }) => {
  if (!isProcessing) return null;
  
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-20">
      <div className="bg-heritage-800/90 rounded-lg p-6 text-center">
        <div className="h-12 w-12 rounded-full border-4 border-accent/20 border-t-accent animate-spin mx-auto mb-4"></div>
        <p className="text-white">Processing 3D model...</p>
      </div>
    </div>
  );
};

export default ProcessingOverlay;
