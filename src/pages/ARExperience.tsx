
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import ARView from '@/components/ARView';
import WebcamObjectDetector from '@/components/WebcamObjectDetector';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { ArrowLeft, Info, Box, View, Menu, Camera } from 'lucide-react';
import { defaultSites } from '@/backend/data/defaultSites';
import { supabase } from '@/lib/supabase';
import { HistoricalSite } from '@/lib/supabase';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const ARExperience = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [showInstructions, setShowInstructions] = useState(true);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [objectDetection, setObjectDetection] = useState<{ class: string; score: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const modelUrl = searchParams.get('modelUrl') || '/models/monument.glb';
  
  const handleBackClick = () => {
    navigate(-1);
  };
  
  const handleGoToHistoricalSite = () => {
    navigate('/historical-site');
  };
  
  const handleSelectSite = () => {
    navigate('/historical-site');
  };

  const handleCameraToggle = () => {
    setIsCameraActive(!isCameraActive);
    if (!isCameraActive) {
      toast({
        title: 'Camera activated',
        description: 'Point your camera at an object to create a 3D model',
      });
    }
  };

  const handleObjectDetection = (detection: { class: string; score: number } | null) => {
    if (detection && detection.score > 0.7) {
      setObjectDetection(detection);
      toast({
        title: `Detected ${detection.class}`,
        description: `Confidence: ${Math.round(detection.score * 100)}%`,
      });
    }
  };

  useEffect(() => {
    toast({
      title: 'AR Experience Loaded',
      description: 'Activate the camera to detect objects and create 3D models',
      duration: 5000,
    });
  }, []);

  const Instructions = () => (
    <>
      <div className="space-y-4 mb-4">
        <h3 className="text-lg font-medium">How to use AR mode:</h3>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Click the camera button to activate your device camera</li>
          <li>Point your camera at an object to analyze and create a 3D model</li>
          <li>Click the "Historical Site" button to switch to historical site view</li>
          <li>Select a historical site from the dropdown to view its 3D model</li>
        </ol>
      </div>
    </>
  );

  return (
    <div className="h-screen w-screen bg-black overflow-hidden relative">
      {isCameraActive ? (
        <WebcamObjectDetector 
          onDetection={handleObjectDetection} 
          enabled={true} 
          className="h-full w-full"
        />
      ) : (
        <ARView
          modelUrl={modelUrl}
          selectedSite={null}
          showModel={objectDetection !== null}
          enableRotation={false}
          onInfoClick={() => {
            // Handle info click if needed
          }}
          onNextSite={() => {
            // Handle next site if needed
          }}
        />
      )}
      
      <div className="absolute top-0 left-0 right-0 p-4 z-10">
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full bg-black/50 text-white hover:bg-black/70"
            onClick={handleBackClick}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex-1 text-center">
            <h2 className="text-white text-xl font-medium drop-shadow-md">
              AR Experience
            </h2>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full bg-black/50 text-white hover:bg-black/70"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-heritage-800/95 backdrop-blur-sm text-white border-heritage-700">
              <DropdownMenuItem 
                className="hover:bg-heritage-700 cursor-pointer"
                onClick={() => setShowInstructions(true)}
              >
                Instructions
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="hover:bg-heritage-700 cursor-pointer"
                onClick={() => navigate('/update-password')}
              >
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="hover:bg-heritage-700 cursor-pointer"
                onClick={handleSelectSite}
              >
                Select Historical Site
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Camera activation button */}
      <div className="absolute bottom-24 right-4 z-20">
        <Button
          variant="default"
          size="icon"
          className="rounded-full h-14 w-14 bg-accent hover:bg-accent/90 shadow-lg"
          onClick={handleCameraToggle}
        >
          <Camera className="h-6 w-6" />
        </Button>
      </div>
      
      {/* Instructions dialog/drawer */}
      {isMobile ? (
        <Drawer open={showInstructions} onOpenChange={setShowInstructions}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Instructions</DrawerTitle>
            </DrawerHeader>
            <div className="px-4">
              <Instructions />
            </div>
            <DrawerFooter>
              <Button onClick={() => setShowInstructions(false)}>Got it</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
          <DialogTrigger asChild>
            <span style={{display: 'none'}}></span>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Instructions</DialogTitle>
              <DialogDescription>
                Learn how to use AR mode effectively
              </DialogDescription>
            </DialogHeader>
            <Instructions />
            <DialogFooter>
              <Button onClick={() => setShowInstructions(false)}>Got it</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <div className="absolute bottom-8 left-0 right-0 flex justify-center z-10">
        <div className="bg-black/50 rounded-full backdrop-blur-sm p-1">
          <Button
            variant="default"
            size="sm"
            className="rounded-full bg-accent"
          >
            <View className="h-4 w-4 mr-1" />
            AR View
          </Button>
          <Button 
            variant="outline"
            size="sm"
            className="rounded-full bg-transparent text-white"
            onClick={handleGoToHistoricalSite}
          >
            <Box className="h-4 w-4 mr-1" />
            Historical Site
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ARExperience;
