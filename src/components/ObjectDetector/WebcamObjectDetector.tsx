
import React, { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as cocossd from '@tensorflow-models/coco-ssd';
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { createObjectModelFromImages } from '@/utils/objectReconstructor';
import { WebcamObjectDetectorProps, DetectionResult } from './types';
import ConfidenceIndicator from './ConfidenceIndicator';
import CaptureProgress from './CaptureProgress';
import CameraControls from './CameraControls';
import ImageGallery from './ImageGallery';
import ErrorDisplay from './ErrorDisplay';
import ProcessingOverlay from './ProcessingOverlay';
import DirectionalGuidance from './DirectionalGuidance';

// List of classes to filter out (human-related)
const FILTERED_CLASSES = ['person', 'man', 'woman', 'child', 'boy', 'girl', 'face', 'human'];

// Cube sides for directional guidance
const CUBE_SIDES = [
  'front', 'right', 'back', 'left', 'top', 'bottom'
];

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
  const [showModelButton, setShowModelButton] = useState(false);
  const [currentSideIndex, setCurrentSideIndex] = useState(0);
  const [objectDetectedTime, setObjectDetectedTime] = useState<number | null>(null);
  const [lastCaptureTime, setLastCaptureTime] = useState<number>(0);
  
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

  // Auto-start capture when object is consistently detected
  useEffect(() => {
    if (!currentObject || detectionConfidence < 70 || isCapturing || isProcessing) {
      setObjectDetectedTime(null);
      return;
    }
    
    // Start timer when object is first detected with good confidence
    if (objectDetectedTime === null) {
      setObjectDetectedTime(Date.now());
      return;
    }
    
    // If object has been detected continuously for 2 seconds, start capture
    const detectionDuration = Date.now() - objectDetectedTime;
    if (detectionDuration > 2000 && !isCapturing && !isProcessing) {
      startMultiAngleCapture();
    }
    
  }, [currentObject, detectionConfidence, isCapturing, isProcessing, objectDetectedTime]);

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
          description: "Point your camera at an object to start automatic 3D capture",
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
            pred => !FILTERED_CLASSES.includes(pred.class.toLowerCase())
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
    setLastCaptureTime(Date.now());
    
    // Move to next side
    setCurrentSideIndex(prev => (prev + 1) % CUBE_SIDES.length);
    
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
    setCurrentSideIndex(0);
    setLastCaptureTime(Date.now());
    
    toast({
      title: `Starting 3D capture of ${currentObject}`,
      description: "We'll guide you through rotating the object",
    });
    
    // First capture happens immediately
    captureImage();
  };

  // This effect manages the capture of images based on timing and user actions
  useEffect(() => {
    if (!isCapturing || isProcessing) return;
    
    const timeSinceLastCapture = Date.now() - lastCaptureTime;
    
    // Update progress based on captures
    const progress = (capturedImages.length / CUBE_SIDES.length) * 100;
    setCaptureProgress(progress);
    
    // If we've captured all sides, process the images
    if (capturedImages.length >= CUBE_SIDES.length) {
      setIsCapturing(false);
      processImages(currentObject!);
      return;
    }
    
    // Automatic capture every 3 seconds if user hasn't manually captured
    const captureTimeout = setTimeout(() => {
      if (isCapturing && timeSinceLastCapture > 3000) {
        captureImage();
        
        // Guide user for next side
        toast({
          title: `Captured ${CUBE_SIDES[currentSideIndex === 0 ? CUBE_SIDES.length - 1 : currentSideIndex - 1]} side`,
          description: `Now show the ${CUBE_SIDES[currentSideIndex]} side of the object`,
        });
      }
    }, 3000 - timeSinceLastCapture);
    
    return () => clearTimeout(captureTimeout);
  }, [isCapturing, isProcessing, capturedImages.length, lastCaptureTime, currentSideIndex, currentObject]);

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
        description: "Click the 'Show 3D Model' button to view your object in AR",
        action: (
          <Button 
            onClick={() => {
              setShowModelButton(false);
              // The parent component already has the model data from onDetection
            }} 
            variant="outline" 
            className="bg-accent text-white hover:bg-accent/90"
          >
            Show 3D Model
          </Button>
        ),
        duration: 10000,
      });
      
      setShowModelButton(true);
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

  return (
    <div className={`relative ${className}`}>
      <ErrorDisplay error={error} onDismiss={() => setError(null)} />
      
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

        <ConfidenceIndicator 
          isActive={isStreamActive} 
          confidence={detectionConfidence} 
          objectName={currentObject} 
        />
        
        <CaptureProgress 
          isCapturing={isCapturing} 
          progress={captureProgress} 
        />

        <DirectionalGuidance 
          isCapturing={isCapturing}
          currentSide={CUBE_SIDES[currentSideIndex]}
          sidesTotal={CUBE_SIDES.length}
          sideCaptured={capturedImages.length}
        />

        <ProcessingOverlay isProcessing={isProcessing} />

        <CameraControls 
          isStreamActive={isStreamActive}
          isCameraOn={isCameraOn}
          isCapturing={isCapturing}
          isProcessing={isProcessing}
          detectionConfidence={detectionConfidence}
          currentObject={currentObject}
          onCaptureStart={startMultiAngleCapture}
          onToggleCamera={toggleCamera}
          showCaptureButton={false} // Hide the manual capture button since it's automatic now
        />
      </div>
      
      <ImageGallery 
        images={capturedImages}
        isCapturing={isCapturing}
        isProcessing={isProcessing}
        sides={CUBE_SIDES}
      />
    </div>
  );
};

export default WebcamObjectDetector;
