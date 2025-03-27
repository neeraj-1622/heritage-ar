
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { Interactive, useXR, useHitTest } from '@react-three/xr';
import * as THREE from 'three';
import { HistoricalSite } from './SiteCard';

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
  
  useFrame((state) => {
    if (modelRef.current) {
      // Optional: Add some subtle animation
      modelRef.current.rotation.y += 0.001;
    }
  });

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
  arMode: boolean;
  enableRotation?: boolean;
}

const ARModelViewer: React.FC<ARModelViewerProps> = ({ 
  selectedSite, 
  arMode, 
  enableRotation = false 
}) => {
  const [modelUrl, setModelUrl] = useState<string>(MODEL_MAPPINGS.default);
  const [hasXRSupport, setHasXRSupport] = useState<boolean | null>(null);

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
    if (selectedSite) {
      // Use the site-specific model if available, otherwise use the default
      setModelUrl(MODEL_MAPPINGS[selectedSite.name] || MODEL_MAPPINGS.default);
    }
  }, [selectedSite]);

  if (!selectedSite) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <p className="text-white">No site selected</p>
      </div>
    );
  }

  if (hasXRSupport === false) {
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
    <div className="h-full w-full">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 1, 5]} />
        
        {arMode ? (
          <>
            <ARCamera />
            <ARPlacement modelUrl={modelUrl} />
          </>
        ) : (
          <>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
            <Model url={modelUrl} scale={0.5} />
            {enableRotation ? null : <OrbitControls />}
            <Environment preset="sunset" />
          </>
        )}
      </Canvas>
    </div>
  );
};

export default ARModelViewer;
