import React, { useState, useEffect, Suspense, useRef } from 'react';
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
import { ArrowLeft, Box, View, Menu, Info, Volume2, VolumeX } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { HistoricalSite } from '@/lib/supabase';
import { defaultSites } from '@/backend/data/defaultSites';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import * as THREE from 'three';

const Model = ({ url }: { url: string }) => {
  const { scene } = useGLTF(url);
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    if (scene) {
      // Center the model
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      scene.position.sub(center);
      
      setLoaded(true);
      console.log("3D Model loaded successfully:", url);
    }
  }, [scene, url]);

  return (
    <primitive 
      object={scene} 
      position={[0, 0, 0]} 
      scale={1} 
      onPointerOver={() => document.body.style.cursor = 'pointer'} 
      onPointerOut={() => document.body.style.cursor = 'default'}
    />
  );
};

const PlaceholderModel = () => {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="white" wireframe />
    </mesh>
  );
};

const ModelWithFallback = ({ url }: { url: string }) => {
  return (
    <Suspense fallback={<PlaceholderModel />}>
      <Model url={url} />
    </Suspense>
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
  const [zoomLevel, setZoomLevel] = useState<number>(8);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  const siteName = searchParams.get('siteName') || '';
  const modelUrl = searchParams.get('modelUrl') || '';

  const MODEL_MAPPINGS: Record<string, string> = {
    'The Colosseum': '/models/colosseum.glb',
    'Parthenon': '/models/parthenon.glb',
    'Taj Mahal': '/models/taj_mahal.glb',
    'Stonehenge': '/models/stonehenge.glb',
    'Great Pyramid of Giza': '/models/pyramid.glb',
    'Machu Picchu': '/models/machupicchu.glb', 
    'default': '/models/parthenon.glb'
  };

  const getEffectiveModelUrl = () => {
    if (modelUrl) return modelUrl;
    if (selectedSite?.ar_model_url) return selectedSite.ar_model_url;
    if (selectedSite?.name && MODEL_MAPPINGS[selectedSite.name]) {
      return MODEL_MAPPINGS[selectedSite.name];
    }
    return MODEL_MAPPINGS.default;
  };

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

          setSitesList(mappedSites.length > 0 ? mappedSites : defaultSites);
          
          if (siteName) {
            const site = mappedSites.find(site => site.name === siteName) || 
                         defaultSites.find(site => site.name === siteName);
            if (site) {
              setSelectedSite(site);
              console.log("Selected site:", site.name, "with model:", site.ar_model_url || "none");
            }
          }
        }
      } catch (error) {
        console.error('Error in fetchSites:', error);
        setSitesList(defaultSites);
        
        if (siteName) {
          const site = defaultSites.find(site => site.name === siteName);
          if (site) {
            setSelectedSite(site);
          }
        }
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
      } else if (MODEL_MAPPINGS[selectedSite.name]) {
        params.append('modelUrl', MODEL_MAPPINGS[selectedSite.name]);
      }
      navigate(`/ar?${params.toString()}`);
    } else {
      navigate('/ar');
    }
  };

  const handleSiteSelect = (site: HistoricalSite) => {
    const params = new URLSearchParams(searchParams);
    params.set('siteName', site.name);
    
    if (site.ar_model_url) {
      params.set('modelUrl', site.ar_model_url);
    } else if (MODEL_MAPPINGS[site.name]) {
      params.set('modelUrl', MODEL_MAPPINGS[site.name]);
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

  // Function to play audio narration using text-to-speech
  const playAudioNarration = () => {
    if (!selectedSite) return;
    
    // If speech is already playing, stop it
    if (isPlaying && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    try {
      // Create the text to be spoken
      const text = `${selectedSite.name}. ${selectedSite.period}. Located in ${selectedSite.location}. ${selectedSite.long_description || selectedSite.short_description}`;
      
      // Create a new speech utterance if it doesn't exist
      if (!speechRef.current) {
        speechRef.current = new SpeechSynthesisUtterance(text);
        
        // Configure speech settings
        speechRef.current.rate = 0.9; // Slightly slower than default
        speechRef.current.pitch = 1;
        
        // Add event listeners
        speechRef.current.onend = () => {
          setIsPlaying(false);
        };
        
        speechRef.current.onerror = (e) => {
          console.error('Speech synthesis error:', e);
          setIsPlaying(false);
          toast({
            title: 'Speech Synthesis Failed',
            description: 'Unable to play the audio narration at this time.',
            variant: 'destructive',
          });
        };
      } else {
        // Update text if it's a different site
        speechRef.current.text = text;
      }
      
      // Start speaking
      window.speechSynthesis.speak(speechRef.current);
      setIsPlaying(true);
      
    } catch (err) {
      console.error('Failed to start speech synthesis:', err);
      setIsPlaying(false);
      toast({
        title: 'Speech Synthesis Failed',
        description: 'Unable to play the audio narration at this time.',
        variant: 'destructive',
      });
    }
  };
  
  // Clean up speech synthesis when component unmounts
  useEffect(() => {
    return () => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);
  
  // Stop speech when selected site changes
  useEffect(() => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  }, [selectedSite]);

  return (
    <div className="h-screen w-screen bg-heritage-900 overflow-hidden relative">
      <div className="h-full w-full">
        <Canvas>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <PerspectiveCamera makeDefault position={[0, 0, zoomLevel]} />
          
          <ModelWithFallback url={getEffectiveModelUrl()} />
          
          <OrbitControls 
            enableZoom={true} 
            autoRotate={false}
            enablePan={true}
            enableRotate={true}
            minDistance={2}
            maxDistance={40}
            zoomSpeed={1.5}
          />
        </Canvas>
      </div>
      
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
          
          <div className="flex gap-2">
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
                  onClick={() => navigate('/')}
                >
                  Home
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <AlertDialog open={showSiteInfo} onOpenChange={(open) => {
        setShowSiteInfo(open);
        // Stop speech when dialog is closed
        if (!open && window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel();
          setIsPlaying(false);
        }
      }}>
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
          <AlertDialogFooter className="flex justify-between items-center">
            <Button 
              variant="outline"
              size="icon"
              className={`rounded-full ${isPlaying ? 'bg-accent text-white' : 'bg-heritage-700/50 text-white'}`}
              onClick={playAudioNarration}
              title={isPlaying ? "Stop Audio Narration" : "Play Audio Narration"}
            >
              {isPlaying ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <AlertDialogAction className="bg-accent hover:bg-accent/90">
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
      
      {/* Zoom controls - now hidden but keeping the code in case we want to restore later */}
      {/* 
      <div className="absolute bottom-20 right-4 z-20 flex flex-col gap-2">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-black/50 text-white hover:bg-black/70"
          onClick={() => setZoomLevel(prev => Math.max(2, prev - 1.5))}
          title="Zoom In"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="11" y1="8" x2="11" y2="14"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-black/50 text-white hover:bg-black/70"
          onClick={() => setZoomLevel(prev => Math.min(40, prev + 1.5))}
          title="Zoom Out"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-black/50 text-white hover:bg-black/70"
          onClick={() => setZoomLevel(40)}
          title="Maximum Zoom Out"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h6v6"></path>
            <path d="M10 14L21 3"></path>
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
          </svg>
        </Button>
      </div>
      */}
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-heritage-900/80 z-50">
          <div className="h-12 w-12 border-4 border-t-accent border-r-accent/30 border-b-accent/10 border-l-accent/60 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default HistoricalSiteView;
