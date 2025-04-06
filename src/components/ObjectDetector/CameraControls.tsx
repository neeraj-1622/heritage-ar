
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw, Camera } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CameraControlsProps {
  isStreamActive: boolean;
  isCameraOn: boolean;
  isCapturing: boolean;
  isProcessing: boolean;
  detectionConfidence: number;
  currentObject: string | null;
  onCaptureStart: () => void;
  onToggleCamera: () => void;
  showCaptureButton?: boolean;
}

const CameraControls: React.FC<CameraControlsProps> = ({ 
  isStreamActive, 
  isCameraOn, 
  isCapturing, 
  isProcessing,
  detectionConfidence, 
  currentObject, 
  onCaptureStart, 
  onToggleCamera,
  showCaptureButton = true
}) => {
  if (!isStreamActive) return null;
  
  return (
    <div className="absolute bottom-4 right-4 z-20 flex space-x-2">
      {showCaptureButton && !isCapturing && !isProcessing && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="bg-accent hover:bg-accent/90 text-white rounded-full shadow-lg"
                onClick={onCaptureStart}
                disabled={detectionConfidence < 70 || !currentObject}
              >
                <span className="sr-only">Capture in 3D</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Capture object from multiple angles to create 3D model</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="bg-black/50 hover:bg-black/70 text-white rounded-full shadow-lg"
              onClick={onToggleCamera}
            >
              {isCameraOn ? (
                <RefreshCw className="h-5 w-5" />
              ) : (
                <Camera className="h-5 w-5" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isCameraOn ? "Restart camera" : "Turn on camera"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default CameraControls;
