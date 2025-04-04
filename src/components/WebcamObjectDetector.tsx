
import React, { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as cocossd from '@tensorflow-models/coco-ssd';
import { toast } from "@/hooks/use-toast";
import { Button } from "./ui/button";
import { Camera, RefreshCw, Plus, Scan } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface WebcamObjectDetectorProps {
  onDetection: (detection: { class: string; score: number } | null) => void;
  enabled?: boolean;
  className?: string;
}

const WebcamObjectDetector: React.FC<WebcamObjectDetectorProps> = ({ 
  onDetection, 
  enabled = true,
  className = '' 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [model, setModel] = useState<cocossd.ObjectDetection | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isStreamActive, setIsStreamActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [detectionConfidence, setDetectionConfidence] = useState<number>(0);
  
  // List of classes to filter out (human-related)
  const filteredClasses = ['person', 'man', 'woman', 'child', 'boy', 'girl', 'face', 'human'];
  
  useEffect(() => {
    const initializeModel = async () => {
      try {
        await tf.setBackend('webgl');
        const loadedModel = await cocossd.load();
        setModel(loadedModel);
        setIsInitialized(true);
        toast({
          title: "Ready to detect objects",
          description: "Point your camera at an object to detect it",
        });
      } catch (error) {
        console.error('Error initializing object detection:', error);
        setError('Failed to load object detection model. Please check your connection and try again.');
        setIsInitialized(false);
      }
    };

    initializeModel();
  }, []);

  useEffect(() => {
    // Automatically setup webcam when component mounts
    setupWebcam();
    
    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const setupWebcam = async () => {
    if (!videoRef.current) return;

    try {
      const constraints = {
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'environment'
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current?.play().catch(err => {
          console.error("Error playing video:", err);
          setError("Could not start video stream. Please check permissions.");
        });
        setIsStreamActive(true);
        setIsCameraOn(true);
        toast({
          title: "Camera activated",
          description: "Point your camera at an object to detect it",
        });
      };
    } catch (error) {
      console.error('Error accessing webcam:', error);
      setError('Could not access webcam. Please check permissions and try again.');
    }
  };

  useEffect(() => {
    if (!model || !videoRef.current || !enabled) {
      onDetection(null);
      return;
    }

    let animationFrameId: number;
    let isDetecting = true;

    const detectObjects = async () => {
      if (!videoRef.current || !model || !isDetecting) return;

      try {
        const predictions = await model.detect(videoRef.current);
        
        if (predictions && predictions.length > 0) {
          // Filter out human-related detections
          const filteredPredictions = predictions.filter(
            pred => !filteredClasses.includes(pred.class.toLowerCase())
          );
          
          if (filteredPredictions.length > 0) {
            const bestPrediction = filteredPredictions.reduce((prev, current) => 
              (current.score > prev.score) ? current : prev
            );
            
            onDetection({
              class: bestPrediction.class,
              score: bestPrediction.score
            });
            
            setDetectionConfidence(bestPrediction.score * 100);
          } else {
            onDetection(null);
            setDetectionConfidence(0);
          }
        } else {
          onDetection(null);
          setDetectionConfidence(0);
        }
      } catch (error) {
        console.error('Error detecting objects:', error);
        onDetection(null);
      }

      if (isDetecting) {
        animationFrameId = requestAnimationFrame(detectObjects);
      }
    };

    if (videoRef.current.readyState === 4) {
      detectObjects();
    } else {
      videoRef.current.addEventListener('loadeddata', detectObjects);
    }

    return () => {
      isDetecting = false;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (videoRef.current) {
        videoRef.current.removeEventListener('loadeddata', detectObjects);
      }
    };
  }, [model, enabled, onDetection]);

  const captureImage = () => {
    if (!canvasRef.current || !videoRef.current || !isStreamActive) return;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const imageDataUrl = canvas.toDataURL('image/png');
    setCapturedImage(imageDataUrl);
    
    // Detect objects in the captured image
    if (model) {
      model.detect(canvas).then(predictions => {
        // Filter out human-related detections
        const filteredPredictions = predictions.filter(
          pred => !filteredClasses.includes(pred.class.toLowerCase())
        );
        
        if (filteredPredictions.length > 0) {
          // Find prediction with highest confidence
          const topPrediction = filteredPredictions.reduce((prev, current) => 
            (prev.score > current.score) ? prev : current
          );
          
          onDetection({
            class: topPrediction.class,
            score: topPrediction.score
          });
          toast({
            title: `Detected: ${topPrediction.class}`,
            description: `Confidence: ${Math.round(topPrediction.score * 100)}%`
          });
        } else {
          toast({
            title: "No objects detected",
            description: "Try again with a different object"
          });
        }
      });
    }
  };

  const toggleCamera = async () => {
    if (isCameraOn) {
      stopCamera();
      toast({
        title: "Camera deactivated",
      });
    } else {
      setupWebcam();
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreamActive(false);
      setIsCameraOn(false);
    }
  };

  // Render detection confidence indicator
  const renderConfidenceIndicator = () => {
    if (!isStreamActive || detectionConfidence === 0) return null;
    
    return (
      <div className="absolute top-2 left-2 right-2 z-30">
        <div className="bg-black/40 backdrop-blur-sm rounded-lg p-2">
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div 
              className="bg-accent h-2.5 rounded-full" 
              style={{ width: `${Math.min(detectionConfidence, 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-white/80 mt-1 text-center">
            Detection confidence: {Math.round(detectionConfidence)}%
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className={`relative ${className}`}>
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-500/20 z-10 rounded-lg">
          <div className="bg-red-900/80 text-white p-4 rounded-lg max-w-xs text-center">
            <p>{error}</p>
            <Button 
              className="mt-3 bg-white text-red-900" 
              onClick={() => setError(null)}
            >
              Dismiss
            </Button>
          </div>
        </div>
      )}
      
      <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg bg-black">
        {!isStreamActive && !isInitialized && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-5">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    className="bg-accent hover:bg-accent/80" 
                    onClick={toggleCamera}
                    size="lg"
                  >
                    <Camera className="mr-2" /> Activate Camera
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Turn on your camera to detect objects</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
        
        <video 
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          playsInline
          muted
          style={{ 
            opacity: isInitialized ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out'
          }}
        />
        <canvas 
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
        />

        {/* Confidence indicator */}
        {renderConfidenceIndicator()}

        {isStreamActive && (
          <div className="absolute bottom-4 right-4 z-20 flex space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="bg-black/50 hover:bg-black/70 text-white rounded-full shadow-lg"
                    onClick={captureImage}
                  >
                    <Scan className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Capture and analyze object</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="bg-black/50 hover:bg-black/70 text-white rounded-full shadow-lg"
                    onClick={toggleCamera}
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
        )}
      </div>
    </div>
  );
};

export default WebcamObjectDetector;
