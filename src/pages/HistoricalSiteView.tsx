
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useGLTF } from '@react-three/drei';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { ArrowLeft, Box, View, Menu, Info } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { HistoricalSite } from '@/lib/supabase';
import { defaultSites } from '@/backend/data/defaultSites';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Model component to display 3D GLB models
const Model = ({ url }: { url: string }) => {
  const { scene } = useGLTF(url);
  
  return (
    <primitive object={scene} position={[0, 0, 0]} scale={1} />
  );
};

// Fallback model when no model is available
const PlaceholderModel = () => {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="white" wireframe />
    </mesh>
  );
};

const HistoricalSiteView = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [sitesList, setSitesList] = useState<HistoricalSite[]>(defaultSites);
  const [selectedSite, setSelectedSite] = useState<HistoricalSite | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSiteMenuOpen, setIsSiteMenuOpen] = useState(false);
  const [showSiteInfo, setShowSiteInfo] = useState(false);
  
  // Get site name and model URL from URL
  const siteName = searchParams.get('siteName') || '';
  const modelUrl = searchParams.get('modelUrl') || '';

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
    navigate('/');
  };

  const handleGoToAR = () => {
    if (selectedSite) {
      const params = new URLSearchParams();
      params.append('siteName', selectedSite.name);
      if (selectedSite.ar_model_url) {
        params.append('modelUrl', selectedSite.ar_model_url);
      }
      navigate(`/ar?${params.toString()}`);
    } else {
      navigate('/ar');
    }
  };

  const handleSiteSelect = (site: HistoricalSite) => {
    const params = new URLSearchParams(searchParams);
    params.set('siteName', site.name);
    
    // Add model URL if available
    if (site.ar_model_url) {
      params.set('modelUrl', site.ar_model_url);
    } else {
      params.delete('modelUrl');
    }
    
    setSelectedSite(site);
    setSearchParams(params);
    setIsSiteMenuOpen(false);

    toast({
      title: 'Selected Site',
      description: `Viewing ${site.name} in 3D`,
      duration: 3000,
    });
  };

  // Function to get the effective model URL (either from the selected site or from URL params)
  const getEffectiveModelUrl = () => {
    if (modelUrl) return modelUrl;
    if (selectedSite?.ar_model_url) return selectedSite.ar_model_url;
    return '';
  };

  return (
    <div className="h-screen w-screen bg-heritage-900 overflow-hidden relative">
      {/* 3D Model View */}
      <div className="h-full w-full">
        <Canvas>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          
          {getEffectiveModelUrl() ? (
            <Model url={getEffectiveModelUrl()} />
          ) : (
            <PlaceholderModel />
          )}
          
          <OrbitControls enableZoom={true} autoRotate={true} autoRotateSpeed={0.5} />
        </Canvas>
      </div>
      
      {/* Top Navigation */}
      <div className="absolute top-0 left-0 right-0 p-4 z-20">
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
              {selectedSite?.name || 'Historical Site Viewer'}
            </h2>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outline" 
              size="icon" 
              className="rounded-full bg-black/50 text-white hover:bg-black/70"
              onClick={() => setShowSiteInfo(true)}
            >
              <Info className="h-5 w-5" />
            </Button>
            
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
                  onClick={() => setIsSiteMenuOpen(true)}
                >
                  Select Historical Site
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="hover:bg-heritage-700 cursor-pointer"
                  onClick={() => navigate('/update-password')}
                >
                  Update Password
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
      </div>

      {/* Site Information Dialog */}
      <AlertDialog open={showSiteInfo} onOpenChange={setShowSiteInfo}>
        <AlertDialogContent className="bg-heritage-800/95 backdrop-blur-sm text-white border-heritage-700">
          <AlertDialogHeader>
            <AlertDialogTitle>{selectedSite?.name || 'Historical Site Info'}</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              {selectedSite ? (
                <>
                  <p className="text-gray-200 mb-2"><strong>Period:</strong> {selectedSite.period}</p>
                  <p className="text-gray-200 mb-2"><strong>Location:</strong> {selectedSite.location}</p>
                  <p className="text-gray-300">{selectedSite.long_description || selectedSite.short_description}</p>
                </>
              ) : (
                <p>Select a historical site to view detailed information.</p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction className="bg-accent hover:bg-accent/90">
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Mode Switch Buttons */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center z-10">
        <div className="bg-black/50 rounded-full backdrop-blur-sm p-1">
          <Button
            variant="outline" 
            size="sm"
            className="rounded-full bg-transparent text-white"
            onClick={handleGoToAR}
          >
            <View className="h-4 w-4 mr-1" />
            AR View
          </Button>
          <Button 
            variant="default"
            size="sm"
            className="rounded-full bg-accent"
          >
            <Box className="h-4 w-4 mr-1" />
            Historical Site
          </Button>
        </div>
      </div>
      
      {/* Site Selector Sheet */}
      <Sheet open={isSiteMenuOpen} onOpenChange={setIsSiteMenuOpen}>
        <SheetContent side="bottom" className="h-[70vh] bg-heritage-800/95 text-white border-heritage-700">
          <SheetHeader>
            <SheetTitle className="text-white">Historical Sites</SheetTitle>
            <SheetDescription className="text-heritage-300">
              Select a site to view in 3D
            </SheetDescription>
          </SheetHeader>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 max-h-[calc(70vh-120px)] overflow-y-auto">
            {sitesList.map((site) => (
              <Button 
                key={site.id}
                variant="outline"
                className={`justify-start h-auto py-2 px-3 border-heritage-700 ${
                  selectedSite?.id === site.id ? 'bg-accent/20 border-accent/50' : 'bg-heritage-700/50'
                }`}
                onClick={() => handleSiteSelect(site)}
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
      
      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-heritage-900/80 z-50">
          <div className="h-12 w-12 border-4 border-t-accent border-r-accent/30 border-b-accent/10 border-l-accent/60 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default HistoricalSiteView;
