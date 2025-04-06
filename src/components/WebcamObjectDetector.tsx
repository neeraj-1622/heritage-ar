
import React, { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as cocossd from '@tensorflow-models/coco-ssd';
import { toast } from "@/hooks/use-toast";
import { Button } from "./ui/button";
import { Camera, RefreshCw, Plus, Scan, Rotate3d, Check } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "./ui/progress";
import { createObjectModelFromImages } from '@/utils/objectReconstructor';

interface WebcamObjectDetectorProps {
  onDetection: (detection: { class: string; score: number; model?: any } | null) => void;
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
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [detectionConfidence, setDetectionConfidence] = useState<number>(0);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureProgress, setCaptureProgress] = useState(0);
  const [currentObject, setCurrentObject] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
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
      if (!videoRef.current || !model || !isDetecting || isCapturing) return;

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
            
            // Update current object being detected
            if (bestPrediction.score > 0.7) {
              setCurrentObject(bestPrediction.class);
            }
          } else {
            onDetection(null);
            setDetectionConfidence(0);
            setCurrentObject(null);
          }
        } else {
          onDetection(null);
          setDetectionConfidence(0);
          setCurrentObject(null);
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
  }, [model, enabled, onDetection, isCapturing]);

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
    
    // Add to captured images array
    setCapturedImages(prev => [...prev, imageDataUrl]);
    
    return imageDataUrl;
  };

  const startMultiAngleCapture = () => {
    if (!currentObject || detectionConfidence < 70) {
      toast({
        title: "No clear object detected",
        description: "Make sure an object is clearly visible",
        variant: "destructive"
      });
      return;
    }
    
    setIsCapturing(true);
    setCapturedImages([]);
    setCaptureProgress(0);
    
    toast({
      title: "Starting capture sequence",
      description: "Slowly rotate the object in front of the camera",
    });
    
    // Capture multiple images over time
    let captureCount = 0;
    const totalCaptures = 8; // Capture 8 angles
    
    const captureInterval = setInterval(() => {
      const image = captureImage();
      
      if (image) {
        captureCount++;
        const progress = (captureCount / totalCaptures) * 100;
        setCaptureProgress(progress);
        
        toast({
          title: `Captured angle ${captureCount} of ${totalCaptures}`,
          description: "Continue slowly rotating the object",
        });
        
        if (captureCount >= totalCaptures) {
          clearInterval(captureInterval);
          setIsCapturing(false);
          processImages(currentObject);
        }
      }
    }, 1000); // Capture an image every second
    
    return () => clearInterval(captureInterval);
  };

  const processImages = async (objectClass: string) => {
    if (capturedImages.length < 3) {
      toast({
        title: "Not enough images",
        description: "We need more angles to create a 3D model",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    
    toast({
      title: "Processing images",
      description: "Analyzing object structure...",
    });
    
    try {
      // Process images and create a 3D model representation
      const modelData = await createObjectModelFromImages(capturedImages, objectClass);
      
      // Send result to parent component
      onDetection({
        class: objectClass,
        score: 1.0,
        model: modelData
      });
      
      toast({
        title: "3D model created!",
        description: "Your object has been successfully rendered in 3D",
      });
    } catch (error) {
      console.error('Error processing images:', error);
      toast({
        title: "Error creating 3D model",
        description: "Please try again with clearer images",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
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
            {currentObject ? `Detected: ${currentObject} (${Math.round(detectionConfidence)}%)` : 'No object detected'}
          </p>
        </div>
      </div>
    );
  };

  // Render capture progress
  const renderCaptureProgress = () => {
    if (!isCapturing) return null;
    
    return (
      <div className="absolute bottom-20 left-4 right-4 z-30">
        <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3">
          <p className="text-white text-center mb-2">Capturing object from multiple angles</p>
          <Progress value={captureProgress} className="h-2" />
          <p className="text-xs text-white/80 mt-1 text-center">
            {Math.round(captureProgress)}% complete - Keep rotating the object
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
        
        {/* Capture progress */}
        {renderCaptureProgress()}

        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-20">
            <div className="bg-heritage-800/90 rounded-lg p-6 text-center">
              <div className="h-12 w-12 rounded-full border-4 border-accent/20 border-t-accent animate-spin mx-auto mb-4"></div>
              <p className="text-white">Processing 3D model...</p>
            </div>
          </div>
        )}

        {isStreamActive && (
          <div className="absolute bottom-4 right-4 z-20 flex space-x-2">
            {!isCapturing && !isProcessing && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="bg-accent hover:bg-accent/90 text-white rounded-full shadow-lg"
                      onClick={startMultiAngleCapture}
                      disabled={detectionConfidence < 70 || !currentObject}
                    >
                      <Rotate3d className="h-5 w-5" />
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
      
      {capturedImages.length > 0 && !isCapturing && !isProcessing && (
        <div className="mt-4 p-3 bg-heritage-800/30 backdrop-blur-sm rounded-lg">
          <p className="text-white text-sm mb-2">Captured images: {capturedImages.length}</p>
          <div className="flex overflow-x-auto pb-2 gap-2">
            {capturedImages.map((img, index) => (
              <div key={index} className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden">
                <img src={img} alt={`Angle ${index+1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WebcamObjectDetector;
