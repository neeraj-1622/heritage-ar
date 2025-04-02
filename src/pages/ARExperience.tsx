
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import ARView from '@/components/ARView';
import SketchfabEmbed from '@/components/SketchfabEmbed';
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
import { useIsMobile } from '@/hooks/use-mobile';
import { ArrowLeft, Info, Box, View } from 'lucide-react';

const ARExperience = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [showInstructions, setShowInstructions] = useState(true);
  const [viewMode, setViewMode] = useState<'ar' | 'sketchfab'>('ar');

  const modelUrl = searchParams.get('modelUrl') || '/models/monument.glb';
  const siteName = searchParams.get('siteName') || 'Historical Monument';
  
  const sketchfabModelId = searchParams.get('sketchfabId') || 'fa23b514e7564ebca473d7e041a07118'; // Default to Parthenon

  const handleBackClick = () => {
    navigate(-1);
  };

  useEffect(() => {
    toast({
      title: 'AR Experience Loaded',
      description: viewMode === 'ar' ? 
        'Move your device around to place the 3D model in your environment' : 
        '3D model loaded from Sketchfab. You can rotate and zoom.',
      duration: 5000,
    });
  }, [viewMode]);

  const Instructions = () => (
    <>
      <div className="space-y-4 mb-4">
        <h3 className="text-lg font-medium">How to use {viewMode === 'ar' ? 'AR' : '3D'} mode:</h3>
        {viewMode === 'ar' ? (
          <ol className="list-decimal pl-5 space-y-2">
            <li>Allow camera access when prompted</li>
            <li>Slowly move your device to scan the environment</li>
            <li>Tap on a flat surface (floor, table) to place the model</li>
            <li>Pinch to resize or drag to reposition</li>
          </ol>
        ) : (
          <ol className="list-decimal pl-5 space-y-2">
            <li>Click and drag to rotate the model</li>
            <li>Scroll to zoom in and out</li>
            <li>Double-click to focus on specific parts</li>
            <li>Use the controls at the bottom of the viewer for more options</li>
          </ol>
        )}
      </div>
    </>
  );

  return (
    <div className="h-screen w-screen bg-black overflow-hidden relative">
      {viewMode === 'ar' ? (
        <ARView modelUrl={modelUrl} />
      ) : (
        <SketchfabEmbed 
          modelId={sketchfabModelId}
          title={siteName}
          autoSpin={true}
          autoStart={true}
          className="h-full w-full"
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
                <Button variant="outline" size="icon" className="rounded-full bg-black/50 text-white hover:bg-black/70">
                  <Info className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Instructions</DialogTitle>
                  <DialogDescription>
                    Learn how to use {viewMode === 'ar' ? 'AR' : '3D'} mode effectively
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

      <div className="absolute bottom-8 left-0 right-0 flex justify-center z-10">
        <div className="bg-black/50 rounded-full backdrop-blur-sm p-1">
          <Button
            variant={viewMode === 'ar' ? 'default' : 'outline'} 
            size="sm"
            className={`rounded-full ${viewMode === 'ar' ? 'bg-accent' : 'bg-transparent text-white'}`}
            onClick={() => setViewMode('ar')}
          >
            <View className="h-4 w-4 mr-1" />
            AR View
          </Button>
          <Button 
            variant={viewMode === 'sketchfab' ? 'default' : 'outline'}
            size="sm"
            className={`rounded-full ${viewMode === 'sketchfab' ? 'bg-accent' : 'bg-transparent text-white'}`}
            onClick={() => setViewMode('sketchfab')}
          >
            <Box className="h-4 w-4 mr-1" />
            3D Model
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ARExperience;
