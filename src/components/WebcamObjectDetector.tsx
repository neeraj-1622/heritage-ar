
import React, { useRef, useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import { toast } from "@/hooks/use-toast";
import { Button } from "./ui/button";
import { Camera, RefreshCw, Plus, Scan } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface WebcamObjectDetectorProps {
  onDetection: (detection: cocoSsd.DetectedObject | null) => void;
  className?: string;
  autoStart?: boolean;
}

const WebcamObjectDetector: React.FC<WebcamObjectDetectorProps> = ({ 
  onDetection,
  className = '',
  autoStart = true
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [isStreamActive, setIsStreamActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  
  // Load the COCO-SSD model
  useEffect(() => {
    const loadModel = async () => {
      try {
        setIsModelLoading(true);
        await tf.ready();
        console.log("TensorFlow.js is ready");
        const loadedModel = await cocoSsd.load();
        setModel(loadedModel);
        setIsModelLoading(false);
        console.log("COCO-SSD model loaded successfully");
        toast({
          title: "Ready to detect objects",
          description: "Point your camera at an object to detect it",
        });
        
        // Auto-enable camera if autoStart is true
        if (autoStart) {
          enableCam();
        }
      } catch (err) {
        console.error('Failed to load TensorFlow model:', err);
        setError('Failed to load object detection model. Please check your connection and try again.');
        setIsModelLoading(false);
      }
    };
    
    loadModel();
    
    return () => {
      // Clean up TensorFlow memory when component unmounts
      if (tf.getBackend()) {
        tf.disposeVariables();
      }
      stopCamera();
    };
  }, [autoStart]);
  
  // Initialize webcam on button click
  const enableCam = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Your browser does not support webcam access');
      return;
    }
    
    try {
      const constraints = {
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'environment'
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
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
      }
    } catch (err) {
      console.error('Error accessing webcam:', err);
      setError('Could not access webcam. Please check permissions and try again.');
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

  const toggleCamera = () => {
    if (isCameraOn) {
      stopCamera();
      toast({
        title: "Camera deactivated",
      });
    } else {
      enableCam();
    }
  };

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
        if (predictions.length > 0) {
          // Find prediction with highest confidence
          const topPrediction = predictions.reduce((prev, current) => 
            (prev.score > current.score) ? prev : current
          );
          
          onDetection(topPrediction);
          toast({
            title: `Detected: ${topPrediction.class}`,
            description: `Confidence: ${Math.round(topPrediction.score * 100)}%`
          });
        } else {
          toast({
            title: "No objects detected",
            description: "Try again with a different angle or object"
          });
        }
      });
    }
  };
  
  // Perform object detection on video frames
  useEffect(() => {
    let animationId: number;
    let lastDetectionTime = 0;
    const detectionInterval = 500; // ms between detections to avoid performance issues
    
    const detectObjects = async () => {
      if (!model || !videoRef.current || !canvasRef.current || !isStreamActive || videoRef.current.paused || videoRef.current.ended) {
        animationId = requestAnimationFrame(detectObjects);
        return;
      }
      
      const now = Date.now();
      if (now - lastDetectionTime < detectionInterval) {
        animationId = requestAnimationFrame(detectObjects);
        return;
      }
      
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Ensure video is ready
      if (video.readyState < 2) {
        animationId = requestAnimationFrame(detectObjects);
        return;
      }
      
      try {
        // Perform the detection
        const predictions = await model.detect(video);
        
        // Draw detections
        const ctx = canvas.getContext('2d');
        if (ctx) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // Process detections
          if (predictions.length > 0) {
            // Use the highest confidence detection
            const topPrediction = predictions.reduce((prev, current) => 
              (prev.score > current.score) ? prev : current
            );
            
            // Draw bounding box
            ctx.strokeStyle = '#FF0000';
            ctx.lineWidth = 2;
            ctx.strokeRect(
              topPrediction.bbox[0], 
              topPrediction.bbox[1], 
              topPrediction.bbox[2], 
              topPrediction.bbox[3]
            );
            
            // Draw label
            ctx.fillStyle = '#FF0000';
            ctx.font = '18px Arial';
            ctx.fillText(
              `${topPrediction.class} (${Math.round(topPrediction.score * 100)}%)`,
              topPrediction.bbox[0],
              topPrediction.bbox[1] > 20 ? topPrediction.bbox[1] - 5 : topPrediction.bbox[1] + 20
            );
            
            // Send the detection to parent component
            onDetection(topPrediction);
          } else {
            // No objects detected
            onDetection(null);
          }
        }
        
        lastDetectionTime = now;
      } catch (err) {
        console.error('Error during object detection:', err);
      }
      
      animationId = requestAnimationFrame(detectObjects);
    };
    
    // Only start detection loop when model is loaded and stream is active
    if (!isModelLoading && isStreamActive) {
      detectObjects();
    }
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [model, isModelLoading, isStreamActive, onDetection]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);
  
  return (
    <div className={`relative ${className}`}>
      {isModelLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10 rounded-lg">
          <div className="text-center p-4">
            <div className="h-8 w-8 border-4 border-t-accent border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-white text-sm">Loading object detection model...</p>
          </div>
        </div>
      )}
      
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
        {!isStreamActive && !isModelLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-5">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    className="bg-accent hover:bg-accent/80" 
                    onClick={enableCam}
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
        />
        <canvas 
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
        />

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
