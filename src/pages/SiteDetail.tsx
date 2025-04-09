import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HeartIcon, MapPinIcon, CalendarIcon, View, Box, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { isSiteFavorited, addToFavorites, removeFromFavorites } from '@/lib/supabase';
import type { HistoricalSite } from '@/lib/supabase';
import type { Database } from '../lib/database.types';

type DatabaseHistoricalSite = Database['public']['Tables']['historical_sites']['Row'];

const SiteDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [site, setSite] = useState<HistoricalSite | null>(null);
  const [loading, setLoading] = useState(true);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTab, setCurrentTab] = useState('description');
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Function to play audio narration using text-to-speech
  const playAudioNarration = () => {
    if (!site) {
      console.log("No site selected");
      return;
    }
    
    // Check if speech synthesis is available
    if (!window.speechSynthesis) {
      console.error("Speech synthesis not supported");
      toast({
        title: 'Speech Synthesis Not Available',
        description: 'Your browser does not support text-to-speech.',
        variant: 'destructive',
      });
      return;
    }

    // If speech is already playing, stop it
    if (isPlaying && window.speechSynthesis.speaking) {
      console.log("Stopping current speech");
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    try {
      // Create the text to be spoken based on current tab
      let text = '';
      if (currentTab === 'description') {
        text = `${site.name}. ${site.short_description}. ${site.long_description || ''}. Cultural Aspects: ${site.cultural_aspects || 'Cultural information about this site is currently being compiled.'}`;
      } else if (currentTab === 'mythology') {
        text = `${site.mythology || 'No mythological information is available for this site.'}`;
      }
      console.log("Text to speak:", text);
      
      // Create a new speech utterance
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configure speech settings
      utterance.rate = 0.9; // Slightly slower than default
      utterance.pitch = 1;
      utterance.volume = 1;
      
      // Add event listeners
      utterance.onstart = () => {
        console.log("Speech started");
        setIsPlaying(true);
      };
      
      utterance.onend = () => {
        console.log("Speech ended");
        setIsPlaying(false);
      };
      
      utterance.onerror = (e) => {
        console.error('Speech synthesis error:', e);
        setIsPlaying(false);
        toast({
          title: 'Speech Synthesis Failed',
          description: 'Unable to play the audio narration at this time.',
          variant: 'destructive',
        });
      };
      
      // Store the utterance in ref for future use
      speechRef.current = utterance;
      
      // Start speaking
      console.log("Starting speech synthesis");
      window.speechSynthesis.speak(utterance);
      
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

  // Stop speech when tab changes
  useEffect(() => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  }, [currentTab]);

  useEffect(() => {
    const fetchSiteDetail = async () => {
      if (!id) return;

      try {
        setLoading(true);
        console.log("Fetching site with ID:", id);

        const { data, error } = await supabase
          .from('historical_sites')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error("Error fetching site detail:", error);
          toast({
            title: "Error",
            description: "Failed to load site details. Please try again later.",
            variant: "destructive",
          });
          return;
        }

        console.log("Site data loaded:", data);
        
        // Create a properly typed site object from the database response
        const dbSite = data as DatabaseHistoricalSite;
        const typedSite: HistoricalSite = {
          id: dbSite.id,
          name: dbSite.name,
          period: dbSite.period,
          location: dbSite.location,
          short_description: dbSite.short_description,
          long_description: dbSite.long_description,
          mythology: dbSite.mythology,
          cultural_aspects: dbSite.cultural_aspects,
          image_url: dbSite.image_url,
          ar_model_url: dbSite.ar_model_url,
          coordinates: dbSite.coordinates,
          ar_enabled: dbSite.ar_enabled,
          created_by: dbSite.created_by,
          created_at: dbSite.created_at,
          updated_at: dbSite.updated_at
        };

        setSite(typedSite);

        // Check if site is favorited by current user
        if (isAuthenticated && user?.id) {
          const favStatus = await isSiteFavorited(user.id, id);
          setIsFavorite(favStatus);
        }
      } catch (err) {
        console.error("Error in fetchSiteDetail:", err);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSiteDetail();
  }, [id, isAuthenticated, user?.id]);

  const toggleFavorite = async () => {
    if (!isAuthenticated || !user?.id || !site?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to favorite sites",
        variant: "destructive",
      });
      return;
    }

    try {
      setFavoriteLoading(true);

      if (isFavorite) {
        const { error } = await removeFromFavorites(user.id, site.id);
        if (error) throw error;
        setIsFavorite(false);
        toast({ 
          title: "Removed from favorites",
          description: `${site.name} has been removed from your favorites` 
        });
      } else {
        const { error } = await addToFavorites(user.id, site.id);
        if (error) throw error;
        setIsFavorite(true);
        toast({ 
          title: "Added to favorites",
          description: `${site.name} has been added to your favorites` 
        });
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive",
      });
    } finally {
      setFavoriteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-heritage-950">
        <Header showBackButton />
        <div className="container mx-auto pt-24 pb-16 px-4 flex justify-center items-center">
          <Loader2 className="h-12 w-12 animate-spin text-heritage-300" />
        </div>
      </div>
    );
  }

  if (!site) {
    return (
      <div className="min-h-screen bg-heritage-950">
        <Header showBackButton />
        <div className="container mx-auto pt-24 pb-16 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-heritage-100">Site Not Found</h1>
            <p className="mb-6 text-heritage-300">The historical site you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/')}>Return Home</Button>
          </div>
        </div>
      </div>
    );
  }
  
  const handleViewInAR = () => {
    const params = new URLSearchParams();
    if (site.ar_model_url) {
      params.append('modelUrl', site.ar_model_url);
    }
    params.append('siteName', site.name);
    navigate(`/ar?${params.toString()}`);
  };

  const handleView3DModel = () => {
    const params = new URLSearchParams();
    params.append('siteName', site.name);
    if (site.ar_model_url) {
      params.append('modelUrl', site.ar_model_url);
    }
    navigate(`/historical-site?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-heritage-950">
      <Header showBackButton />
      
      <main className="container mx-auto pt-20 pb-16 px-4">
        <div className="relative rounded-xl overflow-hidden h-60 md:h-80 lg:h-96 mb-6">
          <img 
            src={site.image_url} 
            alt={site.name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback image if the original fails to load
              e.currentTarget.src = 'https://images.unsplash.com/photo-1564207550505-32a0f9c622b6?q=80&w=2065&auto=format&fit=crop';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">{site.name}</h1>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="inline-flex items-center bg-black/30 px-3 py-1 rounded-full">
                <MapPinIcon size={14} className="mr-1" />
                {site.location}
              </span>
              <span className="inline-flex items-center bg-black/30 px-3 py-1 rounded-full">
                <CalendarIcon size={14} className="mr-1" />
                {site.period}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-heritage-100">About this site</h2>
          <div className="flex space-x-2">
            {site.ar_model_url && site.ar_enabled && (
              <Button 
                className="bg-accent hover:bg-accent/90"
                onClick={handleViewInAR}
              >
                <View className="mr-2 h-4 w-4" />
                View in AR
              </Button>
            )}
            
            <Button 
              className="bg-heritage-700 hover:bg-heritage-600"
              onClick={handleView3DModel}
            >
              <Box className="mr-2 h-4 w-4" />
              View 3D Model
            </Button>

            <Button
              variant={isFavorite ? "default" : "outline"}
              className={`${
                isFavorite 
                  ? "bg-accent hover:bg-accent/90" 
                  : "border-heritage-700 hover:bg-heritage-800"
              }`}
              onClick={toggleFavorite}
              disabled={favoriteLoading}
            >
              <HeartIcon className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="description" className="space-y-4 mb-8" onValueChange={setCurrentTab}>
          <div className="flex justify-between items-center">
            <TabsList className="bg-heritage-800 text-heritage-200">
              <TabsTrigger value="description" className="data-[state=active]:bg-accent data-[state=active]:text-white">Description</TabsTrigger>
              <TabsTrigger value="mythology" className="data-[state=active]:bg-accent data-[state=active]:text-white">Mythology</TabsTrigger>
            </TabsList>
            
            <Button 
              variant="outline"
              size="icon"
              className={`rounded-full ${isPlaying ? 'bg-accent text-white' : 'bg-heritage-700/50 text-white'}`}
              onClick={playAudioNarration}
              title={isPlaying ? "Stop Audio Narration" : "Play Audio Narration"}
            >
              {isPlaying ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
          </div>
          
          <TabsContent value="description" className="bg-heritage-900 shadow-sm rounded-lg p-6 text-heritage-200 leading-relaxed border border-heritage-800">
            <div className="prose prose-invert max-w-none">
              <p className="text-lg mb-4 text-heritage-100">{site.short_description}</p>
              <p className="text-heritage-300">{site.long_description || "No detailed description available for this historical site."}</p>
            </div>
          </TabsContent>
          
          <TabsContent value="mythology" className="bg-heritage-900 shadow-sm rounded-lg p-6 text-heritage-200 leading-relaxed border border-heritage-800">
            <div className="prose prose-invert max-w-none">
              <p className="text-heritage-300">
                {site.mythology || "Mythological information about this site is currently being compiled."}
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-heritage-100 mb-4">Cultural Aspects</h2>
          <div className="bg-heritage-900 shadow-sm rounded-lg p-6 text-heritage-200 leading-relaxed border border-heritage-800">
            <div className="prose prose-invert max-w-none">
              <p className="text-heritage-300">
                {site.cultural_aspects || "Cultural information about this site is currently being compiled."}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SiteDetail;
