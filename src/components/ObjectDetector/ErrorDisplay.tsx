
import React from 'react';
import { Button } from "@/components/ui/button";

interface ErrorDisplayProps {
  error: string | null;
  onDismiss: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onDismiss }) => {
  if (!error) return null;
  
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-red-500/20 z-10 rounded-lg">
      <div className="bg-red-900/80 text-white p-4 rounded-lg max-w-xs text-center">
        <p>{error}</p>
        <Button 
          className="mt-3 bg-white text-red-900" 
          onClick={onDismiss}
        >
          Dismiss
        </Button>
      </div>
    </div>
  );
};

export default ErrorDisplay;
