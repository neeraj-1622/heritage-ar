import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HeartIcon, MapPinIcon, CalendarIcon, View, Box, Loader2 } from 'lucide-react';
import { isSiteFavorited, addToFavorites, removeFromFavorites } from '@/lib/supabase';
import type { HistoricalSite } from '@/lib/supabase';

const SiteDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [site, setSite] = useState<HistoricalSite | null>(null);
  const [loading, setLoading] = useState(true);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

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
        setSite(data as HistoricalSite);

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
      <div className="min-h-screen bg-heritage-50">
        <Header showBackButton />
        <div className="container mx-auto pt-24 pb-16 px-4 flex justify-center items-center">
          <Loader2 className="h-12 w-12 animate-spin text-heritage-600" />
        </div>
      </div>
    );
  }

  if (!site) {
    return (
      <div className="min-h-screen bg-heritage-50">
        <Header showBackButton />
        <div className="container mx-auto pt-24 pb-16 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Site Not Found</h1>
            <p className="mb-6">The historical site you're looking for doesn't exist or has been removed.</p>
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
    <div className="min-h-screen bg-heritage-50">
      <Header showBackButton />
      
      <main className="container mx-auto pt-20 pb-16 px-4">
        <div className="relative rounded-xl overflow-hidden h-60 md:h-80 lg:h-96 mb-6">
          <img 
            src={site.image_url} 
            alt={site.name} 
            className="w-full h-full object-cover"
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
          <h2 className="text-2xl font-bold">About this site</h2>
          <div className="flex space-x-2">
            {site.ar_model_url && (
              <Button 
                className="bg-accent hover:bg-accent/90"
                onClick={handleViewInAR}
              >
                <View className="mr-2 h-4 w-4" />
                View in AR
              </Button>
            )}
            
            {site.ar_model_url && (
              <Button 
                variant="outline"
                onClick={handleView3DModel}
              >
                <Box className="mr-2 h-4 w-4" />
                View 3D Model
              </Button>
            )}
            
            <Button
              variant={isFavorite ? "default" : "outline"}
              onClick={toggleFavorite}
              disabled={favoriteLoading}
              className={isFavorite ? "bg-red-500 hover:bg-red-600" : ""}
            >
              {favoriteLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <HeartIcon className={`h-4 w-4 ${isFavorite ? "fill-white" : ""}`} />
              )}
              <span className="ml-2">{isFavorite ? "Favorited" : "Favorite"}</span>
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="description" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="text-gray-700 leading-relaxed">
            <div className="prose prose-slate max-w-none">
              <p className="text-lg mb-4">{site.short_description}</p>
              <p>{site.long_description || "No detailed description available for this historical site."}</p>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="text-gray-700 leading-relaxed">
            <div className="prose prose-slate max-w-none">
              <p className="text-lg mb-4">
                {site.name} is from the {site.period} period and is located in {site.location}.
              </p>
              <p>{site.long_description || "Historical information about this site is currently being compiled."}</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default SiteDetail;
