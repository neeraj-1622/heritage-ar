
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { Interactive, useXR, useHitTest } from '@react-three/xr';
import * as THREE from 'three';
import { HistoricalSite } from './SiteCard';
import { getModelForObject } from '../utils/objectToModelMapper';
import { toast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Default 3D models for historical sites
const MODEL_MAPPINGS: Record<string, string> = {
  'The Colosseum': '/models/colosseum.glb',
  'Machu Picchu': '/models/machu_picchu.glb',
  'Parthenon': '/models/parthenon.glb',
  'Taj Mahal': '/models/taj_mahal.glb',
  'Angkor Wat': '/models/angkor_wat.glb',
  'Chichen Itza': '/models/chichen_itza.glb',
  // Fallback to a default model if no matching model is found
  'default': '/models/monument.glb',
};

// Fallback placeholder model when 3D model isn't available
function PlaceholderModel({ position = [0, 0, 0], scale = 1 }: { position?: [number, number, number], scale?: number }) {
  return (
    <mesh position={position} scale={[scale, scale, scale]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="white" />
    </mesh>
  );
}

// Model component that loads and displays a 3D model
function Model({ url, position = [0, 0, 0], scale = 1 }: { url: string, position?: [number, number, number], scale?: number }) {
  const { scene } = useGLTF(url, true);
  const modelRef = useRef<THREE.Group>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  
  useEffect(() => {
    if (scene) {
      setModelLoaded(true);
      console.log("Model loaded successfully:", url);
    }
  }, [scene, url]);

  useFrame((state) => {
    if (modelRef.current) {
      // Optional: Add some subtle animation
      modelRef.current.rotation.y += 0.005;
    }
  });

  // If there's an error loading the model, show a placeholder
  if (!modelLoaded) {
    return <PlaceholderModel position={position} scale={scale} />;
  }

  return (
    <primitive 
      ref={modelRef}
      object={scene.clone()} 
      position={position} 
      scale={[scale, scale, scale]} 
    />
  );
}

// AR Placement component that places models in AR space
function ARPlacement({ modelUrl }: { modelUrl: string }) {
  const [placed, setPlaced] = useState(false);
  const [position, setPosition] = useState<[number, number, number]>([0, 0, 0]);
  const { isPresenting } = useXR();
  
  // Hit test to place model on surfaces
  useHitTest((hitMatrix, hit) => {
    if (!placed) {
      hitMatrix.decompose(
        new THREE.Vector3().setFromMatrixPosition(hitMatrix),
        new THREE.Quaternion().setFromRotationMatrix(hitMatrix),
        new THREE.Vector3().setFromMatrixScale(hitMatrix)
      );
      
      const pos = new THREE.Vector3().setFromMatrixPosition(hitMatrix);
      setPosition([pos.x, pos.y, pos.z]);
      setPlaced(true);
      
      toast({
        title: "Model Placed",
        description: "3D model has been placed in AR space"
      });
    }
  });

  if (!isPresenting || !placed) {
    return null;
  }

  return <Model url={modelUrl} position={position} scale={0.5} />;
}

// Camera component that handles device orientation
function ARCamera() {
  const { camera } = useThree();
  
  useEffect(() => {
    camera.position.set(0, 1.6, 3);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  
  return null;
}

interface ARModelViewerProps {
  selectedSite?: HistoricalSite;
  detectedObject?: { class: string; score: number } | null;
  arMode: boolean;
  enableRotation?: boolean;
  onCameraToggle?: () => void;
  onModelToggle?: () => void;
  cameraActive?: boolean;
}

const ARModelViewer: React.FC<ARModelViewerProps> = ({ 
  selectedSite, 
  detectedObject,
  arMode, 
  enableRotation = false,
  onCameraToggle,
  onModelToggle,
  cameraActive
}) => {
  const [modelUrl, setModelUrl] = useState<string>(MODEL_MAPPINGS.default);
  const [modelScale, setModelScale] = useState<number>(0.5);
  const [hasXRSupport, setHasXRSupport] = useState<boolean | null>(null);
  const [modelLoaded, setModelLoaded] = useState(false);

  useEffect(() => {
    // Check if WebXR is supported
    if (navigator.xr) {
      navigator.xr.isSessionSupported('immersive-ar')
        .then(supported => setHasXRSupport(supported))
        .catch(() => setHasXRSupport(false));
    } else {
      setHasXRSupport(false);
    }
  }, []);

  useEffect(() => {
    // Choose between site model or detected object model
    if (detectedObject && detectedObject.class) {
      const objectModel = getModelForObject(detectedObject.class);
      setModelUrl(objectModel.modelUrl);
      setModelScale(objectModel.scale);
      console.log("Setting model for detected object:", detectedObject.class, objectModel.modelUrl);
      setModelLoaded(true);
    } else if (selectedSite) {
      // Use the site-specific model if available, otherwise use the default
      const siteModelUrl = MODEL_MAPPINGS[selectedSite.name] || MODEL_MAPPINGS.default;
      setModelUrl(siteModelUrl);
      setModelScale(0.5);
      console.log("Setting model for selected site:", selectedSite.name, siteModelUrl);
      setModelLoaded(true);
    }
  }, [selectedSite, detectedObject]);

  if (!selectedSite && !detectedObject) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-black/30">
        <p className="text-white">Select a site or detect an object to view 3D model</p>
      </div>
    );
  }

  if (hasXRSupport === false && arMode) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full p-4 text-center">
        <div className="bg-black/50 p-4 rounded-lg backdrop-blur-sm">
          <h3 className="text-white text-lg font-medium mb-2">WebXR Not Supported</h3>
          <p className="text-white/80">
            Your browser or device doesn't support WebXR required for AR.
            <br />
            Try using a supported mobile browser like Chrome on Android.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative">
      <Canvas className="touch-none" shadows>
        <PerspectiveCamera makeDefault position={[0, 1, 5]} />
        
        {arMode ? (
          <>
            <ARCamera />
            <ARPlacement modelUrl={modelUrl} />
          </>
        ) : (
          <>
            <ambientLight intensity={1} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} castShadow />
            <Model url={modelUrl} scale={modelScale} />
            {enableRotation ? null : <OrbitControls enableZoom={true} enablePan={true} />}
            <Environment preset="sunset" />
          </>
        )}
      </Canvas>

      {/* Control buttons */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 z-10">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={onCameraToggle}
                className={`p-3 rounded-full ${cameraActive ? 'bg-accent' : 'bg-heritage-800'} text-white`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Toggle camera for object detection</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={onModelToggle}
                className="p-3 rounded-full bg-heritage-800 text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>View 3D model in 360 degrees</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Loading overlay */}
      <div className="absolute top-0 left-0 right-0 bg-black/30 text-white p-2 text-sm text-center">
        {detectedObject ? 
          `Detected: ${detectedObject.class} (${Math.round(detectedObject.score * 100)}%)` : 
          selectedSite ? `Viewing: ${selectedSite.name}` : 'No object detected'}
      </div>
    </div>
  );
};

export default ARModelViewer;
