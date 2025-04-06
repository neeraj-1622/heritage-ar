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
import { ArrowLeft, Info, Box, View, Menu, Camera, Box3d } from 'lucide-react';
import { defaultSites } from '@/backend/data/defaultSites';
import { supabase } from '@/lib/supabase';
import { HistoricalSite } from '@/lib/supabase';
import { ObjectModelData } from '@/utils/objectReconstructor';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

const ARExperience = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [showInstructions, setShowInstructions] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [objectDetection, setObjectDetection] = useState<{ class: string; score: number; model?: ObjectModelData } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSiteMenuOpen, setIsSiteMenuOpen] = useState(false);
  const [sitesList, setSitesList] = useState<HistoricalSite[]>(defaultSites);
  const [selectedSite, setSelectedSite] = useState<HistoricalSite | null>(null);
  const [isObjectView, setIsObjectView] = useState(false);

  const modelUrl = searchParams.get('modelUrl') || '/models/monument.glb';
  const siteName = searchParams.get('siteName') || '';
  
  useEffect(() => {
    const fetchSites = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('historical_sites')
          .select('*')
          .order('name');
        
        if (error) {
          console.error('Error fetching historical sites:', error);
          toast({
            title: 'Error',
            description: 'Failed to load historical sites',
            variant: 'destructive',
          });
        } else if (data) {
          const mappedSites: HistoricalSite[] = data.map(site => ({
            id: site.id,
            name: site.name,
            period: site.period,
            location: site.location,
            short_description: site.short_description,
            long_description: site.long_description || undefined,
            image_url: site.image_url,
            ar_model_url: site.ar_model_url || undefined,
            coordinates: site.coordinates ? 
              (typeof site.coordinates === 'string' 
                ? JSON.parse(site.coordinates) 
                : site.coordinates as { lat: number; lng: number }) 
              : undefined,
            created_at: site.created_at,
            updated_at: site.updated_at,
            created_by: site.created_by || undefined
          }));

          setSitesList(mappedSites);

          if (siteName) {
            const site = mappedSites.find(site => site.name === siteName);
            if (site) {
              setSelectedSite(site);
            }
          }
        }
      } catch (error) {
        console.error('Error in fetchSites:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSites();
    
    setTimeout(() => {
      handleCameraToggle();
    }, 1000);
  }, [searchParams]);

  const handleBackClick = () => {
    navigate('/');
  };
  
  const handleGoToHistoricalSite = () => {
    if (selectedSite) {
      navigate(`/historical-site?siteName=${encodeURIComponent(selectedSite.name)}`);
    } else {
      navigate('/historical-site');
    }
  };
  
  const handleSelectSite = (site: HistoricalSite) => {
    setSelectedSite(site);
    setIsSiteMenuOpen(false);
    setIsObjectView(false);

    toast({
      title: 'Selected Site',
      description: `Viewing ${site.name} in AR`,
      duration: 3000,
    });
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

  const handleObjectDetection = (detection: { class: string; score: number; model?: ObjectModelData } | null) => {
    if (detection && detection.model) {
      console.log("Received 3D model data from detector:", detection.model);
      setObjectDetection(detection);
      setIsObjectView(true);
      setIsCameraActive(false);
      
      toast({
        title: '3D Object Created',
        description: `Created 3D model of ${detection.class}`,
        duration: 5000,
      });
      return;
    }
    
    const humanClasses = ['person', 'man', 'woman', 'child', 'boy', 'girl', 'face', 'human'];
    
    if (detection && detection.score > 0.7 && !humanClasses.includes(detection.class.toLowerCase())) {
      setObjectDetection(detection);
      if (!objectDetection || objectDetection.class !== detection.class) {
        toast({
          title: `Detected ${detection.class}`,
          description: `Confidence: ${Math.round(detection.score * 100)}%`,
        });
      }
    } else if (!detection) {
      setObjectDetection(null);
    }
  };

  useEffect(() => {
    toast({
      title: 'AR Experience Loaded',
      description: 'Camera is being activated automatically',
      duration: 3000,
    });
  }, []);

  const Instructions = () => (
    <>
      <div className="space-y-4 mb-4">
        <h3 className="text-lg font-medium">How to use AR mode:</h3>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Point your camera at an object to analyze and create a 3D model</li>
          <li>The camera will ignore human faces and focus on objects</li>
          <li>To create a 3D model, click the 3D rotation button when an object is detected</li>
          <li>Slowly rotate the object to capture multiple angles during the scanning process</li>
          <li>After scanning, the 3D model will be displayed in AR view</li>
          <li>Click the "Historical Site" button to switch to historical site view</li>
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
          selectedSite={isObjectView ? null : selectedSite}
          detectedObjectModel={isObjectView && objectDetection?.model ? objectDetection.model : null}
          showModel={true}
          enableRotation={isObjectView}
          onInfoClick={() => {
            if (selectedSite || isObjectView) {
              setShowInstructions(true);
            }
          }}
          onNextSite={() => {
            if (isObjectView) {
              return;
            }
            
            if (sitesList.length > 0) {
              const currentIndex = selectedSite 
                ? sitesList.findIndex(site => site.id === selectedSite.id)
                : -1;
              const nextIndex = (currentIndex + 1) % sitesList.length;
              handleSelectSite(sitesList[nextIndex]);
            }
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
              {isObjectView && objectDetection?.model 
                ? `3D ${objectDetection.class}` 
                : 'AR Experience'}
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
              {isObjectView && (
                <DropdownMenuItem 
                  className="hover:bg-heritage-700 cursor-pointer"
                  onClick={() => setIsObjectView(false)}
                >
                  View Historical Sites
                </DropdownMenuItem>
              )}
              <DropdownMenuItem 
                className="hover:bg-heritage-700 cursor-pointer"
                onClick={() => navigate('/update-password')}
              >
                Update Password
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="hover:bg-heritage-700 cursor-pointer"
                onClick={() => setIsSiteMenuOpen(true)}
              >
                Select Historical Site
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="hover:bg-heritage-700 cursor-pointer"
                onClick={() => navigate('/')}
              >
                Home
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

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
      
      {isMobile ? (
        <Drawer open={showInstructions} onOpenChange={setShowInstructions}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>
                {isObjectView && objectDetection?.model 
                  ? `About ${objectDetection.class} 3D Model` 
                  : 'Instructions'}
              </DrawerTitle>
            </DrawerHeader>
            <div className="px-4">
              {isObjectView && objectDetection?.model ? (
                <div className="space-y-4">
                  <p>This is a 3D model created from camera analysis of a {objectDetection.class}.</p>
                  <p>The model was created by taking multiple images of the object from different angles and reconstructing its 3D structure.</p>
                </div>
              ) : (
                <Instructions />
              )}
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
              <DialogTitle>
                {isObjectView && objectDetection?.model 
                  ? `About ${objectDetection.class} 3D Model` 
                  : 'Instructions'}
              </DialogTitle>
              <DialogDescription>
                {isObjectView && objectDetection?.model 
                  ? 'Details about your 3D reconstructed object' 
                  : 'Learn how to use AR mode effectively'}
              </DialogDescription>
            </DialogHeader>
            
            {isObjectView && objectDetection?.model ? (
              <div className="space-y-4">
                <p>This is a 3D model created from camera analysis of a {objectDetection.class}.</p>
                <p>The model was created by taking multiple images of the object from different angles and reconstructing its 3D structure.</p>
                
                <div className="bg-heritage-100/10 p-3 rounded-md">
                  <h4 className="font-medium mb-1">Technical Details:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>Object type: {objectDetection.class}</li>
                    <li>Model color: {objectDetection.model.color}</li>
                    <li>Geometry type: {objectDetection.model.geometry}</li>
                    <li>Scale factor: {objectDetection.model.scale}</li>
                  </ul>
                </div>
              </div>
            ) : (
              <Instructions />
            )}
            
            <DialogFooter>
              <Button onClick={() => setShowInstructions(false)}>Got it</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {isCameraActive && (
        <div className="absolute top-16 left-0 right-0 z-20 flex justify-center">
          <div className={`px-4 py-2 rounded-full ${objectDetection ? 'bg-accent' : 'bg-heritage-800/70'} text-white text-sm backdrop-blur-sm transition-all duration-300`}>
            {objectDetection ? 
              `Detected: ${objectDetection.class} (${Math.round(objectDetection.score * 100)}%)` : 
              'No objects detected'}
          </div>
        </div>
      )}

      <div className="absolute bottom-8 left-0 right-0 flex justify-center z-10">
        <div className="bg-black/50 rounded-full backdrop-blur-sm p-1">
          <Button
            variant="default"
            size="sm"
            className={`rounded-full ${isObjectView ? 'bg-accent' : 'bg-transparent text-white'}`}
            onClick={() => setIsObjectView(true)}
            disabled={!objectDetection?.model}
          >
            <Box3d className="h-4 w-4 mr-1" />
            3D Object
          </Button>
          <Button
            variant={isObjectView ? "outline" : "default"}
            size="sm"
            className={`rounded-full ${!isObjectView ? 'bg-accent' : 'bg-transparent text-white'}`}
            onClick={() => setIsObjectView(false)}
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

      <Sheet open={isSiteMenuOpen} onOpenChange={setIsSiteMenuOpen}>
        <SheetContent side="bottom" className="h-[70vh] bg-heritage-800/95 text-white border-heritage-700">
          <SheetHeader>
            <SheetTitle className="text-white">Historical Sites</SheetTitle>
          </SheetHeader>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 max-h-[calc(70vh-120px)] overflow-y-auto">
            {sitesList.map((site) => (
              <Button 
                key={site.id}
                variant="outline"
                className={`justify-start h-auto py-2 px-3 border-heritage-700 ${
                  selectedSite?.id === site.id ? 'bg-accent/20 border-accent/50' : 'bg-heritage-700/50'
                }`}
                onClick={() => handleSelectSite(site)}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-md overflow-hidden">
                    <img src={site.image_url} alt={site.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium line-clamp-2">{site.name}</p>
                    <p className="text-[10px] opacity-75">{site.period}</p>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ARExperience;
