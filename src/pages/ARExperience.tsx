
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import ARView from '@/components/ARView';
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
import { ArrowLeft, Info, Box, View, Menu } from 'lucide-react';
import { defaultSites } from '@/backend/data/defaultSites';
import { supabase } from '@/lib/supabase';
import { HistoricalSite } from '@/lib/supabase';
import { Json } from '@/integrations/supabase/types';
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
  const [sitesList, setSitesList] = useState<HistoricalSite[]>(defaultSites);
  const [selectedSite, setSelectedSite] = useState<HistoricalSite | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const modelUrl = searchParams.get('modelUrl') || '/models/monument.glb';
  const siteName = searchParams.get('siteName') || 'Historical Monument';
  
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
          // Map the database response to match the HistoricalSite type
          const mappedSites: HistoricalSite[] = data.map(site => ({
            id: site.id,
            name: site.name,
            period: site.period,
            location: site.location,
            short_description: site.short_description,
            long_description: site.long_description || undefined,
            image_url: site.image_url,
            ar_model_url: site.ar_model_url || undefined,
            // Parse coordinates from Json to the expected format
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
          
          // Set initially selected site based on URL param
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
  }, [siteName]);

  const handleBackClick = () => {
    navigate(-1);
  };
  
  const handleGoToHistoricalSite = () => {
    navigate('/historical-site');
  };

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
      <ARView
        modelUrl={modelUrl}
        selectedSite={selectedSite}
        showModel={true} 
        enableRotation={false}
        onInfoClick={() => {
          // Handle info click if needed
        }}
        onNextSite={() => {
          const currentIndex = sitesList.findIndex(site => site.name === selectedSite?.name);
          const nextIndex = (currentIndex + 1) % sitesList.length;
          setSelectedSite(sitesList[nextIndex]);
        }}
      />
      
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
            </DropdownMenuContent>
          </DropdownMenu>
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
