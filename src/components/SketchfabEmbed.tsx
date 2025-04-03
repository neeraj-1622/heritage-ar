
import React, { useEffect, useRef } from 'react';

interface SketchfabEmbedProps {
  modelId: string;
  title?: string;
  autoStart?: boolean;
  autoSpin?: boolean;
  uiTheme?: 'dark' | 'light';
  className?: string;
  hideUi?: boolean;
}

declare global {
  interface Window {
    Sketchfab?: any;
  }
}

const SketchfabEmbed: React.FC<SketchfabEmbedProps> = ({
  modelId,
  title = "3D Model",
  autoStart = true,
  autoSpin = true,
  uiTheme = "dark",
  className = "",
  hideUi = false,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  useEffect(() => {
    // Initialize Sketchfab iframe API if needed
    const loadAPI = () => {
      if (window.Sketchfab) return;
      
      const script = document.createElement('script');
      script.src = 'https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js';
      script.async = true;
      document.body.appendChild(script);
    };
    
    loadAPI();
  }, []);

  // Construct the URL with parameters
  const embedUrl = `https://sketchfab.com/models/${modelId}/embed?autospin=${autoSpin ? 1 : 0}&autostart=${autoStart ? 1 : 0}&preload=1&ui_theme=${uiTheme}&ui_infos=${hideUi ? 0 : 1}&ui_controls=${hideUi ? 0 : 1}&ui_inspector=${hideUi ? 0 : 1}`;
  
  return (
    <div className={`sketchfab-embed-wrapper h-full w-full ${className}`}>
      <iframe 
        ref={iframeRef}
        title={title}
        className="w-full h-full"
        frameBorder="0"
        allowFullScreen={true}
        allow="autoplay; fullscreen; xr-spatial-tracking"
        data-mozallowfullscreen="true"
        data-webkitallowfullscreen="true"
        src={embedUrl}
      />
    </div>
  );
};

export default SketchfabEmbed;
