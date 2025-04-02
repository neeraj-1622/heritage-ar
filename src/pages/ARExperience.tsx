
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
import { ArrowLeft, Info, Box, View, History } from 'lucide-react';
import { defaultSites } from '@/backend/data/defaultSites';
import { supabase } from '@/lib/supabase';
import { HistoricalSite } from '@/lib/supabase';

const ARExperience = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [showInstructions, setShowInstructions] = useState(true);
  const [viewMode, setViewMode] = useState<'ar' | 'sketchfab'>('ar');
  const [sitesList, setSitesList] = useState<HistoricalSite[]>(defaultSites);
  const [selectedSite, setSelectedSite] = useState<HistoricalSite | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const modelUrl = searchParams.get('modelUrl') || '/models/monument.glb';
  const siteName = searchParams.get('siteName') || 'Historical Monument';
  
  const sketchfabModelId = searchParams.get('sketchfabId') || 'fa23b514e7564ebca473d7e041a07118'; // Default to Parthenon

  useEffect(() => {
    // Load historical sites from the database
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
          setSitesList(data);
          
          // Set initially selected site based on URL param
          if (siteName) {
            const site = data.find(site => site.name === siteName);
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
  }, [siteName]);

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

  const handleSiteSelect = (site: HistoricalSite) => {
    const params = new URLSearchParams(searchParams);
    params.set('siteName', site.name);
    setSelectedSite(site);
    
    // Set sketchfabId based on site name if available
    if (site.name === "Parthenon") {
      params.set('sketchfabId', 'fa23b514e7564ebca473d7e041a07118');
    } else if (site.name === "The Colosseum") {
      params.set('sketchfabId', '44fc46a0d04547f29b5ea0763fa0e43a');
    } else if (site.name === "Machu Picchu") {
      params.set('sketchfabId', 'a63454cea04e4d3c9980732b6ee53f07');
    } else if (site.name === "Taj Mahal") {
      params.set('sketchfabId', 'ba05e56f72f34b3eaf9b93ffa6001fa8');
    } else if (site.name === "Angkor Wat") {
      params.set('sketchfabId', '2ea9f5964f304b3eadf1030c4b33338d');
    } else if (site.name === "Chichen Itza") {
      params.set('sketchfabId', '6e5b69da9371448e8eebee160b10bfb8');
    }
    
    setSearchParams(params);
  };

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
        <ARView
          modelUrl={modelUrl}
          selectedSite={selectedSite || undefined}
          showModel={true} 
          enableRotation={false}
          onInfoClick={() => {
            // Handle info click if needed
          }}
          onNextSite={() => {
            const currentIndex = sitesList.findIndex(site => site.name === selectedSite?.name);
            const nextIndex = (currentIndex + 1) % sitesList.length;
            handleSiteSelect(sitesList[nextIndex]);
          }}
        />
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
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full bg-black/50 text-white hover:bg-black/70"
              onClick={() => setShowInstructions(true)}
            >
              <Info className="h-5 w-5" />
            </Button>
          </div>
        </div>
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
            onClick={() => {
              setViewMode('sketchfab');
            }}
          >
            <Box className="h-4 w-4 mr-1" />
            Historical Site
          </Button>
        </div>
      </div>
      
      {/* Site selector for Historical Site mode */}
      {viewMode === 'sketchfab' && (
        <div className="absolute top-16 left-6 right-6 z-10">
          <div className="bg-black/50 backdrop-blur-sm p-4 rounded-xl">
            <p className="text-white text-center font-medium mb-3">{siteName}</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[50vh] overflow-y-auto">
              {sitesList.map((site) => (
                <Button 
                  key={site.id}
                  variant="outline"
                  className={`justify-start h-auto py-2 px-3 border-white/10 ${
                    selectedSite?.id === site.id ? 'bg-accent/20 border-accent/50' : ''
                  }`}
                  onClick={() => handleSiteSelect(site)}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 rounded-md overflow-hidden">
                      <img src={site.image_url} alt={site.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-medium line-clamp-2">{site.name}</p>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ARExperience;
