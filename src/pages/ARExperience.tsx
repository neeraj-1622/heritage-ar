
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import ARView from '@/components/ARView';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
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
import { useMobile } from '@/hooks/use-mobile';
import { ArrowLeft, Info, Settings } from 'lucide-react';

const ARExperience = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isMobile = useMobile();
  const [showInstructions, setShowInstructions] = useState(true);

  // Get model URL and site name from URL parameters
  const modelUrl = searchParams.get('modelUrl') || '/models/monument.glb';
  const siteName = searchParams.get('siteName') || 'Historical Monument';

  const handleBackClick = () => {
    navigate(-1);
  };

  // Show instructions toast on load
  useEffect(() => {
    toast({
      title: 'AR Experience Loaded',
      description: 'Move your device around to place the 3D model in your environment',
      duration: 5000,
    });
  }, []);

  const Instructions = () => (
    <>
      <div className="space-y-4 mb-4">
        <h3 className="text-lg font-medium">How to use AR mode:</h3>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Allow camera access when prompted</li>
          <li>Slowly move your device to scan the environment</li>
          <li>Tap on a flat surface (floor, table) to place the model</li>
          <li>Pinch to resize or drag to reposition</li>
        </ol>
      </div>
    </>
  );

  return (
    <div className="h-screen w-screen bg-black overflow-hidden relative">
      <ARView modelPath={modelUrl} />
      
      {/* Overlay Controls */}
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
          
          <h1 className="text-white font-medium text-xl">
            {siteName}
          </h1>
          
          {isMobile ? (
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full bg-black/50 text-white hover:bg-black/70">
                  <Info className="h-5 w-5" />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>AR Instructions</DrawerTitle>
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
                <Button variant="outline" size="icon" className="rounded-full bg-black/50 text-white hover:bg-black/70">
                  <Info className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>AR Instructions</DialogTitle>
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
        </div>
      </div>
    </div>
  );
};

export default ARExperience;
